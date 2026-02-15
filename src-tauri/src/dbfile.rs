use std::fs;
use tauri::{AppHandle, Manager, State};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};
use chrono::Local; 
use rusqlite::Connection;
use crate::Db; 

// -- EKSPORT --
#[tauri::command]
pub fn export_database(app_handle: AppHandle) -> Result<String, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Błąd katalogu aplikacji: {}", e))?;
    let db_path = app_dir.join("archivio.db");

    if !db_path.exists() {
        return Err("Plik bazy danych nie istnieje.".to_string());
    }

    let now = Local::now();
    let file_name = format!("archivio_{}.db", now.format("%Y-%m-%d_%H-%M-%S"));

    let documents_path = app_handle
        .path()
        .document_dir()
        .map_err(|e| format!("Nie udało się znaleźć folderu Dokumenty: {}", e))?;

    let file_path = app_handle
        .dialog()
        .file()
        .set_title("Eksportuj bazę danych")
        .set_directory(documents_path)
        .set_file_name(file_name)
        .add_filter("Baza danych SQLite", &["db", "sqlite"])
        .blocking_save_file();

    match file_path {
        Some(destination) => {
            let dest_path = destination
                .into_path()
                .map_err(|_| "Nieprawidłowa ścieżka zapisu.".to_string())?;

            fs::copy(&db_path, &dest_path)
                .map_err(|e| format!("Błąd kopiowania: {}", e))?;

            Ok("Eksport zakończony sukcesem.".to_string())
        }
        None => Err("Eksport został anulowany.".to_string()),
    }
}

// -- IMPORT --
#[tauri::command]
pub fn import_database(app_handle: AppHandle, state: State<'_, Db>) -> Result<String, String> {
    let documents_path = app_handle
        .path()
        .document_dir()
        .map_err(|e| format!("Błąd ścieżki: {}", e))?;
    
    let file_path = app_handle
        .dialog()
        .file()
        .set_title("Importuj bazę danych")
        .set_directory(documents_path)
        .add_filter("Baza danych SQLite", &["db", "sqlite"])
        .blocking_pick_file();

    match file_path {
        Some(source) => {
            let src_path = source.into_path()
                .map_err(|_| "Nieprawidłowa ścieżka pliku źródłowego.".to_string())?;

            let app_dir = app_handle.path().app_data_dir()
                .map_err(|e| format!("Błąd katalogu aplikacji: {}", e))?;
            let db_path = app_dir.join("archivio.db");

            // 1. ZWOLNIENIE PLIKU: Podmieniamy połączenie na tymczasowe w RAM
            {
                let mut conn_guard = state.0.lock()
                    .map_err(|_| "Błąd blokady bazy danych".to_string())?;
                
                let temp_conn = Connection::open_in_memory()
                    .map_err(|e| format!("Błąd pamięci RAM: {}", e))?;
                
                *conn_guard = temp_conn; 
                // W tym momencie archivio.db jest wolny
            }

            // 2. Operacje na systemie plików
            if db_path.exists() {
                let now = Local::now();
                let old_db_name = format!("archivio_{}.old", now.format("%Y-%m-%d_%H-%M-%S"));
                let old_db_path = app_dir.join(old_db_name);
                
                fs::rename(&db_path, &old_db_path)
                    .map_err(|e| format!("Błąd podczas zabezpieczania starej bazy: {}", e))?;
            }

            fs::copy(&src_path, &db_path)
                .map_err(|e| format!("Błąd podczas kopiowania nowej bazy: {}", e))?;

            // 3. ODŚWIEŻENIE: Otwarcie nowego pliku
            {
                let mut conn_guard = state.0.lock()
                    .map_err(|_| "Błąd blokady bazy danych".to_string())?;
                
                let new_conn = Connection::open(&db_path)
                    .map_err(|e| format!("Nie udało się otworzyć nowej bazy: {}", e))?;
                
                *conn_guard = new_conn;
            }

            Ok("Baza danych została pomyślnie zaimportowana.".to_string())
        }
        None => Err("Import został anulowany.".to_string()),
    }
}

// -- RESET --
#[tauri::command]
pub fn reset_database(app_handle: AppHandle, state: State<'_, Db>) -> Result<String, String> {
    let confirmed = app_handle
        .dialog()
        .message("Czy na pewno chcesz zresetować bazę danych? Obecny plik zostanie zachowany jako kopia zapasowa.")
        .title("Potwierdzenie resetu")
        .buttons(MessageDialogButtons::OkCancelCustom(
            "Resetuj".to_string(),
            "Anuluj".to_string() 
        ))
        .blocking_show();

    if !confirmed {
        return Err("Resetowanie anulowane.".to_string());
    }

    let app_dir = app_handle.path().app_data_dir()
        .map_err(|e| format!("Błąd katalogu: {}", e))?;
    let db_path = app_dir.join("archivio.db");

    if !db_path.exists() {
        return Err("Plik bazy danych nie istnieje.".to_string());
    }

    {
        let mut conn_guard = state.0.lock()
            .map_err(|_| "Błąd blokady bazy danych".to_string())?;
        
        let temp_conn = Connection::open_in_memory()
            .map_err(|e| format!("Błąd pamięci RAM: {}", e))?;
        
        *conn_guard = temp_conn;
    }

    let now = Local::now();
    let old_db_name = format!("archivio_{}.old", now.format("%Y-%m-%d_%H-%M-%S"));
    let old_db_path = app_dir.join(old_db_name);

    fs::rename(&db_path, &old_db_path)
        .map_err(|e| format!("Błąd podczas zmiany nazwy pliku: {}", e))?;

    {
        let mut conn_guard = state.0.lock()
            .map_err(|_| "Błąd blokady bazy danych".to_string())?;

        let new_conn = Connection::open(&db_path)
            .map_err(|e| format!("Błąd tworzenia nowej bazy: {}", e))?;
        
        crate::shelves::init_shelves(&new_conn);
        crate::sets::init_sets(&new_conn);
        crate::folders::init_folders(&new_conn);

        *conn_guard = new_conn;
    }

    Ok("Baza danych została zresetowana. Stary plik został zachowany jako kopia zapasowa.".to_string())
}