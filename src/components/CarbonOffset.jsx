import { useState, useEffect } from "react";
import { Leaf, TreePine, TrendingDown, Award } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const CarbonOffset = ({ monthlyKWh = 0, appliances = [] }) => {
  const { darkMode } = useTheme();
  const [carbonData, setCarbonData] = useState(null);

  const GRID_CARBON_FACTOR = 0.84;
  const SOLAR_CARBON_FACTOR = 0.05;

  useEffect(() => {
    calculateCarbon();
  }, [monthlyKWh, appliances]);

  const calculateCarbon = () => {
    if (!monthlyKWh || monthlyKWh === 0) {
      setCarbonData(null);
      return;
    }

    const monthlyCarbon = monthlyKWh * GRID_CARBON_FACTOR;
    const yearlyCarbon = monthlyCarbon * 12;
    const lifetimeCarbon = yearlyCarbon * 10;

    const treesNeeded = Math.ceil(yearlyCarbon / 20);

    const solarMonthlyCarbon = monthlyKWh * SOLAR_CARBON_FACTOR;
    const carbonSaved = monthlyCarbon - solarMonthlyCarbon;
    const yearlySavings = carbonSaved * 12;
    const lifetimeSavings = yearlySavings * 25;

    const carEquivalents = (yearlyCarbon / 4600).toFixed(2);

    const bottlesSaved = Math.round(yearlyCarbon * 25);

    setCarbonData({
      monthlyCarbon: monthlyCarbon.toFixed(2),
      yearlyCarbon: yearlyCarbon.toFixed(2),
      lifetimeCarbon: lifetimeCarbon.toFixed(2),
      treesNeeded,
      carbonSaved: carbonSaved.toFixed(2),
      yearlySavings: yearlySavings.toFixed(2),
      lifetimeSavings: lifetimeSavings.toFixed(2),
      carEquivalents,
      bottlesSaved,
    });
  };

  return (
    <div
      className={`rounded-xl sm:rounded-2xl shadow-xl border p-4 sm:p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 border-green-500/30 text-gray-100"
          : "bg-white border-green-200 text-gray-900"
      } hover:shadow-2xl`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div
          className={`p-3 rounded-xl ${
            darkMode ? "bg-green-500/20" : "bg-green-100"
          }`}
        >
          <Leaf className={`w-6 h-6 ${darkMode ? "text-green-400" : "text-green-600"}`} />
        </div>
        <div>
          <h2
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Carbon Footprint Tracker
          </h2>
          <p
            className={`text-xs sm:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Measure your environmental impact
          </p>
        </div>
      </div>

      {carbonData && monthlyKWh > 0 ? (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-xl ${
              darkMode
                ? "bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20"
                : "bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              <p
                className={`font-bold text-lg ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Current Emissions
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Monthly
                </p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600 break-words">
                  {carbonData.monthlyCarbon} kg
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Yearly
                </p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600 break-words">
                  {carbonData.yearlyCarbon} kg
                </p>
              </div>
            </div>
            <p className="text-xs mt-3 text-gray-600 dark:text-gray-400">
              ≈ {carbonData.carEquivalents} cars on the road for a year
            </p>
          </div>

          <div
            className={`p-5 rounded-xl ${
              darkMode
                ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
                : "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <TreePine className="w-5 h-5 text-green-500" />
              <p
                className={`font-bold text-lg ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Offset Required
              </p>
            </div>
            <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-600 mb-2 break-words">
              {carbonData.treesNeeded} Trees
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Need to plant to offset your yearly emissions
            </p>
          </div>

          <div
            className={`p-5 rounded-xl ${
              darkMode
                ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                : "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-blue-500" />
              <p
                className={`font-bold text-lg ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Solar Savings Potential
              </p>
            </div>
            <p className="text-xl sm:text-3xl font-bold text-blue-600 mb-2 break-words">
              {carbonData.yearlySavings} kg CO₂/year
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
              Carbon saved by switching to solar
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 break-words">
              Lifetime savings: {carbonData.lifetimeSavings} kg CO₂ over 25 years
            </p>
          </div>

          <div
            className={`p-4 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              🌍 Environmental Impact
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Your yearly emissions equal removing {carbonData.bottlesSaved.toLocaleString()} plastic bottles from the ocean
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
            Add appliances to track your carbon footprint and environmental impact
          </p>
        </div>
      )}
    </div>
  );
};

export default CarbonOffset;

