use rusqlite::{params, Connection, Result};
use serde::{Serialize, Deserialize};
use tauri::State;
use crate::Db;

// Model obiektu `Set`
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Set {
    pub id: i64,
    pub number: String,
    pub shelf_id: Option<i64>,
    pub status: i64, // 1 = dostępny, 0 = zniszczony
}

// Model obiektu `SetInput` do przyjmowania danych
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetInput {
    pub id: i64,
    pub number: String,
    pub shelf_id: Option<i64>,
    pub status: i64,
}

// Inicjalizacja tabeli `sets`
pub fn init_sets(conn: &Connection) {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS sets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number TEXT NOT NULL UNIQUE,
            shelf_id INTEGER,
            status INTEGER NOT NULL
        )
        ",
        [],
    )
    .expect("failed to create sets table");
}

// Pobieranie danych z tabeli `sets`
#[tauri::command]
pub fn get_sets(db: State<Db>) -> Result<Vec<Set>, String> {
    let conn = db.0.lock().unwrap();

    let mut stmt = conn
        .prepare("SELECT id, number, shelf_id, status FROM sets")
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(Set {
                id: row.get(0)?,
                number: row.get(1)?,
                shelf_id: row.get(2)?,
                status: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut results = Vec::new();
    for r in rows {
        results.push(r.map_err(|e| e.to_string())?);
    }

    Ok(results)
}

// Dodawanie spisu do tabeli `sets`
#[tauri::command]
pub fn add_set(db: State<Db>, data: SetInput) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    conn.execute(
        "INSERT INTO sets (number, shelf_id, status) VALUES (?1, ?2, ?3)",
        params![data.number, data.shelf_id, data.status],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Edycja spisu w tabeli `sets`
#[tauri::command]
pub fn update_set(db: State<Db>, data: SetInput) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    // aktualizacja spisu
    conn.execute(
        "
        UPDATE sets
        SET number = ?2,
            shelf_id = ?3,
            status = ?4
        WHERE id = ?1
        ",
        params![
            data.id,
            data.number,
            data.shelf_id,
            data.status
        ],
    )
    .map_err(|e| e.to_string())?;

    // Kaskadowa aktualizacja półki w teczkach przypisanych do edytowanego własnie spisu
    conn.execute(
        "
        UPDATE folders
        SET shelf_id = ?2
        WHERE set_id = ?1
        ",
        params![
            data.id,      // id spisu
            data.shelf_id // nowa półka
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Niszczenie spisu w tabeli `sets` (status = 0)
#[tauri::command]
pub fn shred_set(db: State<Db>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    conn.execute(
        "UPDATE sets SET status = 0 WHERE id = ?1",
        params![id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Usuwanie spisu z tabeli `sets`
#[tauri::command]
pub fn delete_set(db: State<Db>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    conn.execute(
        "DELETE FROM sets WHERE id = ?1",
        params![id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}