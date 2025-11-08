from flask import Flask, jsonify
import sqlite3
import os

app = Flask(__name__)

def get_db_connection():
    # Database path - Vercel will need this in the root or api folder
    db_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'onepiece_cards.db')
    dbConn = sqlite3.connect(db_path)
    dbConn.row_factory = sqlite3.Row
    return dbConn

@app.route("/api/sets")
def get_sets():
    dbConn = get_db_connection()
    sets = dbConn.execute("SELECT * from sets").fetchall()
    dbConn.close()
    return jsonify([dict(set) for set in sets])

# Vercel serverless function handler
def handler(request):
    with app.app_context():
        return get_sets()
