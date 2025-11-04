from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATABASE = "onepiece_cards.db"

def get_db_connection():
    dbConn = sqlite3.connect(DATABASE)
    # Make rows behave like dicts
    dbConn.row_factory = sqlite3.Row
    return dbConn

@app.route("/sets")
def get_sets():
    dbConn = get_db_connection()
    sets = dbConn.execute("SELECT * from sets").fetchall()
    dbConn.close()
    # Convert rows to dictionaries and return a JSON
    return jsonify([dict(set) for set in sets])

@app.route("/cards")
def get_cards():
    dbConn = get_db_connection()
    cards = dbConn.execute("SELECT * from cards").fetchall()
    dbConn.close()
    # Convert rows to dictionaries and return a JSON
    return jsonify([dict(card) for card in cards])


if __name__ == "__main__":
    app.run(debug = True)