import { useState, useEffect } from "react";

// Predefined values to always show (moved outside component to avoid re-creation)
const allCounterValues = [1000, 2000];
const allCostValues = ["NC", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const allColorValues = ["Red", "Green", "Blue", "Purple", "Black", "Yellow"];
const allTypeValues = ["Character", "Event", "Stage"];

function DeckStats({ deck }) {
  const [animatedHeights, setAnimatedHeights] = useState({});

  // Calculate counter stats
  const counterStats = deck.reduce((acc, card) => {
    if (card.card_type === "Leader") return acc;
    const counter = card.counter_amount;
    if (counter !== null && counter !== undefined) {
      acc[counter] = (acc[counter] || 0) + 1;
    }
    return acc;
  }, {});

  // Calculate cost stats
  const costStats = deck.reduce((acc, card) => {
    if (card.card_type === "Leader") return acc;
    const cost = card.card_cost;
    if (cost !== null && cost !== undefined) {
      const displayCost = cost === -2 ? "NC" : cost;
      acc[displayCost] = (acc[displayCost] || 0) + 1;
    }
    return acc;
  }, {});

  // Calculate color stats
  const colorStats = deck.reduce((acc, card) => {
    if (card.card_type === "Leader") return acc;
    const color = card.card_color;
    if (color) {
      acc[color] = (acc[color] || 0) + 1;
    }
    return acc;
  }, {});

  // Calculate type stats
  const typeStats = deck.reduce((acc, card) => {
    const type = card.card_type;
    if (type && type !== "Leader") {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {});

  // Update bar heights when deck changes
  useEffect(() => {
    const animated = {};

    allCounterValues.forEach(val => {
      const count = counterStats[val] || 0;
      animated[`counter-${val}`] = count;
    });

    allCostValues.forEach(val => {
      const count = costStats[val] || 0;
      animated[`cost-${val}`] = count;
    });

    allColorValues.forEach(val => {
      const count = colorStats[val] || 0;
      animated[`color-${val}`] = count;
    });

    allTypeValues.forEach(val => {
      const count = typeStats[val] || 0;
      animated[`type-${val}`] = count;
    });

    setAnimatedHeights(animated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck]);

  return (
    <div className="sticky top-0 z-20 bg-gradient-to-br from-[#1a5f7a] via-[#13a4db] to-[#0d8fb3] pb-3 pt-2 px-4 shadow-lg">
      <div className="grid grid-cols-3 gap-3 text-white text-sm">
          {/* Counter Stats */}
          <div className="glass p-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
            <div className="font-bold mb-1 text-xs">Counter</div>
            <div className="flex items-end justify-around gap-1 h-24">
              {allCounterValues.map((counter) => {
                const count = counterStats[counter] || 0;
                const heightPercent = animatedHeights[`counter-${counter}`] || 0;

                return (
                  <div key={counter} className="flex flex-col items-center flex-1">
                    <div className="text-white font-bold text-xs mb-0.5">
                      {count}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-yellow-400 to-orange-500 rounded-t-lg transition-all duration-500 ease-out"
                      style={{
                        height: count > 0 ? `${heightPercent * 4}px` : "0px",
                        minHeight: count > 0 ? "16px" : "0px"
                      }}
                    ></div>
                    <div className="text-white font-bold mt-0.5 text-[10px]">
                      +{counter}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost Stats */}
          <div className="glass p-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
            <div className="font-bold mb-1 text-xs">Cost</div>
            <div className="flex items-end justify-around gap-1 h-24">
              {allCostValues.map((cost) => {
                const count = costStats[cost] || 0;
                const heightPercent = animatedHeights[`cost-${cost}`] || 0;

                return (
                  <div key={cost} className="flex flex-col items-center flex-1">
                    <div className="text-white font-bold text-xs mb-0.5">
                      {count}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-blue-400 to-cyan-500 rounded-t-lg transition-all duration-500 ease-out"
                      style={{
                        height: count > 0 ? `${heightPercent * 4}px` : "0px",
                        minHeight: count > 0 ? "16px" : "0px"
                      }}
                    ></div>
                    <div className="text-white font-bold mt-0.5 text-[10px]">
                      {cost}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Type Stats */}
          <div className="glass p-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
            <div className="font-bold mb-1 text-xs">Type</div>
            <div className="flex items-end justify-around gap-1 h-24">
              {allTypeValues.map((type) => {
                const count = typeStats[type] || 0;
                const heightPercent = animatedHeights[`type-${type}`] || 0;

                return (
                  <div key={type} className="flex flex-col items-center flex-1">
                    <div className="text-white font-bold text-xs mb-0.5">
                      {count}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-green-400 to-emerald-500 rounded-t-lg transition-all duration-500 ease-out"
                      style={{
                        height: count > 0 ? `${heightPercent * 4}px` : "0px",
                        minHeight: count > 0 ? "16px" : "0px"
                      }}
                    ></div>
                    <div className="text-white font-bold mt-0.5 text-[10px]">
                      {type}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
    </div>
  );
}

export default DeckStats;
