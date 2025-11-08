import { useState, useEffect } from "react";

function CardModal({ card, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  // Reset closing state when a new card is opened
  useEffect(() => {
    setIsClosing(false);
  }, [card]);

  if (!card) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const highlightKeywords = (text) => {
    if (!text) return "No card text available.";

    const highlights = [
      { word: "[Trigger]", bg: "#fff320", color: "black" },
      { word: "[Rush]", bg: "#e67421", color: "white" },
      { word: "[Blocker]", bg: "#e67421", color: "white" },
      { word: "[Banish]", bg: "#e67421", color: "white" },
      { word: "[Double Attack]", bg: "#e67421", color: "white" },
      { word: "[Counter]", bg: "#db0409", color: "white" },
      { word: "[Once Per Turn]", bg: "#db3e59", color: "white" },
      { word: "[On Play]", bg: "#016fb1", color: "white" },
      { word: "[When Attacking]", bg: "#016fb1", color: "white" },
      { word: "[Activate:Main]", bg: "#016fb1", color: "white" },
      { word: "[Activate: Main]", bg: "#016fb1", color: "white" },
      { word: "[Your Turn]", bg: "#016fb1", color: "white" },
      { word: "[On Your Opponent's Attack]", bg: "#016fb1", color: "white" },
      { word: "[End of Your Turn]", bg: "#016fb1", color: "white" },
      { word: "[Main]", bg: "#016fb1", color: "white" },
    ];

    let highlighted = text;

    highlights.forEach(({ word, bg, color }) => {
      const escapedWord = word.replace(/[[\]]/g, "\\$&");
      const regex = new RegExp(`${escapedWord}`, "gi");

      highlighted = highlighted.replace(
        regex,
        `<span style="background-color:${bg}; color:${color}; font-weight:bold; padding:2px 4px; border-radius:7px;">${word}</span>`
      );
    });

    return highlighted;
  };

  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[200] p-4 overflow-y-auto ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      onClick={handleClose}
    >
      <div
        className={`relative max-w-2xl w-full my-auto flex flex-col items-center gap-4 py-8 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 text-3xl font-bold hover:rotate-90 hover:scale-125 transition-all duration-300 z-10 bg-red-400 hover:bg-red-600 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center active:scale-95 text-white"
        >
          ✖
        </button>

        <img
          src={card.card_image}
          alt={card.card_name}
          className="w-[400px] h-auto rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300"
        />

        <div className="glass-dark rounded-2xl p-6 w-full text-white border-4 border-white/20 shadow-2xl animate-slide-up">
          <h2 className="text-3xl font-one-piece mb-4 text-center">
            {card.card_name}
          </h2>

          {card.card_text && (
            <div
              className="text-base whitespace-pre-line mb-3"
              dangerouslySetInnerHTML={{
                __html: highlightKeywords(card.card_text),
              }}
            />
          )}

          {card.sub_types && (
            <div
              className="text-base whitespace-pre-line bg-gray-500/50 px-4 py-2 rounded-full inline-block"
              dangerouslySetInnerHTML={{
                __html: highlightKeywords(card.sub_types),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CardModal;
