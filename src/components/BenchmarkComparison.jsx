import { BarChart3, TrendingUp, TrendingDown, Users } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const BenchmarkComparison = ({ monthlyKWh = 0, city = "Karachi" }) => {
  const { darkMode } = useTheme();

  // Pakistan city averages (kWh/month per household) - 2024 data
  const cityAverages = {
    Karachi: 520,
    Lahore: 480,
    Islamabad: 450,
    Rawalpindi: 470,
    Multan: 490,
    Faisalabad: 465,
    Peshawar: 455,
    Quetta: 440,
    Hyderabad: 475,
    Default: 480,
  };

  const cityAverage = cityAverages[city] || cityAverages.Default;
  const difference = monthlyKWh - cityAverage;
  const percentageDiff = cityAverage > 0 ? ((difference / cityAverage) * 100).toFixed(1) : 0;
  const isBetter = difference < 0;

  if (!monthlyKWh || monthlyKWh === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-xl sm:rounded-2xl shadow-xl border p-4 sm:p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      } hover:shadow-2xl`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div
          className={`p-2 sm:p-3 rounded-xl ${
            darkMode ? "bg-orange-500/20" : "bg-orange-100"
          }`}
        >
          <Users className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-orange-400" : "text-orange-600"}`} />
        </div>
        <div>
          <h2
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            City Comparison
          </h2>
          <p
            className={`text-xs sm:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Your usage vs {city} average
          </p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div
            className={`p-3 sm:p-4 rounded-lg ${
              darkMode
                ? "bg-blue-900/20 border border-blue-500/30"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Usage</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 break-words">
              {monthlyKWh.toFixed(0)} kWh
            </p>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-lg ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{city} Average</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300 break-words">
              {cityAverage} kWh
            </p>
          </div>
        </div>

        <div
          className={`p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 ${
            isBetter
              ? darkMode
                ? "bg-green-900/20 border border-green-500/30"
                : "bg-green-50 border border-green-200"
              : darkMode
              ? "bg-orange-900/20 border border-orange-500/30"
              : "bg-orange-50 border border-orange-200"
          }`}
        >
          <div className="flex-shrink-0">
            {isBetter ? (
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm sm:text-base font-bold ${
                isBetter
                  ? "text-green-700 dark:text-green-400"
                  : "text-orange-700 dark:text-orange-400"
              }`}
            >
              {isBetter ? "Lower" : "Higher"} than average by {Math.abs(percentageDiff)}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {isBetter
                ? `You're saving Rs ${(Math.abs(difference) * 55).toFixed(0)}/month more than average!`
                : `You can save Rs ${(Math.abs(difference) * 55).toFixed(0)}/month by optimizing`}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Usage Comparison</span>
            <span className="text-xs font-semibold">
              {isBetter ? "👍 Better" : "💡 Room for improvement"}
            </span>
          </div>
          <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-blue-600 rounded-full"
              style={{
                width: `${Math.min((monthlyKWh / cityAverage) * 50, 100)}%`,
              }}
            />
            <div
              className="absolute h-full bg-gray-400 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800"
              style={{
                left: "50%",
                width: "2px",
              }}
            />
            <div
              className="absolute h-full bg-green-600 rounded-full opacity-30"
              style={{
                width: "50%",
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-600 dark:text-gray-400">
            <span>Your usage</span>
            <span>City average</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkComparison;
