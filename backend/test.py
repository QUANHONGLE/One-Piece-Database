import requests

BASE_URL = "https://optcgapi.com/api"

# First, fetch all sets so we can pick one
resp = requests.get(f"{BASE_URL}/allSets/")
resp.raise_for_status()
sets = resp.json()

# Pick the first set
first_set = sets[0]
set_id = first_set.get("set_id")  # matches API field

print("First set:", set_id, first_set.get("set_name"))

# Now fetch all cards in this set
resp_cards = requests.get(f"{BASE_URL}/sets/{set_id}/")
resp_cards.raise_for_status()
cards = resp_cards.json()

# Pick the first card
first_card = cards[0]

print("\nFirst card in this set:")
for key, value in first_card.items():
    print(f"{key}: {value}")
