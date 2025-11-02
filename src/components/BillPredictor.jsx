import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, Zap } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ApexCharts from "react-apexcharts";

const BillPredictor = ({ historicalBills = [] }) => {
  const { darkMode } = useTheme();
  const [predictedBill, setPredictedBill] = useState(null);
  const [predictionConfidence, setPredictionConfidence] = useState(null);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    if (historicalBills.length >= 2) {
      calculatePrediction();
    }
  }, [historicalBills]);

  const calculatePrediction = () => {
    // Simple linear regression for prediction
    const bills = historicalBills.map((b) => parseFloat(b.amount)).reverse();
    const months = bills.map((_, i) => i + 1);

    // Calculate average
    const avgBill = bills.reduce((sum, b) => sum + b, 0) / bills.length;

    // Calculate trend (slope)
    const n = bills.length;
    const sumX = months.reduce((sum, x) => sum + x, 0);
    const sumY = bills.reduce((sum, y) => sum + y, 0);
    const sumXY = months.reduce((sum, x, i) => sum + x * bills[i], 0);
    const sumXX = months.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict next month
    const nextMonth = months.length + 1;
    const predicted = Math.max(0, slope * nextMonth + intercept);
    setPredictedBill(predicted.toFixed(2));

    // Calculate confidence based on data consistency
    const variance =
      bills.reduce((sum, b) => sum + Math.pow(b - avgBill, 2), 0) / bills.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgBill;
    const confidence = Math.max(
      50,
      Math.min(95, 100 - coefficientOfVariation * 50)
    );
    setPredictionConfidence(confidence.toFixed(0));

    // Determine trend
    if (slope > 0.05 * avgBill) {
      setTrend("increasing");
    } else if (slope < -0.05 * avgBill) {
      setTrend("decreasing");
    } else {
      setTrend("stable");
    }
  };

  // Generate sample data if none provided (for demo)
  const displayBills =
    historicalBills.length > 0
      ? historicalBills
      : [
          { month: "Jan", amount: "8500", units: 420 },
          { month: "Feb", amount: "9200", units: 450 },
          { month: "Mar", amount: "10800", units: 520 },
          { month: "Apr", amount: "11200", units: 540 },
          { month: "May", amount: "12500", units: 600 },
          { month: "Jun", amount: "11800", units: 570 },
        ];

  const chartData = displayBills.map((b) => parseFloat(b.amount));
  const chartLabels = displayBills.map((b) => b.month || b.monthName);

  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      foreColor: darkMode ? "#cbd5e1" : "#4b5563",
      sparkline: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    colors: ["#22c55e"],
    xaxis: {
      categories: chartLabels,
      labels: {
        style: {
          colors: darkMode ? "#9ca3af" : "#6b7280",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `Rs ${val.toLocaleString()}`,
        style: {
          colors: darkMode ? "#9ca3af" : "#6b7280",
        },
      },
    },
    grid: {
      borderColor: darkMode ? "#374151" : "#e5e7eb",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: darkMode ? "dark" : "light",
      y: {
        formatter: (val) => `Rs ${val.toLocaleString()}`,
      },
    },
  };

  const predictedValue = predictedBill || "12,450";
  const confidenceValue = predictionConfidence || "78";

  return (
    <div
      className={`rounded-xl sm:rounded-2xl shadow-xl border transition-all duration-300 p-4 sm:p-6 ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      } hover:shadow-2xl`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`p-2 sm:p-3 rounded-xl ${
              darkMode ? "bg-green-500/20" : "bg-green-100"
            }`}
          >
            <Zap
              className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-green-400" : "text-green-600"}`}
            />
          </div>
          <div>
            <h2
              className={`text-xl sm:text-2xl font-bold ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Bill Predictor
            </h2>
            <p
              className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Next month's bill forecast
            </p>
          </div>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              trend === "increasing"
                ? darkMode
                  ? "bg-red-500/20 text-red-400"
                  : "bg-red-50 text-red-600"
                : trend === "decreasing"
                ? darkMode
                  ? "bg-green-500/20 text-green-400"
                  : "bg-green-50 text-green-600"
                : darkMode
                ? "bg-blue-500/20 text-blue-400"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {trend === "increasing" ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend === "decreasing" ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span className="text-xs font-semibold capitalize">{trend}</span>
          </div>
        )}
      </div>

      <div
        className={`rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 ${
          darkMode
            ? "bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20"
            : "bg-gradient-to-br from-green-50 to-blue-50 border border-green-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Predicted Next Bill
            </p>
            <p
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              Rs {predictedValue.toLocaleString()}
            </p>
            <p
              className={`text-xs mt-2 ${
                darkMode ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Confidence: {confidenceValue}%
            </p>
          </div>
          <div
            className={`p-4 rounded-xl ${
              darkMode ? "bg-green-500/20" : "bg-green-100"
            }`}
          >
            <DollarSign
              className={`w-8 h-8 ${darkMode ? "text-green-400" : "text-green-600"}`}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3
          className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Historical Trend
        </h3>
        {chartData.length > 0 && (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <ApexCharts
              options={chartOptions}
              series={[{ name: "Bill Amount", data: chartData }]}
              type="area"
              height={200}
              width="100%"
              className="min-w-full"
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3
          className={`text-lg font-semibold mb-3 ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Recent Bills
        </h3>
        <div className="space-y-2">
          {displayBills.slice(-6).map((bill, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <span
                className={`font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {bill.month || bill.monthName || `Bill ${idx + 1}`}
              </span>
              <span
                className={`font-bold ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                Rs {parseFloat(bill.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {historicalBills.length === 0 && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            darkMode ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-yellow-50 border border-yellow-200"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-yellow-400" : "text-yellow-700"
            }`}
          >
            💡 Tip: Upload your bills using the Bill Reader to get accurate predictions!
          </p>
        </div>
      )}
    </div>
  );
};

export default BillPredictor;

