// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use rusqlite::{Connection, params};
use std::sync::Mutex;

struct Db(Mutex<Connection>);

#[tauri::command]
fn database_ping(db: tauri::State<Db>) -> String {
    let _conn = db.0.lock().unwrap();
    "db ok".to_string()
}

// Tabela shelves - create
fn init_db(conn: &Connection) {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS shelves (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
        ",
        [],
    )
    .expect("failed to create shelves table");
}

// Tabela shelves - select
#[tauri::command]
fn get_shelves(db: tauri::State<Db>) -> Vec<(i64, String)> {
    let conn = db.0.lock().unwrap();

    let mut stmt = conn
        .prepare("SELECT id, name FROM shelves ORDER BY name")
        .unwrap();

    let rows = stmt
        .query_map([], |row| {
            Ok((row.get(0)?, row.get(1)?))
        })
        .unwrap();

    rows.map(|r| r.unwrap()).collect()
}

// Tabela shelves - insert
#[tauri::command]
fn add_shelf(db: tauri::State<Db>, name: String) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    // 1. sprawdzamy czy już istnieje
    let mut stmt = conn
        .prepare("SELECT COUNT(*) FROM shelves WHERE name = ?1")
        .map_err(|e| e.to_string())?;

    let count: i64 = stmt
        .query_row([&name], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    if count > 0 {
        return Err("Półka o takiej nazwie już istnieje".to_string());
    }

    // 2. jeśli nie istnieje → INSERT
    conn.execute(
        "INSERT INTO shelves (name) VALUES (?1)",
        [name],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Tabela shelves - update
#[tauri::command]
fn update_shelf(db: tauri::State<Db>, id: i64, name: String) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    // Sprawdzenie unikalności
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM shelves WHERE name = ?1 AND id != ?2",
        params![name, id],
        |row| row.get(0)
    ).map_err(|e| e.to_string())?;

    if count > 0 {
        return Err("Półka o takiej nazwie już istnieje".to_string());
    }

    // Aktualizacja
    conn.execute(
        "UPDATE shelves SET name = ?1 WHERE id = ?2",
        params![name, id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

// Tabela shelves - delete
#[tauri::command]
fn delete_shelf(db: tauri::State<Db>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    // Sprawdzamy, czy są spisy przypisane do tej półki
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM sets WHERE shelf_id = ?1",
        params![id],
        |row| row.get(0)
    ).map_err(|e| e.to_string())?;

    if count > 0 {
        return Err("Nie można usunąć półki z aktywnymi spisami".to_string());
    }

    // Jeśli nie ma zależnych spisów → usuwamy półkę
    conn.execute(
        "DELETE FROM shelves WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	let db = Connection::open("archivio.db").expect("db error");
	init_db(&db);

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
