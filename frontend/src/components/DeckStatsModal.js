import { useState, useEffect } from "react";

function DeckStatsModal({ deck, onClose }) {
  const [animatedHeights, setAnimatedHeights] = useState({});

  // Calculate counter stats
  const counterStats = deck ? deck.reduce((acc, card) => {
    if (card.card_type === "Leader") return acc; // Exclude leaders

    const counter = card.counter_amount;
    if (counter !== null && counter !== undefined) {
      acc[counter] = (acc[counter] || 0) + 1;
    }
    return acc;
  }, {}) : {};

  // Get all possible counter values and sort them
  const counterValues = Object.keys(counterStats)
    .map(Number)
    .sort((a, b) => a - b);

  // Calculate cost stats
  const costStats = deck ? deck.reduce((acc, card) => {
    if (card.card_type === "Leader") return acc; // Exclude leaders

    const cost = card.card_cost;
    if (cost !== null && cost !== undefined) {
      const displayCost = cost === -2 ? "No Cost" : cost;
      acc[displayCost] = (acc[displayCost] || 0) + 1;
    }
    return acc;
  }, {}) : {};

  // Get all possible cost values and sort them
  const costValues = Object.keys(costStats).sort((a, b) => {
    if (a === "No Cost") return -1;
    if (b === "No Cost") return 1;
    return Number(a) - Number(b);
  });

  // Calculate color stats
  const colorStats = deck ? deck.reduce((acc, card) => {
    if (card.card_type === "Leader") return acc; // Exclude leaders

    const color = card.card_color;
    if (color) {
      acc[color] = (acc[color] || 0) + 1;
    }
    return acc;
  }, {}) : {};

  const colorValues = Object.keys(colorStats).sort();

  // Calculate type stats
  const typeStats = deck ? deck.reduce((acc, card) => {
    const type = card.card_type;
    if (type && type !== "Leader") {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {}) : {};

  const typeValues = Object.keys(typeStats).sort();

  // Find max values for scaling
  const maxCounter = Math.max(...Object.values(counterStats), 1);
  const maxCost = Math.max(...Object.values(costStats), 1);
  const maxColor = Math.max(...Object.values(colorStats), 1);
  const maxType = Math.max(...Object.values(typeStats), 1);

  // Trigger animation on mount
  useEffect(() => {
    if (!deck) return;

    const timer = setTimeout(() => {
      const animated = {};

      counterValues.forEach(val => {
        animated[`counter-${val}`] = (counterStats[val] / maxCounter) * 100;
      });

      costValues.forEach(val => {
        animated[`cost-${val}`] = (costStats[val] / maxCost) * 100;
      });

      colorValues.forEach(val => {
        animated[`color-${val}`] = (colorStats[val] / maxColor) * 100;
      });

      typeValues.forEach(val => {
        animated[`type-${val}`] = (typeStats[val] / maxType) * 100;
      });

      setAnimatedHeights(animated);
    }, 100);

    return () => clearTimeout(timer);
  }, [deck, counterValues, costValues, colorValues, typeValues, counterStats, costStats, colorStats, typeStats, maxCounter, maxCost, maxColor, maxType]);

  if (!deck) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-[#1a5f7a] to-[#13a4db] p-8 rounded-2xl max-w-6xl w-11/12 max-h-[90vh] overflow-y-auto relative shadow-2xl border-4 border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500 transition-colors duration-200 z-10"
        >
          ✖
        </button>

        <h2 className="text-5xl font-one-piece text-white mb-8 text-center [text-shadow:2px_2px_6px_rgba(0,0,0,0.8)]">
          Deck Statistics
        </h2>

        <div className="space-y-8">
          {/* Counter Distribution */}
          <div className="bg-white/10 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-4 font-sans">
              Counter Distribution
            </h3>
            <div className="flex items-end justify-around gap-4 h-64">
              {counterValues.map((counter) => {
                const count = counterStats[counter];
                const heightPercent = animatedHeights[`counter-${counter}`] || 0;

                return (
                  <div key={counter} className="flex flex-col items-center flex-1 max-w-[100px]">
                    <div className="text-white font-bold text-lg mb-2">
                      {count}
                    </div>
                    <div className="w-full bg-white/20 rounded-t-lg relative flex items-end justify-center"
                         style={{
                           height: `${heightPercent}%`,
                           transition: "height 0.8s ease-out",
                           minHeight: count > 0 ? "30px" : "0px"
                         }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-t-lg"></div>
                    </div>
                    <div className="text-white font-bold mt-2 text-sm">
                      +{counter}
                    </div>
                  </div>
                );
              })}
            </div>
            {counterValues.length === 0 && (
              <p className="text-white text-center text-lg">No counter data available</p>
            )}
          </div>

          {/* Cost Distribution */}
          <div className="bg-white/10 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-4 font-sans">
              Cost Distribution
            </h3>
            <div className="flex items-end justify-around gap-4 h-64">
              {costValues.map((cost) => {
                const count = costStats[cost];
                const heightPercent = animatedHeights[`cost-${cost}`] || 0;

                return (
                  <div key={cost} className="flex flex-col items-center flex-1 max-w-[100px]">
                    <div className="text-white font-bold text-lg mb-2">
                      {count}
                    </div>
                    <div className="w-full bg-white/20 rounded-t-lg relative flex items-end justify-center"
                         style={{
                           height: `${heightPercent}%`,
                           transition: "height 0.8s ease-out",
                           minHeight: count > 0 ? "30px" : "0px"
                         }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-400 to-cyan-500 rounded-t-lg"></div>
                    </div>
                    <div className="text-white font-bold mt-2 text-sm">
                      {cost}
                    </div>
                  </div>
                );
              })}
            </div>
            {costValues.length === 0 && (
              <p className="text-white text-center text-lg">No cost data available</p>
            )}
          </div>

          {/* Color Distribution */}
          <div className="bg-white/10 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-4 font-sans">
              Color Distribution
            </h3>
            <div className="flex items-end justify-around gap-4 h-64">
              {colorValues.map((color) => {
                const count = colorStats[color];
                const heightPercent = animatedHeights[`color-${color}`] || 0;

                return (
                  <div key={color} className="flex flex-col items-center flex-1 max-w-[100px]">
                    <div className="text-white font-bold text-lg mb-2">
                      {count}
                    </div>
                    <div className="w-full bg-white/20 rounded-t-lg relative flex items-end justify-center"
                         style={{
                           height: `${heightPercent}%`,
                           transition: "height 0.8s ease-out",
                           minHeight: count > 0 ? "30px" : "0px"
                         }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-400 to-pink-500 rounded-t-lg"></div>
                    </div>
                    <div className="text-white font-bold mt-2 text-sm">
                      {color}
                    </div>
                  </div>
                );
              })}
            </div>
            {colorValues.length === 0 && (
              <p className="text-white text-center text-lg">No color data available</p>
            )}
          </div>

          {/* Type Distribution */}
          <div className="bg-white/10 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-4 font-sans">
              Card Type Distribution
            </h3>
            <div className="flex items-end justify-around gap-4 h-64">
              {typeValues.map((type) => {
                const count = typeStats[type];
                const heightPercent = animatedHeights[`type-${type}`] || 0;

                return (
                  <div key={type} className="flex flex-col items-center flex-1 max-w-[100px]">
                    <div className="text-white font-bold text-lg mb-2">
                      {count}
                    </div>
                    <div className="w-full bg-white/20 rounded-t-lg relative flex items-end justify-center"
                         style={{
                           height: `${heightPercent}%`,
                           transition: "height 0.8s ease-out",
                           minHeight: count > 0 ? "30px" : "0px"
                         }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-green-400 to-emerald-500 rounded-t-lg"></div>
                    </div>
                    <div className="text-white font-bold mt-2 text-sm">
                      {type}
                    </div>
                  </div>
                );
              })}
            </div>
            {typeValues.length === 0 && (
              <p className="text-white text-center text-lg">No type data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckStatsModal;
