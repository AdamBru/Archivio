mod shelves;

use rusqlite::{Connection};
use std::sync::Mutex;
use shelves::{init_shelves, get_shelves, add_shelf, update_shelf, delete_shelf};

struct Db(Mutex<Connection>);

#[tauri::command]
fn database_ping(db: tauri::State<Db>) -> String {
    let _conn = db.0.lock().unwrap();
    "db ok".to_string()
}


// // Tabela shelves - delete
// #[tauri::command]
// fn delete_shelf(db: tauri::State<Db>, id: i64) -> Result<(), String> {
//     let conn = db.0.lock().unwrap();

//     // Sprawdzamy, czy są spisy przypisane do tej półki
//     let count: i64 = conn.query_row(
//         "SELECT COUNT(*) FROM sets WHERE shelf_id = ?1",
//         params![id],
//         |row| row.get(0)
//     ).map_err(|e| e.to_string())?;

//     if count > 0 {
//         return Err("Nie można usunąć półki z aktywnymi spisami".to_string());
//     }

//     // Jeśli nie ma zależnych spisów → usuwamy półkę
//     conn.execute(
//         "DELETE FROM shelves WHERE id = ?1",
//         params![id],
//     ).map_err(|e| e.to_string())?;

//     Ok(())
// }


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	let db = Connection::open("archivio.db").expect("db error");
	init_shelves(&db);

	tauri::Builder::default()
    .manage(Db(Mutex::new(db)))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(
			tauri::generate_handler![
					database_ping,
					get_shelves,
					add_shelf,
					update_shelf,
					delete_shelf
				]
			)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
