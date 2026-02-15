mod shelves;
mod sets;
mod folders;
mod dbfile;

use rusqlite::{Connection};
use tauri::Manager;
use std::sync::Mutex;
use shelves::{ init_shelves, get_shelves, add_shelf, update_shelf, delete_shelf };
use sets::{ init_sets, get_sets, add_set, update_set, shred_set, delete_set };
use folders::{ init_folders, get_folders, add_folder, update_folder, shred_folder, delete_folder };
use dbfile::{ export_database, import_database, reset_database };

struct Db(Mutex<Connection>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Pobranie katalogu danych aplikacji:
            // Windows: AppData/Roaming/Archivio
            // macOS: Library/Application Support/Archivio
            // Linux: ~/.local/share/Archivio
            let app_dir = app
                .path()
                .app_data_dir()
                .expect("failed to get app data dir");

            // Upewnij się, że katalog istnieje
            std::fs::create_dir_all(&app_dir)
                .expect("failed to create app data dir");

            let db_path = app_dir.join("archivio.db");

            let db = Connection::open(db_path)
                .expect("db error");

            init_shelves(&db);
            init_sets(&db);
            init_folders(&db);

            app.manage(Db(Mutex::new(db)));

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
		.plugin(tauri_plugin_dialog::init())
        .invoke_handler(
            tauri::generate_handler![
                // komendy półek w bazie danych
                get_shelves,
                add_shelf,
                update_shelf,
                delete_shelf,
                // komendy spisów w bazie danych
                get_sets,
                add_set,
                update_set,
                shred_set,
                delete_set,
                // komendy teczek w bazie danych
                get_folders,
                add_folder,
                update_folder,
                shred_folder,
                delete_folder,
				// komendy operacji na pliku bazy danych
				export_database,
				import_database,
				reset_database,
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}