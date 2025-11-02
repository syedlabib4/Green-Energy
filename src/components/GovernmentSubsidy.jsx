import { useState } from "react";
import { Building2, DollarSign, Info } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const GovernmentSubsidy = ({ systemSizeKW = 0 }) => {
  const { darkMode } = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Pakistan Government Solar Subsidies (2024)
  const subsidies = {
    netMetering: {
      title: "Net Metering Program",
      description: "Sell excess solar energy back to the grid",
      benefit: "Rs 19.32 per kWh excess energy sold",
      requirements: [
        "System must be 1,000W - 1,000,000W (1kW - 1MW) capacity",
        "Connection to distribution company",
        "Bi-directional meter installation",
      ],
    },
    solarPanelSubsidy: {
      title: "Solar Panel Subsidy",
      description: "Government support for solar installation",
      benefit: "Up to 30% discount on solar panels (varies by province)",
      requirements: [
        "Must be a registered consumer",
        "System installed by certified installer",
        "Compliance with provincial regulations",
      ],
    },
    taxIncentive: {
      title: "Tax Benefits",
      description: "Tax exemptions for solar investments",
      benefit: "No sales tax on solar equipment, income tax exemptions",
      requirements: [
        "Registered taxpayer",
        "Solar equipment purchase receipts",
        "Installation certificates",
      ],
    },
    financing: {
      title: "Easy Financing",
      description: "Low-interest loans for solar systems",
      benefit: "3-5% interest rates, 5-10 year terms",
      requirements: [
        "Good credit history",
        "Property ownership proof",
        "System cost above Rs 500,000",
      ],
    },
  };

  const calculateSubsidySavings = () => {
    if (!systemSizeKW || systemSizeKW === 0) return null;

    // Estimate excess energy generation (assume 30% excess)
    const monthlyGeneration = systemSizeKW * 5.0 * 30; // 5 sun hours avg
    const excessEnergy = monthlyGeneration * 0.3;
    const netMeteringIncome = excessEnergy * 19.32; // Rs per kWh
    
    // Panel subsidy (30% of system cost)
    const systemCost = systemSizeKW * 70000;
    const subsidyAmount = systemCost * 0.3;

    return {
      monthlyIncome: netMeteringIncome.toFixed(0),
      totalSubsidy: subsidyAmount.toFixed(0),
      annualIncome: (netMeteringIncome * 12).toFixed(0),
    };
  };

  const savings = calculateSubsidySavings();

  return (
    <div
      className={`rounded-xl sm:rounded-2xl shadow-xl border p-4 sm:p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/30 text-gray-100"
          : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-gray-900"
      } hover:shadow-2xl`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div
          className={`p-2 sm:p-3 rounded-xl ${
            darkMode ? "bg-blue-500/20" : "bg-blue-100"
          }`}
        >
          <Building2 className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
        </div>
        <div className="flex-1">
          <h2
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Government Subsidies & Benefits
          </h2>
          <p
            className={`text-xs sm:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Pakistan Government Solar Incentives 2024
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`p-2 rounded-lg transition ${
            darkMode
              ? "hover:bg-blue-500/20 text-blue-400"
              : "hover:bg-blue-100 text-blue-600"
          }`}
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {savings && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            darkMode
              ? "bg-green-900/20 border border-green-500/30"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-green-700 dark:text-green-400">
              Your Estimated Benefits
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Net Metering Income</p>
              <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 break-words">
                Rs {parseFloat(savings.monthlyIncome).toLocaleString()}/mo
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Initial Subsidy</p>
              <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400 break-words">
                Rs {parseFloat(savings.totalSubsidy).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div className="space-y-3 mt-4">
          {Object.entries(subsidies).map(([key, subsidy]) => (
            <div
              key={key}
              className={`p-3 rounded-lg ${
                darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <h4 className="font-semibold text-sm mb-1">{subsidy.title}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {subsidy.description}
              </p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400 mb-2">
                {subsidy.benefit}
              </p>
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-500 dark:text-gray-400">
                  Requirements
                </summary>
                <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                  {subsidy.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      )}

      {!expanded && (
        <p
          className={`text-xs text-center mt-2 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Click info icon to see all available subsidies
        </p>
      )}
    </div>
  );
};

export default GovernmentSubsidy;
