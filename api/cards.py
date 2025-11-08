from http.server import BaseHTTPRequestHandler
import sqlite3
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Database path
        db_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'onepiece_cards.db')

        try:
            # Connect to database
            dbConn = sqlite3.connect(db_path)
            dbConn.row_factory = sqlite3.Row

            # Fetch cards
            cards = dbConn.execute("SELECT * from cards").fetchall()
            dbConn.close()

            # Convert to JSON
            cards_list = [dict(card) for card in cards]

            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(cards_list).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
