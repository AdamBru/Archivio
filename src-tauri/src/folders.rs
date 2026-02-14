use rusqlite::{params, Connection, Result};
use serde::{Serialize, Deserialize};
use tauri::State;
use crate::Db;

// Model obiektu `Folder`
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Folder {
    pub id: i64,
    pub sign: String,
    pub title: String,
    pub date_from: String,
    pub date_to: Option<String>,
    pub category: String,
    pub amount: i64,
    pub shelf_id: Option<i64>,
    pub set_id: Option<i64>,
    pub status: i64, // 1 = dostępna, 0 = zniszczona
}

// Model obiektu `FolderInput` do przyjmowania danych
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FolderInput {
    pub id: i64,
    pub sign: String,
    pub title: String,
    pub date_from: String,
    pub date_to: Option<String>,
    pub category: String,
    pub amount: i64,
    // pub shelf_id: Option<i64>,
    pub set_id: Option<i64>,
    pub status: i64,
}

// Inicjalizacja tabeli `folders`
pub fn init_folders(conn: &Connection) {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sign TEXT NOT NULL,
            title TEXT NOT NULL,
            date_from TEXT NOT NULL,
            date_to TEXT,
            category TEXT NOT NULL,
            amount INTEGER NOT NULL,
            shelf_id INTEGER,
            set_id INTEGER,
            status INTEGER NOT NULL
        )
        ",
        [],
    ).expect("failed to create folders table");
}

// Pobranie danych z tabeli `folders`
#[tauri::command]
pub fn get_folders(db: State<Db>) -> Result<Vec<Folder>, String> {
    let conn = db.0.lock().unwrap();

    let mut stmt = conn.prepare(
        "SELECT id, sign, title, date_from, date_to, category, amount, shelf_id, set_id, status FROM folders"
    ).map_err(|e| e.to_string())?;

    let rows = stmt.query_map([], |row| {
        Ok(Folder {
            id: row.get(0)?,
            sign: row.get(1)?,
            title: row.get(2)?,
            date_from: row.get(3)?,
            date_to: row.get(4)?,
            category: row.get(5)?,
            amount: row.get(6)?,
            shelf_id: row.get(7)?,
            set_id: row.get(8)?,
            status: row.get(9)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut results = Vec::new();
    for r in rows {
        results.push(r.map_err(|e| e.to_string())?);
    }

    Ok(results)
}

// Dodawanie teczki do tabeli `folders`
#[tauri::command]
pub fn add_folder(db: State<Db>, data: FolderInput) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    let shelf_id: Option<i64> = if let Some(set_id_val) = data.set_id {
        conn.query_row(
            "SELECT shelf_id FROM sets WHERE id = ?1",
            params![set_id_val],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?
    } else {
        None
    };

    conn.execute(
        "INSERT INTO folders (sign, title, date_from, date_to, category, amount, shelf_id, set_id, status)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            data.sign,
            data.title,
            data.date_from,
            data.date_to,
            data.category,
            data.amount,
            shelf_id,
            data.set_id,
            data.status,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Edycja teczki w tabeli `folders`
#[tauri::command]
pub fn update_folder(db: State<Db>, data: FolderInput) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    // pobiera shelf_id ze spisu jeśli set_id nie jest null
    let shelf_id: Option<i64> = if let Some(set_id_val) = data.set_id {
        conn.query_row(
            "SELECT shelf_id FROM sets WHERE id = ?1",
            params![set_id_val],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?
    } else {
        None
    };

    conn.execute(
        "
        UPDATE folders
        SET sign = ?2,
            title = ?3,
            date_from = ?4,
            date_to = ?5,
            category = ?6,
            amount = ?7,
            set_id = ?8,
            shelf_id = ?9,
            status = ?10
        WHERE id = ?1
        ",
        params![
            data.id,
            data.sign,
            data.title,
            data.date_from,
            data.date_to,
            data.category,
            data.amount,
            data.set_id,
            shelf_id,
            data.status
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Niszczenie teczki w tabeli `folders` (status = 0)
#[tauri::command]
pub fn shred_folder(db: State<Db>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    conn.execute(
        "UPDATE folders SET status = 0 WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

// Usuwanie teczki z tabeli `folders`
#[tauri::command]
pub fn delete_folder(db: State<Db>, id: i64) -> Result<(), String> {
    let conn = db.0.lock().unwrap();

    conn.execute(
        "DELETE FROM folders WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}