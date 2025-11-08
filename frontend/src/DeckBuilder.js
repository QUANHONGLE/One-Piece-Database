import { useEffect, useState, useRef } from "react";
import axios from "axios";
import MultiSelectDropdown from "./components/MultiSelectDropdown";
import DeckStats from "./components/DeckStats";

export default function DeckBuilder() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deck, setDeck] = useState([]);
  const cardsContainerRef = useRef(null);

  // Single state to control which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);

  // Selected filters
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCosts, setSelectedCosts] = useState([]);
  const [selectedPowers, setSelectedPowers] = useState([]);
  const [selectedCounters, setSelectedCounters] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSet, setSelectedSet] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Fetch cards from API
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";
    axios
      .get(`${apiUrl}/cards`)
      .then((response) => {
        setCards(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting cards:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-1/2 flex flex-col p-4 gap-4">
          <div className="h-16 bg-white/20 backdrop-blur-sm rounded-[40px] animate-pulse"></div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,120px))] gap-3 justify-center">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-[120px] h-[167px] bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 0.05}s` }}
              ></div>
            ))}
          </div>
        </div>
        <div className="w-1/2 bg-black/20 p-4">
          <div className="h-32 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Unique values
  const uniqueColors = [
    ...new Set(cards.map((c) => c.card_color).filter(Boolean)),
  ];
  const uniqueCosts = [
    ...new Set(
      cards.map((c) => c.card_cost).filter((c) => c !== null && c !== undefined)
    ),
  ];
  const uniquePowers = [
    ...new Set(
      cards
        .map((c) => c.card_power)
        .filter((p) => p !== null && p !== undefined)
    ),
  ];
  const uniqueCounters = [
    ...new Set(
      cards
        .map((c) => c.counter_amount)
        .filter((v) => v !== null && v !== undefined)
    ),
  ];
  const uniqueTypes = [
    ...new Set(cards.map((c) => c.card_type).filter(Boolean)),
  ];
  const uniqueSets = [...new Set(cards.map((c) => c.set_id).filter(Boolean))];

  // Display mappings
  const displayCosts = uniqueCosts.map((c) => (c === -2 ? "No Cost" : c));
  const displayPowers = uniquePowers.map((p) => (p === -1 ? "No Power" : p));

  // Highlight keywords in card text
  function highlightCardText(text) {
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
      // Escape brackets for regex
      const escapedWord = word.replace(/[[\]]/g, "\\$&");
      const regex = new RegExp(`${escapedWord}`, "gi");

      highlighted = highlighted.replace(
        regex,
        `<span style="background-color:${bg}; color:${color}; font-weight:bold; padding:2px 4px; border-radius:7px;">${word}</span>`
      );
    });

    return highlighted;
  }

  // Filtered cards
  const filteredCards = cards.filter((card) => {
    const searchableString = `
      ${card.card_set_id ?? ""}
      ${card.set_id ?? ""}
      ${card.card_name ?? ""}
      ${card.card_type ?? ""}
      ${card.card_color ?? ""}
      ${card.card_text ?? ""}
      ${card.card_cost ?? ""}
      ${card.card_power ?? ""}
      ${card.counter_amount ?? ""}
    `.toLowerCase();

    if (searchTerm.trim()) {
      const terms = searchTerm
        .toLowerCase()
        .split("++")
        .map((t) => t.trim());
      if (!terms.every((t) => searchableString.includes(t))) return false;
    }

    if (selectedSet.length > 0 && !selectedSet.includes(card.set_id))
      return false;
    if (selectedColors.length > 0 && !selectedColors.includes(card.card_color))
      return false;
    if (
      selectedCosts.length > 0 &&
      !selectedCosts.includes(String(card.card_cost))
    )
      return false;
    if (
      selectedPowers.length > 0 &&
      !selectedPowers.includes(String(card.card_power))
    )
      return false;
    if (
      selectedCounters.length > 0 &&
      !selectedCounters.includes(String(card.counter_amount))
    )
      return false;
    if (
      selectedType.length > 0 &&
      !selectedType.includes(String(card.card_type))
    )
      return false;

    return true;
  });

  // Add card to deck with validation (silent - no alerts)
  const addCardToDeck = (card) => {
    const isLeader = card.card_type === "Leader";

    // Check if already have a leader
    const hasLeader = deck.some((c) => c.card_type === "Leader");
    if (isLeader && hasLeader) {
      return; // Silently prevent adding
    }

    // Count how many copies of this card are already in deck
    const cardCount = deck.filter((c) => c.card_set_id === card.card_set_id).length;

    // Leaders can only have 1 copy
    if (isLeader && cardCount >= 1) {
      return; // Silently prevent adding
    }

    // Non-leaders can have max 4 copies
    if (!isLeader && cardCount >= 4) {
      return; // Silently prevent adding
    }

    // Count non-leader cards
    const nonLeaderCount = deck.filter((c) => c.card_type !== "Leader").length;
    if (!isLeader && nonLeaderCount >= 50) {
      return; // Silently prevent adding
    }

    setDeck([...deck, { ...card, deckId: Date.now() + Math.random() }]);
  };

  // Remove one copy of a card from deck
  const removeCardFromDeck = (cardSetId) => {
    const index = deck.findIndex((card) => card.card_set_id === cardSetId);
    if (index !== -1) {
      const newDeck = [...deck];
      newDeck.splice(index, 1);
      setDeck(newDeck);
    }
  };

  // Group cards by card_set_id for display
  const groupedDeck = deck.reduce((acc, card) => {
    const key = card.card_set_id;
    if (!acc[key]) {
      acc[key] = { card, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  // Sort deck to show leader first, then others
  const sortedDeckEntries = Object.values(groupedDeck).sort((a, b) => {
    const aIsLeader = a.card.card_type === "Leader";
    const bIsLeader = b.card.card_type === "Leader";
    if (aIsLeader && !bIsLeader) return -1;
    if (!aIsLeader && bIsLeader) return 1;
    return 0;
  });

  return (
    <div className="flex min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] overflow-hidden">
      {/* Left Side - Card Search and Filtering */}
      <div className="w-1/2 flex flex-col border-r-4 border-white/20 relative">
        {/* Hover Preview for Deck Cards */}
        {hoveredCard && hoveredCard.fromDeck && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <img
              src={hoveredCard.card_image}
              alt={hoveredCard.card_name}
              className="w-[600px] h-auto rounded-xl shadow-2xl border-4 border-white"
            />
          </div>
        )}
        {/* Fixed Filter Section */}
        <div className="flex-shrink-0 p-4 bg-[rgba(26,95,122,1)] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          {/* Search bar */}
          <input
            type="text"
            className="block mx-auto mb-5 w-[90%] max-w-[600px] px-4 py-3 text-xl font-sans font-bold rounded-[40px] border-[3px] border-black bg-white transition-all duration-300 ease-in-out hover:bg-[#cecece] hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(19,164,219,0.4)] focus:outline-none focus:scale-[1.05] focus:shadow-[0px_10px_30px_rgba(19,164,219,0.6)] focus:border-[#13a4db] placeholder:text-black/50"
            placeholder="🔎 Search for card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Dropdown filters */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <MultiSelectDropdown
              label="Set"
              name="set"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              options={uniqueSets}
              selected={selectedSet}
              setSelected={setSelectedSet}
            />
            <MultiSelectDropdown
              label="Type"
              name="type"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              options={uniqueTypes}
              selected={selectedType}
              setSelected={setSelectedType}
            />
            <MultiSelectDropdown
              label="Color"
              name="color"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              options={uniqueColors}
              selected={selectedColors}
              setSelected={setSelectedColors}
            />
            <MultiSelectDropdown
              label="Cost"
              name="cost"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              options={displayCosts}
              selected={selectedCosts}
              setSelected={setSelectedCosts}
              transformValue={(v) => (v === "No Cost" ? "-2" : String(v))}
              sortFn={(a, b) =>
                a === "No Cost" ? -1 : b === "No Cost" ? 1 : a - b
              }
            />
            <MultiSelectDropdown
              label="Power"
              name="power"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              options={displayPowers}
              selected={selectedPowers}
              setSelected={setSelectedPowers}
              transformValue={(v) => (v === "No Power" ? "-1" : String(v))}
              sortFn={(a, b) =>
                a === "No Power" ? -1 : b === "No Power" ? 1 : a - b
              }
            />
            <MultiSelectDropdown
              label="Counter"
              name="counter"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              options={uniqueCounters.sort((a, b) => a - b)}
              selected={selectedCounters}
              setSelected={setSelectedCounters}
            />
          </div>
        </div>

        {/* Scrollable Cards Section */}
        <div ref={cardsContainerRef} className="flex-1 overflow-y-auto p-4">
          {/* Cards grid */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,120px))] gap-3 p-2 justify-center">
            {filteredCards.map((card, index) => (
              <div
                key={card.card_set_id}
                className="group bg-transparent border-transparent rounded-[10px] shadow-[0px_2px_6px_rgba(0,0,0,0.1)] overflow-hidden p-1 flex flex-col items-center animate-appear transition-all duration-300 ease-out cursor-pointer opacity-0 translate-y-5 hover:shadow-[0px_10px_30px_rgba(19,164,219,0.5)] hover:scale-110 hover:-translate-y-2 w-[120px] transform-gpu"
                onClick={() => addCardToDeck(card)}
                onMouseEnter={() => setHoveredCard(card)}
                onMouseLeave={() => setHoveredCard(null)}
                title="Click to add to deck"
                style={{ animationDelay: `${index * 0.01}s` }}
              >
                {card.card_image ? (
                  <img
                    src={card.card_image}
                    alt={card.card_name}
                    className="w-[120px] h-[167px] object-contain transition-all duration-300 group-hover:scale-105 rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-black text-white flex flex-col justify-center items-center text-center p-2 rounded-lg gap-1 font-sans text-[0.5rem] leading-tight overflow-hidden">
                    <strong
                      className="text-[0.6rem] whitespace-nowrap overflow-hidden text-ellipsis max-w-[95%]"
                      title={card.card_name}
                    >
                      {card.card_name || "Unnamed Card"}
                    </strong>
                    <div className="flex-1 flex flex-col justify-center gap-0.5 w-full text-[0.5rem]">
                      <span>
                        <strong>Type:</strong> {card.card_type ?? "—"}
                      </span>
                      <span>
                        <strong>Cost:</strong>{" "}
                        {card.card_cost === -2 ? "No Cost" : card.card_cost ?? "—"}
                      </span>
                      <span>
                        <strong>Power:</strong>{" "}
                        {card.card_power === -1
                          ? "No Power"
                          : card.card_power ?? "—"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredCards.length === 0 && (
            <p className="text-center mt-5 font-one-piece font-bold text-white text-3xl">
              No cards found.
            </p>
          )}
        </div>
      </div>

      {/* Right Side - Deck Display */}
      <div className="w-1/2 flex flex-col bg-black/20 relative">
        {/* Hover Preview for Search Cards */}
        {hoveredCard && !hoveredCard.fromDeck && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <img
              src={hoveredCard.card_image}
              alt={hoveredCard.card_name}
              className="w-[500px] h-auto rounded-xl shadow-2xl"
            />
          </div>
        )}

        {/* Fixed Stats Section */}
        <div className="flex-shrink-0">
          <DeckStats deck={deck} />
        </div>

        {/* Scrollable Deck Section */}
        <div className="flex-1 overflow-y-auto p-4">
          {deck.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-white font-one-piece text-3xl text-center mb-4">
                Click cards on the left to add them to your deck!
              </p>
              <div className="text-white font-sans text-lg text-center">
                <p>📜 Deck Rules:</p>
                <p>• 1 Leader card</p>
                <p>• 50 other cards</p>
                <p>• Max 4 copies of each card</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,180px))] gap-4 p-2 justify-center">
            {sortedDeckEntries.map(({ card, count }) => {
              const isLeader = card.card_type === "Leader";
              return (
                <div
                  key={card.card_set_id}
                  className="group relative cursor-pointer hover:scale-110 hover:-translate-y-2 hover:rotate-2 transition-all duration-300 ease-out w-[180px] transform-gpu"
                  onClick={() => removeCardFromDeck(card.card_set_id)}
                  onMouseEnter={() => setHoveredCard({ ...card, fromDeck: true })}
                  onMouseLeave={() => setHoveredCard(null)}
                  title={`Click to remove one copy (${count} in deck)`}
                >
                  {/* Stacked card effect - show shadows for multiple copies */}
                  {count > 1 && (
                    <>
                      <div className="absolute top-1 left-1 w-full h-full bg-white/20 rounded-[10px] -z-10"></div>
                      {count > 2 && (
                        <div className="absolute top-2 left-2 w-full h-full bg-white/10 rounded-[10px] -z-20"></div>
                      )}
                      {count > 3 && (
                        <div className="absolute top-3 left-3 w-full h-full bg-white/5 rounded-[10px] -z-30"></div>
                      )}
                    </>
                  )}

                  {/* Main card display */}
                  <div className={`relative bg-transparent rounded-[10px] shadow-[0px_2px_6px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col items-center transition-all duration-300 ${isLeader ? 'shadow-[0px_0px_12px_rgba(250,204,21,0.6)] animate-pulse-glow' : ''} group-hover:shadow-[0px_10px_25px_rgba(255,0,0,0.6)]`}>
                    {/* Card count badge */}
                    <div className="absolute top-2 right-2 bg-black text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-lg border-2 border-white z-10">
                      {count}
                    </div>

                    {card.card_image ? (
                      <img
                        src={card.card_image}
                        alt={card.card_name}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 rounded-[10px]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-black text-white flex flex-col justify-center items-center text-center p-2 rounded-lg gap-1 font-sans text-[clamp(0.6rem,0.8vw,0.8rem)] leading-tight overflow-hidden">
                        <strong
                          className="text-[clamp(0.8rem,1vw,1rem)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[95%]"
                          title={card.card_name}
                        >
                          {card.card_name || "Unnamed Card"}
                        </strong>
                        <div className="flex-1 flex flex-col justify-center gap-0.5 w-full text-[0.7rem]">
                          <span>
                            <strong>Type:</strong> {card.card_type ?? "—"}
                          </span>
                          <span>
                            <strong>Cost:</strong>{" "}
                            {card.card_cost === -2
                              ? "No Cost"
                              : card.card_cost ?? "—"}
                          </span>
                          <span>
                            <strong>Power:</strong>{" "}
                            {card.card_power === -1
                              ? "No Power"
                              : card.card_power ?? "—"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          )}

          {/* Clear deck button */}
          {deck.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setDeck([])}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-one-piece text-2xl px-8 py-3 rounded-[30px] transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-[0_10px_30px_rgba(220,38,38,0.6)] active:scale-95 shadow-lg"
              >
                Clear Deck
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for card details */}
      {selectedCard && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black/70 flex items-center justify-center z-[9999] p-5"
          onClick={() => setSelectedCard(null)}
        >
          <button
            className="fixed top-8 bg-black/60 border-none text-6xl font-bold text-[rgb(196,29,29)] cursor-pointer z-[10000] rounded-full w-[60px] h-[60px] flex items-center justify-center transition-all duration-200 ease hover:scale-[1.2] hover:text-[#ff4d4d]"
            onClick={() => setSelectedCard(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <div
            className="inline-flex flex-col items-center gap-3 w-auto h-auto max-w-none max-h-none bg-transparent relative"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedCard.card_image ? (
              <img
                src={selectedCard.card_image}
                alt={selectedCard.card_name}
                className="max-w-[90vw] max-h-[60vh] object-contain rounded-[10px] shadow-[0px_4px_12px_rgba(0,0,0,0.5)]"
              />
            ) : (
              <div className="bg-black text-white w-[min(300px,60vw)] aspect-[3/4] flex flex-col justify-center items-center text-center text-[clamp(0.8rem,1.2vw,1rem)] font-bold rounded-lg mx-auto p-2 overflow-hidden max-h-[60vh]">
                <strong className="text-[clamp(1rem,2vw,1.4rem)]">
                  {selectedCard.card_name || "No Image"}
                </strong>
                <p className="text-[clamp(0.7rem,1vw,0.9rem)] my-1 leading-[1.3]">
                  <strong>Type:</strong> {selectedCard.card_type ?? "—"}
                  <br />
                  <strong>Cost:</strong>{" "}
                  {selectedCard.card_cost === -2
                    ? "No Cost"
                    : selectedCard.card_cost ?? "—"}
                  <br />
                  <strong>Power:</strong>{" "}
                  {selectedCard.card_power === -1
                    ? "No Power"
                    : selectedCard.card_power ?? "—"}
                  <br />
                  {selectedCard.attribute && (
                    <>
                      <strong>Attribute:</strong> {selectedCard.attribute}
                      <br />
                    </>
                  )}
                  {selectedCard.card_color && (
                    <>
                      <strong>Color:</strong> {selectedCard.card_color}
                      <br />
                    </>
                  )}
                  {selectedCard.set_id && (
                    <>
                      <strong>Set:</strong> {selectedCard.set_id}
                      <br />
                    </>
                  )}
                  {selectedCard.card_text && (
                    <>
                      <strong>Effect:</strong> {selectedCard.card_text}
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="bg-black/85 rounded-[10px] p-5 w-[60%] max-h-[25vh] overflow-y-auto text-white text-center shadow-[0px_4px_12px_rgba(0,0,0,0.5)] scrollbar-modal">
              <h2 className="text-[clamp(1.5rem,2vw,2rem)] m-0 mb-2.5 font-bold text-center font-sans">
                {selectedCard.card_name}
              </h2>
              <p
                className="text-[clamp(1rem,1.5vw,1.3rem)] leading-relaxed whitespace-pre-line font-sans"
                dangerouslySetInnerHTML={{
                  __html: highlightCardText(selectedCard.card_text),
                }}
              />
              <p
                className="text-[clamp(1rem,1.5vw,1.3rem)] leading-relaxed whitespace-pre-line font-sans"
                dangerouslySetInnerHTML={{
                  __html: highlightCardText(selectedCard.sub_types),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
