import requests
import sqlite3

URL = "https://optcgapi.com/api"

def fetch_sets():
  url = f"{URL}/allSets/"
  r = requests.get(url, timeout = 10)
  r.raise_for_status()
  return r.json()

def save_sets(sets):
  dbConn = sqlite3.connect("onepiece_cards.db")
  dbCursor = dbConn.cursor()
  for set in sets:
    set_id = set.get("set_id") or set.get("set_code") or set.get("id")
    set_name = set.get("set_name")
    dbCursor.execute("""
        INSERT OR IGNORE INTO sets (set_id, set_name)
        VALUES (?, ?);
    """, (set_id, set_name))
  dbConn.commit()
  dbConn.close()

if __name__ == "__main__":
  sets = fetch_sets()
  save_sets(sets)
  print(f"Saved {len(sets)} sets")