# One Piece TCG Database

A comprehensive web application for browsing and building decks for the One Piece Trading Card Game.

https://one-piece-database-kun5-3tm3tm7su-quanhongles-projects.vercel.app

## Features

### Card Database
- **Browse All Cards**: View the complete collection of One Piece TCG cards
- **Advanced Filtering**: Filter cards by:
  - Set
  - Type (Leader, Character, Event, Stage)
  - Color (Red, Green, Blue, Purple, Black, Yellow)
  - Cost
  - Power
  - Counter value
- **Multi-term Search**: Use `++` to search for multiple terms (e.g., "Luffy++Red")
- **Card Details**: Click on any card to view detailed information with highlighted keywords and abilities

### Deck Builder
- **Interactive Deck Building**: Add cards to your deck with a single click
- **Deck Validation**:
  - 1 Leader card required
  - 50 non-leader cards required
  - Maximum 4 copies of each card
- **Real-time Statistics**: View live deck statistics including:
  - Counter distribution
  - Cost curve
  - Type breakdown
- **Visual Feedback**:
  - Leader cards highlighted with special glow effect
  - Stacked card display for multiple copies
  - Hover to preview cards in enlarged view

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Flask (Python)
- RESTful API

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.x
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/QUANHONGLE/One-Piece-Database.git
cd One-Piece-Database
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```
The API will be available at `http://127.0.0.1:5000`

2. In a new terminal, start the frontend:
```bash
cd frontend
npm start
```
The application will open at `http://localhost:3000`

## Usage

### Browsing Cards
1. Navigate to the **Card Database** page
2. Use the search bar to find specific cards
3. Apply filters using the dropdown menus
4. Click on any card to view detailed information

### Building a Deck
1. Navigate to the **Deck Builder** page
2. Use filters to find cards you want
3. Click on cards in the left panel to add them to your deck
4. View your deck and statistics in the right panel
5. Click on cards in your deck to remove them
6. Use the "Clear Deck" button to start over

## Features in Detail

### Search Functionality
- Search by card name, set, type, color, or any card text
- Use `++` for AND searches (e.g., "Luffy++10" finds all Luffy cards with 10 cost or power)

### Deck Rules
- Exactly 1 Leader card
- Exactly 50 non-leader cards (Character, Event, Stage)
- Maximum 4 copies of any single card
- Deck validation prevents invalid deck configurations

### UI Features
- Smooth animations and transitions
- Background music (Bink's Sake)
- Volume controls
- Responsive design
- Hover effects and visual feedback

## Deployment

### Deploy to Vercel

1. Install Vercel CLI (optional):
```bash
npm install -g vercel
```

2. Deploy using Vercel CLI:
```bash
vercel
```

Or deploy via GitHub:
- Push your code to GitHub
- Import your repository on [Vercel](https://vercel.com)
- Vercel will automatically detect the configuration from `vercel.json`
- Click "Deploy"

The application structure is set up with:
- `api/` folder containing serverless Python functions
- `vercel.json` for build and routing configuration
- Environment variables configured for production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational purposes. One Piece and the One Piece Trading Card Game are property of their respective owners.

## Acknowledgments

- One Piece TCG data and card images
- Background music: Bink's Sake from One Piece
