import { useEffect, useState } from "react";
import axios from "axios";
import MultiSelectDropdown from "./components/MultiSelectDropdown";
import CardModal from "./components/CardModal";

export default function CardsList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      <div className="p-4">
        <div className="block mx-auto mb-5 w-[80%] max-w-[700px] h-16 bg-white/20 backdrop-blur-sm rounded-[40px] animate-pulse"></div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 p-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm rounded-[10px] h-[300px] animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
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

  return (
    <div className="p-4">
      {/* Search bar */}
      <input
        type="text"
        className="block mx-auto mb-5 w-[80%] max-w-[700px] px-5 py-4 text-2xl font-sans font-bold rounded-[40px] border-[3px] border-black bg-white transition-all duration-300 ease-in-out hover:bg-[#cecece] hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(19,164,219,0.4)] focus:outline-none focus:scale-[1.05] focus:shadow-[0px_10px_30px_rgba(19,164,219,0.6)] focus:border-[#13a4db] placeholder:text-black/50 animate-slide-down"
        placeholder="🔎 Search for card"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Dropdown filters */}
      <div className="flex justify-evenly items-center flex-wrap gap-2.5 mb-4">
        <div className="flex gap-5 mb-4 flex-wrap">
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

      {/* Cards grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 p-4">
        {filteredCards.map((card, index) => (
          <div
            key={card.card_set_id}
            className="group bg-transparent border-transparent rounded-[10px] shadow-[0px_2px_6px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col items-center animate-appear transition-all duration-300 ease-out cursor-pointer opacity-0 translate-y-5 hover:scale-110 hover:shadow-[0px_10px_30px_rgba(19,164,219,0.5)] hover:-translate-y-2 hover:rotate-1 transform-gpu"
            onClick={() => setSelectedCard(card)}
            style={{ animationDelay: `${index * 0.02}s` }}
          >
            {card.card_image ? (
              <img
                src={card.card_image}
                alt={card.card_name}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 rounded-[10px]"
                loading="lazy"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-black text-white flex flex-col justify-center items-center text-center p-2 rounded-lg gap-1 font-sans text-[clamp(0.7rem,1vw,1rem)] leading-tight overflow-hidden">
                <strong
                  className="text-[clamp(0.9rem,1.3vw,1.2rem)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[95%]"
                  title={card.card_name}
                >
                  {card.card_name || "Unnamed Card"}
                </strong>
                <div className="flex-1 flex flex-col justify-center gap-0.5 w-full">
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
                  {card.attribute && (
                    <span>
                      <strong>Attribute:</strong> {card.attribute}
                    </span>
                  )}
                  {card.card_color && (
                    <span>
                      <strong>Color:</strong> {card.card_color}
                    </span>
                  )}
                  {card.set_id && (
                    <span>
                      <strong>Set:</strong> {card.set_id}
                    </span>
                  )}
                  {card.card_text && (
                    <span>
                      <strong>Effect:</strong> {card.card_text}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />

      {/* No results message */}
      {filteredCards.length === 0 && (
        <p className="text-center mt-5 font-one-piece font-bold text-white text-5xl">
          No cards found.
        </p>
      )}
    </div>
  );
}
