function DeckStats({ deck, onOpenStats }) {
  const leaderCount = deck.filter((c) => c.card_type === "Leader").length;
  const nonLeaderCount = deck.filter((c) => c.card_type !== "Leader").length;

  return (
    <div className="sticky top-0 z-20 bg-gradient-to-br from-[#1a5f7a] to-[#13a4db] pb-4 pt-2 px-4">
      <h2 className="text-5xl font-one-piece text-white mb-4 text-center [text-shadow:2px_2px_6px_rgba(0,0,0,2)]">
        My Deck
      </h2>
      <div className="flex justify-center items-center gap-4 mb-3">
        <div className="text-white text-xl font-bold">
          <span className="text-yellow-300">Leaders: {leaderCount}/1</span>
          {" | "}
          <span className="text-blue-200">Cards: {nonLeaderCount}/50</span>
        </div>
        {deck.length > 0 && (
          <button
            onClick={onOpenStats}
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 border-2 border-white/40"
          >
            📊 View Stats
          </button>
        )}
      </div>
    </div>
  );
}

export default DeckStats;
