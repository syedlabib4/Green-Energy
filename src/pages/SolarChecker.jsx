import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import GovernmentSubsidy from "../components/GovernmentSubsidy";

const SolarChecker = () => {
  const [city, setCity] = useState("Karachi");
  const [roofArea, setRoofArea] = useState("");
  const [orientation, setOrientation] = useState("South");
  const [monthlyUsage, setMonthlyUsage] = useState("");
  const [utilityCompany, setUtilityCompany] = useState("K-Electric");
  const [results, setResults] = useState(null);
  const { darkMode } = useTheme();
  const { success, error } = useToast();

  // Pakistan utility company rates (Rs/kWh average 2024)
  const utilityRates = {
    "K-Electric": 55,
    "LESCO": 52,
    "GEPCO": 50,
    "FESCO": 53,
    "IESCO": 51,
    "MEPCO": 49,
    "PESCO": 48,
    "HESCO": 54,
    "QESCO": 47,
  };

  const electricityRate = utilityRates[utilityCompany] || 55;

  // Pakistan cities with average sun hours
  const citySunHours = {
    "Karachi": 5.2,
    "Lahore": 4.8,
    "Islamabad": 5.0,
    "Rawalpindi": 4.9,
    "Multan": 5.1,
    "Faisalabad": 4.9,
    "Peshawar": 4.7,
    "Quetta": 5.3,
    "Hyderabad": 5.0,
  };

  const handleCalculate = () => {
    const roof = parseFloat(roofArea);
    const usage = parseFloat(monthlyUsage);
    
    if (!roofArea || !monthlyUsage) {
      error("Please enter both roof area and monthly usage");
      return;
    }
    
    if (isNaN(roof) || roof <= 0 || roof > 10000) {
      error("Please enter valid roof area (1-10,000 m²)");
      return;
    }
    
    if (isNaN(usage) || usage <= 0 || usage > 10000) {
      error("Please enter valid monthly usage (1-10,000 kWh)");
      return;
    }

    const sunHoursPerDay = citySunHours[city] || 5.0; // City-specific sun hours
    const panelEfficiency = 0.20; // Modern panels 20% efficiency
    const roofUtilization = 0.75; // 75% of roof usable

    const systemSizeKW = (
      (roofArea * panelEfficiency * roofUtilization) /
      1
    ).toFixed(2);
    const monthlyProduction = (systemSizeKW * sunHoursPerDay * 30).toFixed(2);
    const monthlySavings = (monthlyProduction * electricityRate).toFixed(2);
    // Pakistan solar panel cost (2024): Rs 70 per Watt (Rs 70,000 per kW) for complete system
    const systemCost = systemSizeKW * 70000;
    const paybackYears = (systemCost / monthlySavings).toFixed(1);

    let orientationScore = 100;
    if (orientation === "East" || orientation === "West") orientationScore = 70;
    if (orientation === "North") orientationScore = 50;

    const suitabilityScore = (
      (orientationScore + Math.min(roofArea / 50, 100)) /
      2
    ).toFixed(0);

    setResults({
      systemSizeKW,
      monthlyProduction,
      monthlySavings,
      paybackYears,
      suitabilityScore,
    });
    
    success("Solar analysis calculated successfully!");
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto pt-16 md:pt-20 ml-0 md:ml-56 lg:ml-64">
        <h1
          className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${
            darkMode ? "text-green-400" : "text-green-700"
          }`}
        >
          ☀️ Solar Suitability Calculator - Pakistan
        </h1>
        <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Calculate ROI and system requirements for your Pakistani home
        </p>

        <div
          className={`p-4 sm:p-6 rounded-xl shadow-lg border mb-6 max-w-3xl mx-auto transition-colors duration-300 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            Enter Your Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block mb-1 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                City (Pakistan)
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`border p-3 sm:p-2.5 rounded-lg w-full focus:ring-2 focus:ring-green-500 transition text-sm min-h-[44px] ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300"
                }`}
              >
                {Object.keys(citySunHours).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block mb-1 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Utility Company
              </label>
              <select
                value={utilityCompany}
                onChange={(e) => setUtilityCompany(e.target.value)}
                className={`border p-3 sm:p-2.5 rounded-lg w-full focus:ring-2 focus:ring-green-500 transition text-sm min-h-[44px] ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300"
                }`}
              >
                {Object.keys(utilityRates).map((u) => (
                  <option key={u} value={u}>{u} (Rs {utilityRates[u]}/kWh)</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block mb-1 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Roof Area (m²)
              </label>
              <input
                type="number"
                value={roofArea}
                onChange={(e) => setRoofArea(e.target.value)}
                placeholder="e.g., 100"
                className={`border p-3 sm:p-2.5 rounded-lg w-full focus:ring-2 focus:ring-green-500 transition text-sm min-h-[44px] ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className={`block mb-1 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Roof Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className={`border p-3 sm:p-2.5 rounded-lg w-full focus:ring-2 focus:ring-green-500 transition text-sm min-h-[44px] ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300"
                }`}
              >
                <option>South (Best)</option>
                <option>East</option>
                <option>West</option>
                <option>North</option>
              </select>
            </div>

            <div>
              <label className={`block mb-1 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Monthly Usage (kWh)
              </label>
              <input
                type="number"
                value={monthlyUsage}
                onChange={(e) => setMonthlyUsage(e.target.value)}
                placeholder="e.g., 500"
                className={`border p-3 sm:p-2.5 rounded-lg w-full focus:ring-2 focus:ring-green-500 transition text-sm min-h-[44px] ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className={`mt-4 w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl min-h-[48px] sm:min-h-[44px] flex items-center justify-center ${
              darkMode
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Calculate Solar ROI
          </button>
        </div>

        {results && (
          <div
            className={`p-4 sm:p-6 rounded-xl shadow-lg border max-w-3xl mx-auto transition-colors duration-300 ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
              📊 Solar System Analysis for {city}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-green-50"}`}>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>System Size</p>
                <p className={`text-xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                  {(parseFloat(results.systemSizeKW) * 1000).toLocaleString()} W
                </p>
                <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                  {results.systemSizeKW} kW
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Monthly Production</p>
                <p className={`text-xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                  {results.monthlyProduction} kWh
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-emerald-50"}`}>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Monthly Savings</p>
                <p className={`text-xl font-bold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                  Rs {parseFloat(results.monthlySavings).toLocaleString()}
                </p>
                <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                  At {electricityRate} Rs/kWh ({utilityCompany})
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-purple-50"}`}>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Payback Period</p>
                <p className={`text-xl font-bold ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                  {results.paybackYears} years
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-orange-50"} sm:col-span-2`}>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>Suitability Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${results.suitabilityScore}%` }}
                    ></div>
                  </div>
                  <p className={`text-lg font-bold ${darkMode ? "text-orange-400" : "text-orange-600"}`}>
                    {results.suitabilityScore}%
                  </p>
                </div>
              </div>
            </div>
            <div className={`mt-4 p-3 rounded-lg ${darkMode ? "bg-green-900/20 border border-green-500/30" : "bg-green-50 border border-green-200"}`}>
              <p className={`text-sm ${darkMode ? "text-green-400" : "text-green-700"}`}>
                💡 Estimated system cost: Rs {parseFloat(results.systemSizeKW * 70000).toLocaleString()}. 
                After {results.paybackYears} years, you'll save Rs {parseFloat(results.monthlySavings * 12).toLocaleString()}/year!
              </p>
            </div>
          </div>
        )}

        {results && (
          <GovernmentSubsidy systemSizeKW={parseFloat(results.systemSizeKW)} />
        )}
      </main>
    </div>
  );
};

export default SolarChecker;
