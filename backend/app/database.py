import sqlite3
import os
from pathlib import Path
from typing import List, Dict, Any, Optional

DB_DIR = Path(__file__).parent.parent / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DB_DIR / "scamsaathi.db"

def get_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    # Trusted contacts table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trusted_contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            relationship TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # Privacy & app settings table (non-sensitive)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS app_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    """)
    conn.commit()

    # Pre-populate sample contacts if empty for an immediate usable experience
    cursor.execute("SELECT COUNT(*) FROM trusted_contacts")
    count = cursor.fetchone()[0]
    if count == 0:
        cursor.execute("""
            INSERT INTO trusted_contacts (name, relationship, phone, email)
            VALUES 
            ('Aarav Sharma', 'Son / Tech Advisor', '+91 98765 43210', 'aarav.sharma@example.com'),
            ('Dr. Priya Nair', 'Family Friend', '+91 91234 56789', 'priya.nair@example.com')
        """)
        conn.commit()

    conn.close()

# Contacts CRUD
def get_all_contacts() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, relationship, phone, email, created_at FROM trusted_contacts ORDER BY id DESC")
    rows = cursor.fetchall()
    contacts = [dict(r) for r in rows]
    conn.close()
    return contacts

def add_contact(name: str, relationship: str, phone: Optional[str] = None, email: Optional[str] = None) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO trusted_contacts (name, relationship, phone, email)
        VALUES (?, ?, ?, ?)
    """, (name, relationship, phone or "", email or ""))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"id": new_id, "name": name, "relationship": relationship, "phone": phone, "email": email}

def delete_contact(contact_id: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM trusted_contacts WHERE id = ?", (contact_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted

def set_setting(key: str, value: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)", (key, value))
    conn.commit()
    conn.close()

def get_setting(key: str, default: str = "") -> str:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT value FROM app_settings WHERE key = ?", (key,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else default

