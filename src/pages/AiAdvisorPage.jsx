import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../contexts/ThemeContext";
import AiAdvisor from "../components/AiAdvisor";
import { Zap, TrendingDown, DollarSign, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import StatsCard from "../components/StatsCard";

const AiAdvisorPage = () => {
  const { darkMode } = useTheme();
  const [appliances, setAppliances] = useState([]);
  const [totalKWh, setTotalKWh] = useState(0);
  const [estimatedBill, setEstimatedBill] = useState("0");
  const [totalWatts, setTotalWatts] = useState(0);

  // Load appliances from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("appliances");
    if (saved) {
      const loaded = JSON.parse(saved);
      setAppliances(loaded);
      
      // Calculate totals
      const totalWattsCalc = loaded.reduce(
        (sum, a) => sum + (parseFloat(a.wattage) || 0),
        0
      );
      const dailyEnergyWh = loaded.reduce(
        (sum, a) => sum + (parseFloat(a.wattage) || 0) * (parseFloat(a.hours) || 0),
        0
      );
      const dailyKWh = dailyEnergyWh / 1000;
      const monthlyKWh = dailyKWh * 30;
      setTotalWatts(totalWattsCalc);
      setTotalKWh(monthlyKWh);
      setEstimatedBill((monthlyKWh * 55 + 1550).toFixed(2));
    }
  }, []);

  const monthlyKWh = totalKWh;
  const dailyKWh = totalKWh / 30;

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col relative h-screen ml-0 md:ml-56 lg:ml-64" data-navbar-spacing>
        {/* Minimal Header - Inline with Stats */}
        <div className="flex-shrink-0 p-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  darkMode
                    ? "bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 shadow-lg shadow-emerald-500/50"
                    : "bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 shadow-lg"
                }`}
              >
                <span className="text-lg">🤖</span>
              </div>
              <h1
                className={`text-base sm:text-lg font-bold ${
                  darkMode
                    ? "bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent"
                }`}
              >
                AI Advisor
              </h1>
            </div>
          </div>

          {/* Stats Cards - Ultra Compact */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              <StatsCard
                label="Total Load"
                value={`${totalWatts.toLocaleString()}W`}
                subvalue={`${(totalWatts / 1000).toFixed(1)}kW`}
                icon={<Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              />
              <StatsCard
                label="Monthly Energy"
                value={`${monthlyKWh.toFixed(0)}kWh`}
                subvalue={`Rs ${parseFloat(estimatedBill).toLocaleString()}`}
                icon={<DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              />
              <StatsCard
                label="Daily Usage"
                value={`${dailyKWh.toFixed(1)}kWh`}
                subvalue={`${(dailyKWh * 1000).toLocaleString()}Wh`}
                icon={<TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              />
              <StatsCard
                label="CO₂ Impact"
                value={`${Math.round(totalKWh * 0.84)}kg`}
                subvalue={`${(totalKWh * 0.84 / 1000).toFixed(1)} tonnes/year`}
                icon={<Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              />
            </div>
          </div>
        </div>

        {/* AI Chat Component - Takes remaining space */}
        <div className="flex-1 min-h-0 p-1.5 sm:p-2 max-w-7xl mx-auto w-full">
          <AiAdvisor
            appliances={appliances}
            totalKWh={totalKWh}
            estimatedBill={estimatedBill}
          />
        </div>
      </main>
    </div>
  );
};

export default AiAdvisorPage;
