function CardGrid({ cards, onCardClick, showCount = false }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5 justify-items-center">
      {cards.map((item) => {
        const card = item.card || item;
        const count = item.count || 0;
        const isLeader = card.card_type === "Leader";

        return (
          <div
            key={item.deckId || card.card_set_id}
            onClick={() => onCardClick(card)}
            className={`relative bg-transparent border-2 ${
              isLeader
                ? "border-yellow-400 shadow-[0px_0px_12px_rgba(250,204,21,0.6)]"
                : "border-white/30"
            } rounded-[10px] p-2.5 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.3)] hover:border-[#13a4db] w-[180px]`}
          >
            <img
              src={card.card_image}
              alt={card.card_name}
              className="w-full h-[250px] object-cover rounded-[10px] shadow-md"
            />

            {showCount && count > 0 && (
              <>
                <div className="absolute top-2 right-2 bg-black text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-lg border-2 border-white z-10">
                  {count}
                </div>

                {count > 1 && (
                  <>
                    <div className="absolute top-1 left-1 w-full h-full bg-white/20 rounded-[10px] border-2 border-white/30 -z-10"></div>
                    {count > 2 && (
                      <div className="absolute top-2 left-2 w-full h-full bg-white/10 rounded-[10px] border-2 border-white/20 -z-20"></div>
                    )}
                    {count > 3 && (
                      <div className="absolute top-3 left-3 w-full h-full bg-white/5 rounded-[10px] border-2 border-white/10 -z-30"></div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CardGrid;
