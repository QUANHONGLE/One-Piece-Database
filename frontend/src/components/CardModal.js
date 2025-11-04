function CardModal({ card, onClose }) {
  if (!card) return null;

  const highlightKeywords = (text) => {
    if (!text) return text;

    const keywords = [
      "DON!!",
      "Counter",
      "Trigger",
      "Blocker",
      "Rush",
      "Banish",
      "Double Attack",
    ];

    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<span class="text-[#13a4db] font-bold">$1</span>'
      );
    });

    return highlightedText;
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-[#1a5f7a] to-[#13a4db] p-6 rounded-2xl max-w-4xl w-11/12 relative shadow-2xl border-4 border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500 transition-colors duration-200"
        >
          ✖
        </button>

        <div className="flex gap-6 items-start">
          <img
            src={card.card_image}
            alt={card.card_name}
            className="w-80 h-auto rounded-xl shadow-lg border-4 border-white/30"
          />

          <div className="flex-1 text-white">
            <h2 className="text-4xl font-one-piece mb-4 [text-shadow:2px_2px_6px_rgba(0,0,0,0.8)]">
              {card.card_name}
            </h2>

            <div className="space-y-3 text-lg">
              <p>
                <strong>Card Set ID:</strong> {card.card_set_id}
              </p>
              <p>
                <strong>Type:</strong> {card.card_type}
              </p>
              <p>
                <strong>Color:</strong> {card.card_color}
              </p>
              <p>
                <strong>Rarity:</strong> {card.card_rarity}
              </p>
              {card.card_cost && (
                <p>
                  <strong>Cost:</strong> {card.card_cost}
                </p>
              )}
              {card.card_power && (
                <p>
                  <strong>Power:</strong> {card.card_power}
                </p>
              )}
              {card.card_counter && (
                <p>
                  <strong>Counter:</strong> {card.card_counter}
                </p>
              )}
              {card.card_attribute && (
                <p>
                  <strong>Attribute:</strong> {card.card_attribute}
                </p>
              )}
              {card.card_effect && (
                <div>
                  <strong>Effect:</strong>
                  <div
                    className="mt-2 p-3 bg-white/10 rounded-lg max-h-40 overflow-y-auto scrollbar-modal"
                    dangerouslySetInnerHTML={{
                      __html: highlightKeywords(card.card_effect),
                    }}
                  />
                </div>
              )}
              {card.card_trigger && (
                <div>
                  <strong>Trigger:</strong>
                  <div
                    className="mt-2 p-3 bg-white/10 rounded-lg max-h-40 overflow-y-auto scrollbar-modal"
                    dangerouslySetInnerHTML={{
                      __html: highlightKeywords(card.card_trigger),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardModal;
