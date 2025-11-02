import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  Calendar,
  BarChart3,
  Lightbulb,
  Zap,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ApexCharts from "react-apexcharts";

const SmartInsights = ({ appliances = [], historicalData = [] }) => {
  const { darkMode } = useTheme();
  const [insights, setInsights] = useState([]);
  const [peakMonth, setPeakMonth] = useState(null);
  const [averageUsage, setAverageUsage] = useState(0);
  const [trend, setTrend] = useState("stable");

  // Calculate insights from appliances
  const totalWatts = useMemo(() => {
    return appliances.reduce((sum, a) => sum + (parseFloat(a.wattage) || 0), 0);
  }, [appliances]);

  const dailyEnergyWh = useMemo(() => {
    return appliances.reduce(
      (sum, a) => sum + (parseFloat(a.wattage) || 0) * (parseFloat(a.hours) || 0),
      0
    );
  }, [appliances]);

  const monthlyEnergyWh = dailyEnergyWh * 30;
  const monthlyEnergyKWh = monthlyEnergyWh / 1000;

  useEffect(() => {
    calculateInsights();
  }, [appliances, historicalData]);

  const calculateInsights = () => {
    const newInsights = [];

    // Average Usage Insight
    if (historicalData.length > 0) {
      const avg = historicalData.reduce((sum, d) => sum + parseFloat(d.units || 0), 0) / historicalData.length;
      setAverageUsage(avg);

      // Find peak month
      const monthlyData = {};
      historicalData.forEach((d) => {
        const month = d.month || d.monthName || "Unknown";
        if (!monthlyData[month]) monthlyData[month] = 0;
        monthlyData[month] += parseFloat(d.units || 0);
      });

      const peak = Object.entries(monthlyData).reduce((max, [month, value]) =>
        value > max.value ? { month, value } : max,
        { month: "Unknown", value: 0 }
      );
      setPeakMonth(peak);

      // Calculate trend
      if (historicalData.length >= 3) {
        const recent = historicalData
          .slice(-3)
          .map((d) => parseFloat(d.units || 0));
        const older = historicalData
          .slice(-6, -3)
          .map((d) => parseFloat(d.units || 0));
        if (older.length > 0) {
          const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
          const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
          const change = ((recentAvg - olderAvg) / olderAvg) * 100;
          if (change > 5) setTrend("increasing");
          else if (change < -5) setTrend("decreasing");
          else setTrend("stable");
        }
      }
    } else {
      // Use current appliances data
      setAverageUsage(monthlyEnergyKWh);
    }

    // High consumption appliance insight
    if (appliances.length > 0) {
      const highest = appliances.reduce((max, a) =>
        (parseFloat(a.wattage) || 0) * (parseFloat(a.hours) || 0) >
        (parseFloat(max.wattage) || 0) * (parseFloat(max.hours) || 0)
          ? a
          : max,
        appliances[0]
      );
      const highestEnergy = (parseFloat(highest.wattage) || 0) * (parseFloat(highest.hours) || 0) / 1000;
      if (highestEnergy > 2) {
        newInsights.push({
          type: "warning",
          icon: <AlertCircle className="w-5 h-5" />,
          title: "High Energy Consumer",
          message: `${highest.name} uses ${highestEnergy.toFixed(2)} kWh/day. Consider energy-efficient alternatives.`,
        });
      }
    }

    // Savings opportunity insight
    if (appliances.length > 0) {
      const totalDaily = appliances.reduce(
        (sum, a) => sum + (parseFloat(a.wattage) || 0) * (parseFloat(a.hours) || 0),
        0
      );
      const monthlyCost = (totalDaily / 1000) * 30 * 55;
      if (monthlyCost > 10000) {
        newInsights.push({
          type: "info",
          icon: <Lightbulb className="w-5 h-5" />,
          title: "Savings Opportunity",
          message: `You could save up to 30% (Rs ${(monthlyCost * 0.3).toFixed(0)}) by switching to energy-efficient appliances.`,
        });
      }
    }

    // Trend insight
    if (trend !== "stable") {
      newInsights.push({
        type: trend === "increasing" ? "warning" : "success",
        icon: <TrendingUp className="w-5 h-5" />,
        title: `Energy Usage ${trend === "increasing" ? "Increasing" : "Decreasing"}`,
        message: `Your energy usage is ${trend === "increasing" ? "trending upward" : "trending downward"}. ${
          trend === "increasing" ? "Consider optimizing your usage." : "Great job on reducing consumption!"
        }`,
      });
    }

    setInsights(newInsights);
  };

  // Prepare chart data
  const chartData = historicalData.length > 0
    ? historicalData.map((d) => parseFloat(d.units || 0))
    : [monthlyEnergyKWh];

  const chartLabels = historicalData.length > 0
    ? historicalData.map((d) => d.month || d.monthName || "Month")
    : ["Current"];

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: darkMode ? "#cbd5e1" : "#4b5563",
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)} kWh`,
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
        formatter: (val) => `${val} kWh`,
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
        formatter: (val) => `${val.toFixed(2)} kWh`,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
      },
    },
  };

  return (
    <div
      className={`rounded-xl sm:rounded-2xl shadow-xl border transition-all duration-300 p-4 sm:p-6 ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      } hover:shadow-2xl`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div
          className={`p-2 sm:p-3 rounded-xl ${
            darkMode ? "bg-blue-500/20" : "bg-blue-100"
          }`}
        >
          <BarChart3
            className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
          />
        </div>
        <div>
          <h2
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Smart Insights
          </h2>
          <p
            className={`text-xs sm:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Energy trends and analytics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div
          className={`rounded-xl p-4 ${
            darkMode
              ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
              : "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className={`w-4 h-4 ${darkMode ? "text-green-400" : "text-green-600"}`} />
            <p
              className={`text-xs font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Average Usage
            </p>
          </div>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            {averageUsage.toFixed(1)} kWh
          </p>
          <p
            className={`text-xs mt-1 ${
              darkMode ? "text-gray-500" : "text-gray-600"
            }`}
          >
            Per month
          </p>
        </div>

        <div
          className={`rounded-xl p-4 ${
            darkMode
              ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
              : "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
            <p
              className={`text-xs font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Peak Month
            </p>
          </div>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            {peakMonth?.month || "N/A"}
          </p>
          <p
            className={`text-xs mt-1 ${
              darkMode ? "text-gray-500" : "text-gray-600"
            }`}
          >
            {peakMonth?.value ? `${peakMonth.value.toFixed(1)} kWh` : "No data"}
          </p>
        </div>

        <div
          className={`rounded-xl p-4 ${
            darkMode
              ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
              : "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-4 h-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
            <p
              className={`text-xs font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Load
            </p>
          </div>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-purple-400" : "text-purple-600"
            }`}
          >
            {totalWatts.toLocaleString()} W
          </p>
          <p
            className={`text-xs mt-1 ${
              darkMode ? "text-gray-500" : "text-gray-600"
            }`}
          >
            {totalWatts.toLocaleString()} W total
          </p>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <h3
          className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Energy Usage Trend
        </h3>
        {chartData.length > 0 && (
          <div className="overflow-x-auto">
            <ApexCharts
              options={chartOptions}
              series={[{ name: "Energy (kWh)", data: chartData }]}
              type="bar"
              height={300}
              className="min-w-full"
            />
          </div>
        )}
      </div>

      {insights.length > 0 && (
        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Key Insights
          </h3>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-4 rounded-xl ${
                  insight.type === "warning"
                    ? darkMode
                      ? "bg-red-500/10 border border-red-500/20"
                      : "bg-red-50 border border-red-200"
                    : insight.type === "success"
                    ? darkMode
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-green-50 border border-green-200"
                    : darkMode
                    ? "bg-blue-500/10 border border-blue-500/20"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <div
                  className={`mt-0.5 ${
                    insight.type === "warning"
                      ? darkMode
                        ? "text-red-400"
                        : "text-red-600"
                      : insight.type === "success"
                      ? darkMode
                        ? "text-green-400"
                        : "text-green-600"
                      : darkMode
                      ? "text-blue-400"
                      : "text-blue-600"
                  }`}
                >
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold mb-1 ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {insight.title}
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {insight.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.length === 0 && (
        <div
          className={`p-4 rounded-lg text-center ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Add appliances and upload bills to get personalized insights!
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartInsights;

