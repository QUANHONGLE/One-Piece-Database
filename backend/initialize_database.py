import sqlite3

# Connect to local database file or make one if it doesnt exist
dbConn = sqlite3.connect("onepiece_cards.db")

# Create a cursor
dbCursor = dbConn.cursor()

# Delete old tables for new ones update to table is needed
dbCursor.execute("DROP TABLE IF EXISTS cards")
dbCursor.execute("DROP TABLE IF EXISTS sets")

# Create tables
dbCursor.execute("""
CREATE TABLE IF NOT EXISTS sets(
  set_id TEXT PRIMARY KEY,
  set_name TEXT
);
""")

dbCursor.execute("""
CREATE TABLE IF NOT EXISTS cards (
  card_set_id TEXT PRIMARY KEY,
  card_name TEXT,
  card_cost INTEGER,
  card_power INTEGER,
  attribute TEXT,
  counter_amount INTEGER,
  card_color TEXT,
  card_type TEXT,
  sub_types TEXT,
  card_text TEXT, 
  rarity TEXT,
  card_image TEXT,
  set_id TEXT, 
  FOREIGN KEY (set_id) REFERENCES sets(set_id)                     
);
""")

dbConn.commit()
dbConn.close()

print("Database Init")