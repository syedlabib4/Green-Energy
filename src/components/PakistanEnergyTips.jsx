import { useState } from "react";
import { Lightbulb, ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const PakistanEnergyTips = () => {
  const { darkMode } = useTheme();
  const [expandedTip, setExpandedTip] = useState(null);

  const tips = [
    {
      id: 1,
      title: "Use Inverter ACs",
      description: "Inverter ACs consume 40% less energy than conventional ACs. Perfect for Pakistan's hot climate.",
      savings: "Save Rs 3,000-5,000/month",
      category: "Cooling",
    },
    {
      id: 2,
      title: "Replace Old Fans",
      description: "DC inverter fans use only 30-40W compared to 75W for regular fans. That's 50% less energy!",
      savings: "Save Rs 500-800/month per fan",
      category: "Appliances",
    },
    {
      id: 3,
      title: "LED Lighting Everywhere",
      description: "Replace all CFL and incandescent bulbs with LED. LEDs use 80% less energy and last 10x longer.",
      savings: "Save Rs 200-500/month",
      category: "Lighting",
    },
    {
      id: 4,
      title: "Optimize AC Temperature",
      description: "Keep AC at 26°C instead of 22°C. Every degree saves 6% energy. Use ceiling fans with AC.",
      savings: "Save Rs 1,500-2,500/month",
      category: "Cooling",
    },
    {
      id: 5,
      title: "Use Energy Star Rated Appliances",
      description: "When buying new appliances, look for 5-star energy rating. They consume 30-50% less power.",
      savings: "Save 30-50% on appliance bills",
      category: "Appliances",
    },
    {
      id: 6,
      title: "Solar Water Heaters",
      description: "Install solar water heaters for geysers. Free hot water during sunny days (most of the year in Pakistan).",
      savings: "Save Rs 2,000-3,500/month",
      category: "Solar",
    },
    {
      id: 7,
      title: "Unplug Devices When Not in Use",
      description: "Phone chargers, TVs on standby, and other devices consume phantom power even when off.",
      savings: "Save Rs 300-500/month",
      category: "Habits",
    },
    {
      id: 8,
      title: "Time-of-Use Optimization",
      description: "Use heavy appliances (washing machine, iron) during off-peak hours (after midnight) for better rates.",
      savings: "Save 10-15% on bills",
      category: "Timing",
    },
    {
      id: 9,
      title: "Proper Insulation",
      description: "Insulate your roof and walls. Keeps home cooler in summer, warmer in winter. Reduces AC/heating needs.",
      savings: "Save Rs 2,000-4,000/month",
      category: "Home",
    },
    {
      id: 10,
      title: "Natural Ventilation",
      description: "Open windows during cooler hours (early morning, late evening) to naturally cool your home.",
      savings: "Reduce AC usage by 20-30%",
      category: "Habits",
    },
  ];

  const categories = ["All", "Cooling", "Appliances", "Lighting", "Solar", "Habits", "Timing", "Home"];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTips =
    selectedCategory === "All"
      ? tips
      : tips.filter((tip) => tip.category === selectedCategory);

  return (
    <div
      className={`rounded-xl sm:rounded-2xl shadow-xl border p-4 sm:p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 border-yellow-500/30 text-gray-100"
          : "bg-white border-yellow-200 text-gray-900"
      } hover:shadow-2xl`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div
          className={`p-2 sm:p-3 rounded-xl ${
            darkMode ? "bg-yellow-500/20" : "bg-yellow-100"
          }`}
        >
          <Lightbulb className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
        </div>
        <div>
          <h2
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Energy Saving Tips
          </h2>
          <p
            className={`text-xs sm:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Practical tips for Pakistan households
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition min-h-[36px] sm:min-h-[40px] ${
              selectedCategory === cat
                ? darkMode
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-yellow-500 text-white"
                : darkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className={`rounded-xl border transition-all cursor-pointer ${
              darkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() =>
              setExpandedTip(expandedTip === tip.id ? null : tip.id)
            }
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                    {tip.category}
                  </span>
                  <h3
                    className={`font-bold ${
                      darkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {tip.title}
                  </h3>
                </div>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {expandedTip === tip.id ? tip.description : tip.savings}
                </p>
              </div>
              <ChevronRight
                className={`w-5 h-5 transition-transform ${
                  expandedTip === tip.id ? "rotate-90" : ""
                } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              />
            </div>
            {expandedTip === tip.id && (
              <div
                className={`px-4 pb-4 pt-2 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <p
                  className={`text-sm mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {tip.description}
                </p>
                <p
                  className={`text-xs font-semibold ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  💰 {tip.savings}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PakistanEnergyTips;

