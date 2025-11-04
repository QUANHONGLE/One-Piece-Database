import requests
import sqlite3
import time

URL = "https://optcgapi.com/api"

def fetch_cards_for_set(set_id):
  url = f"{URL}/sets/{set_id}/"
  r = requests.get(url, timeout = 10)
  # check for status code if anything fails
  # ~400 errors client errors
  # ~500 errors server errors
  r.raise_for_status()
  return r.json()

def save_cards(cards, set_id):
  dbConn = sqlite3.connect("onepiece_cards.db")
  dbCursor = dbConn.cursor()
  for card in cards:
    dbCursor.execute("""
      INSERT OR REPLACE INTO cards
      (card_set_id, card_name, card_cost, card_power, attribute, counter_amount, card_color, card_type, sub_types, card_text, rarity, card_image, set_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
      card.get("card_set_id") or card.get("id"),
      card.get("card_name"),
      card.get("card_cost"),
      card.get("card_power"),
      card.get("attribute"),
      card.get("counter_amount"),
      card.get("card_color"),
      card.get("card_type"),
      card.get("sub_types"),
      card.get("effect") or card.get("text") or card.get("card_text"),
      card.get("rarity"),
      card.get("image_url") or card.get("card_image"),
      set_id
    ))

  # set cards with no card_text to "no effect"
  dbCursor.execute("""
  UPDATE cards
  SET card_text = 'No Effect'
  WHERE card_text IS NULL OR card_text = "NULL";
  """)
    
  # set events to -1 power
  dbCursor.execute("""
  UPDATE cards
  SET card_power = -1
  WHERE card_type = "Event"
  """)

  # set stages to -1 cost
  dbCursor.execute("""
  UPDATE cards
  SET card_power = -1
  WHERE card_type = "Stage"
  """)

  # set leaders with a cost of -2
  dbCursor.execute("""
  UPDATE cards
  SET card_cost = -2
  WHERE card_type = "Leader"
  """)
  # wrong attributes for the cards below
  # need to update 
  dbCursor.execute("""
  UPDATE cards
  SET counter_amount = 1000
  WHERE card_set_id = "OP01-108"	
  """)

  dbCursor.execute("""
  UPDATE cards
  SET counter_amount = 2000
  WHERE card_set_id = "OP06-051"	
  """)
  
  dbCursor.execute("""
  UPDATE cards
  SET card_cost = 0, sub_types = "Former Roger Pirates"
  WHERE card_cost = "Former Roger Pirates"
  """)
  
  dbCursor.execute("""
    UPDATE cards
    SET card_power = ?,
    card_cost = ?
    WHERE card_set_id = ?;
  """,
    (12000, 10, "OP09-093"),
  )

  dbConn.commit()
  dbConn.close()

if __name__ == "__main__":
  dbConn = sqlite3.connect("onepiece_cards.db")
  dbCursor = dbConn.cursor()
  dbCursor.execute("SELECT set_id FROM sets")
  all_sets = dbCursor.fetchall()
  dbConn.close()

  for (set_id,) in all_sets:
    cards = fetch_cards_for_set(set_id)
    save_cards(cards, set_id)
    time.sleep(0.3)
    print(f"Fetching cards for set {set_id} ({len(cards)} cards)")