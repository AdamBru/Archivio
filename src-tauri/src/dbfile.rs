use std::fs;
use tauri::{AppHandle, Manager, State};
use tauri_plugin_dialog::DialogExt;
use chrono::Local; 
use rusqlite::Connection;
use crate::Db; 

#[tauri::command]
pub fn export_database(app_handle: AppHandle) -> Result<String, String> {
    // 1. Ścieżka źródłowa (Twoja baza danych)
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Błąd katalogu aplikacji: {}", e))?;
    let db_path = app_dir.join("archivio.db");

    if !db_path.exists() {
        return Err("Plik bazy danych nie istnieje.".to_string());
    }

    // 2. Przygotowanie domyślnej nazwy pliku z datą i godziną
    // Format: archivio_2024-05-20_14-30-05.db
    let now = Local::now();
    let file_name = format!("archivio_{}.db", now.format("%Y-%m-%d_%H-%M-%S"));

    // 3. Pobranie ścieżki do Dokumentów użytkownika
    let documents_path = app_handle
        .path()
        .document_dir()
        .map_err(|e| format!("Nie udało się znaleźć folderu Dokumenty: {}", e))?;

    // 4. Wywołanie okna dialogowego
    let file_path = app_handle
        .dialog()
        .file()
        .set_title("Eksportuj bazę dancyh")
        .set_directory(documents_path) // Ustawienie Dokumentów jako start
        .set_file_name(file_name)
        .add_filter("Baza danych SQLite", &["db", "sqlite"])
        .blocking_save_file();

    // 5. Kopiowanie pliku
    match file_path {
        Some(destination) => {
            let dest_path = destination
                .into_path()
                .map_err(|_| "Nieprawidłowa ścieżka zapisu.".to_string())?;

            fs::copy(&db_path, &dest_path)
                .map_err(|e| format!("Błąd kopiowania: {}", e))?;

            Ok(format!("Eksport zakończony sukcesem."))
        }
        None => Err("Eksport został anulowany.".to_string()),
    }
}

#[tauri::command]
pub fn import_database(app_handle: AppHandle, state: State<'_, Db>) -> Result<String, String> {
	// Pobranie ścieżki do Dokumentów użytkownika
    let documents_path = app_handle
	.path()
	.document_dir()
	.map_err(|e| format!("Nie udało się znaleźć folderu Dokumenty: {}", e))?;
	
    // 1. Wybór pliku do importu
    let file_path = app_handle
        .dialog()
        .file()
        .set_title("Importuj bazę danych")
        .set_directory(documents_path) // Ustawienie Dokumentów jako start
        .add_filter("Baza danych SQLite", &["db", "sqlite"])
        .blocking_pick_file();

    match file_path {
        Some(source) => {
            let src_path = source.into_path()
                .map_err(|_| "Nieprawidłowa ścieżka pliku źródłowego.".to_string())?;

            // 2. Ustalenie ścieżki docelowej (tam gdzie aplikacja trzyma bazę)
            let app_dir = app_handle.path().app_data_dir()
                .map_err(|e| format!("Błąd katalogu aplikacji: {}", e))?;
            let db_path = app_dir.join("archivio.db");

            // 3. Krytyczny krok: Zablokowanie i zamknięcie starego połączenia
            {
                let mut conn_guard = state.0.lock()
                    .map_err(|_| "Błąd blokady bazy danych (PoisonError)".to_string())?;
                
                // Backup obecnej bazy przed nadpisaniem (na wszelki wypadek)
                let backup_old = app_dir.join("archivio.db.old");
                let _ = fs::copy(&db_path, &backup_old);

                fs::copy(&src_path, &db_path)
                    .map_err(|e| format!("Błąd podczas nadpisywania bazy: {}", e))?;

                // 4. Ponowne otwarcie połączenia do nowego pliku
                let new_conn = Connection::open(&db_path)
                    .map_err(|e| format!("Nie udało się otworzyć nowej bazy: {}", e))?;
                
                // Podmieniamy połączenie wewnątrz Mutexu
                *conn_guard = new_conn;
            }

            Ok("Baza danych została pomyślnie zaimportowana.".to_string())
        }
        None => Err("Import został anulowany.".to_string()),
    }
}