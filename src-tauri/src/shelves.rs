use rusqlite::{params};
use serde::Serialize;
use tauri::State;
use crate::Db;

// Model obiektu `Shelf`
#[derive(Serialize)]
pub struct Shelf {
    pub id: i64,
    pub name: String,
}

// Inicjalizacja tabeli `shelves`
pub fn init_shelves(conn: &rusqlite::Connection) {
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

// Pobieranie danych z tabeli `shelves`
#[tauri::command]
pub fn get_shelves(db: State<Db>) -> Vec<Shelf> {
    let conn = db.0.lock().unwrap();

    let mut stmt = conn
        .prepare("SELECT id, name FROM shelves ORDER BY name")
        .unwrap();

    let rows = stmt
        .query_map([], |row| {
            Ok(Shelf {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .unwrap();

    rows.map(|r| r.unwrap()).collect()
}

// Dodawanie półki do tabeli `shelves`
#[tauri::command]
pub fn add_shelf(db: State<Db>, name: String) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

	// sprawdzenie czy już istnieje półka o takiej nazwie
    let count: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM shelves WHERE name = ?1",
            params![name],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    if count > 0 {
        return Err("Półka o takiej nazwie już istnieje".to_string());
    }

	// dodanie nowej półki
    conn.execute(
        "INSERT INTO shelves (name) VALUES (?1)",
        params![name],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Zmiana nazwy półki do tabeli `shelves`
#[tauri::command]
pub fn update_shelf(db: State<Db>, id: i64, name: String) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    // sprawdzenie unikalności nazwy (bez samej siebie)
    let count: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM shelves WHERE name = ?1 AND id != ?2",
            params![name, id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    if count > 0 {
        return Err("Półka o takiej nazwie już istnieje".to_string());
    }

	// zmiana nazwy półki
    conn.execute(
        "UPDATE shelves SET name = ?1 WHERE id = ?2",
        params![name, id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Dodawanie półki do tabeli `shelves`
#[tauri::command]
pub fn delete_shelf(db: State<Db>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    // sprawdzenie czy są spisy przypisane do tej półki
    let count_sets: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM sets WHERE shelf_id = ?1 AND status = 1",
            params![id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // sprawdzenie czy są teczki przypisane do tej półki
    let count_folders: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM folders WHERE shelf_id = ?1 AND status = 1",
            params![id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    if count_sets > 0 || count_folders > 0 {
        return Err("Nie można usunąć półki z niezniszczonymi spisami lub teczkami".to_string());
    }

    // Usuwanie półki
    conn.execute(
        "DELETE FROM shelves WHERE id = ?1",
        params![id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}