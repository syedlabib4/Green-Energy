import { useState, useEffect } from "react";
import { AlertTriangle, Zap, Clock, TrendingDown } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const LoadSheddingImpact = ({ monthlyKWh = 0 }) => {
  const { darkMode } = useTheme();
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    calculateImpact();
  }, [hoursPerDay, monthlyKWh]);

  const calculateImpact = () => {
    if (!monthlyKWh || monthlyKWh === 0) {
      setImpact(null);
      return;
    }

    const dailyKWh = monthlyKWh / 30;
    const averagePowerKW = dailyKWh / 24;
    
    const energyLostPerDay = averagePowerKW * hoursPerDay;
    const energyLostPerMonth = energyLostPerDay * 30;
    const energyLostPerYear = energyLostPerMonth * 12;

    const backupCostPerKWh = 25;
    const monthlyCost = energyLostPerMonth * backupCostPerKWh;
    const yearlyCost = energyLostPerYear * backupCostPerKWh;

    const productivityLossPerHour = 500;
    const monthlyProductivityLoss = hoursPerDay * 30 * productivityLossPerHour;

    const carbonPerKWh = 0.84;
    const monthlyCarbon = energyLostPerMonth * carbonPerKWh;
    const yearlyCarbon = energyLostPerYear * carbonPerKWh;

    setImpact({
      energyLostPerMonth: energyLostPerMonth.toFixed(2),
      energyLostPerYear: energyLostPerYear.toFixed(2),
      monthlyCost: monthlyCost.toFixed(2),
      yearlyCost: yearlyCost.toFixed(2),
      monthlyProductivityLoss: monthlyProductivityLoss.toFixed(0),
      monthlyCarbon: monthlyCarbon.toFixed(2),
      yearlyCarbon: yearlyCarbon.toFixed(2),
    });
  };

  return (
    <div
      className={`rounded-xl sm:rounded-2xl shadow-xl border p-4 sm:p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 border-red-500/30 text-gray-100"
          : "bg-white border-red-200 text-gray-900"
      } hover:shadow-2xl`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div
          className={`p-3 rounded-xl ${
            darkMode ? "bg-red-500/20" : "bg-red-100"
          }`}
        >
          <AlertTriangle
            className={`w-6 h-6 ${darkMode ? "text-red-400" : "text-red-600"}`}
          />
        </div>
        <div>
          <h2
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Load Shedding Impact
          </h2>
          <p
            className={`text-xs sm:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Calculate losses from power outages
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label
          className={`block text-sm font-medium mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Load Shedding Hours Per Day
        </label>
        <input
          type="number"
          min="0"
          max="12"
          step="0.5"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 0)}
          className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none transition ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-gray-50 border-gray-300 text-gray-900"
          }`}
        />
        <p
          className={`text-xs mt-1 ${
            darkMode ? "text-gray-500" : "text-gray-600"
          }`}
        >
          Average load shedding hours in your area
        </p>
      </div>

      {impact && monthlyKWh > 0 ? (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl ${
              darkMode
                ? "bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20"
                : "bg-gradient-to-br from-red-50 to-orange-50 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-red-500" />
              <p
                className={`font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Energy Lost
              </p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-red-600 break-words">
              {impact.energyLostPerMonth} kWh/month
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {impact.energyLostPerYear} kWh/year
            </p>
          </div>

          <div
            className={`p-4 rounded-xl ${
              darkMode
                ? "bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20"
                : "bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              <p
                className={`font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Financial Impact
              </p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-orange-600 break-words">
              Rs {parseFloat(impact.monthlyCost).toLocaleString()}/month
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Rs {parseFloat(impact.yearlyCost).toLocaleString()}/year
            </p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400 break-words">
              + Rs {parseFloat(impact.monthlyProductivityLoss).toLocaleString()} productivity loss
            </p>
          </div>

          <div
            className={`p-4 rounded-xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-500/10 to-slate-500/10 border border-gray-500/20"
                : "bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <p
                className={`font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Carbon Emissions (from backup)
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {impact.monthlyCarbon} kg CO₂/month
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {impact.yearlyCarbon} kg CO₂/year
            </p>
          </div>

          <div
            className={`mt-4 p-4 rounded-lg ${
              darkMode
                ? "bg-green-500/10 border border-green-500/20"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              💡 Solar Solution: Eliminate load shedding impact by generating your own power!
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`p-6 text-center rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Add appliances and calculate your energy usage to see load shedding impact
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadSheddingImpact;

