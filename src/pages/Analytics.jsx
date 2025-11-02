import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../contexts/ThemeContext";
import BillPredictor from "../components/BillPredictor";
import SmartInsights from "../components/SmartInsights";
import SmartRecommender from "../components/SmartRecommender";
import BenchmarkComparison from "../components/BenchmarkComparison";
import ExportData from "../components/ExportData";
import { EmptyAnalytics } from "../components/EmptyState";
import ApexCharts from "react-apexcharts";

const Analytics = () => {
  const { darkMode } = useTheme();
  const [appliances, setAppliances] = useState([]);
  const [historicalBills, setHistoricalBills] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("appliances");
    if (saved) setAppliances(JSON.parse(saved));

    const savedBills = localStorage.getItem("historicalBills");
    if (savedBills) setHistoricalBills(JSON.parse(savedBills));
  }, []);

  const dailyEnergyWh = appliances.reduce(
    (sum, a) => sum + (parseFloat(a.wattage) || 0) * (parseFloat(a.hours) || 0),
    0
  );
  const totalKWh = dailyEnergyWh / 1000;
  const monthlyKWh = totalKWh * 30;

  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      foreColor: darkMode ? "#cbd5e1" : "#4b5563",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
      },
    },
    colors: ["#22c55e"],
    xaxis: {
      categories: appliances.map((a) => a.name),
      labels: {
        style: { colors: darkMode ? "#9ca3af" : "#6b7280" },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val} kWh`,
        style: { colors: darkMode ? "#9ca3af" : "#6b7280" },
      },
    },
    grid: {
      borderColor: darkMode ? "#374151" : "#e5e7eb",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: darkMode ? "dark" : "light",
      y: { formatter: (val) => `${val.toFixed(2)} kWh` },
    },
  };

  const chartSeries = [
    {
      name: "Daily Energy (kWh)",
      data: appliances.map((a) => parseFloat(a.energy) || 0),
    },
  ];

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 pt-16 md:pt-20 ml-0 md:ml-56 lg:ml-64">
        <div className="mb-4 sm:mb-6">
          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${
              darkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            📊 Analytics & Insights
          </h1>
          <p
            className={`text-sm sm:text-base lg:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Deep dive into your energy consumption patterns
          </p>
        </div>

        <BillPredictor historicalBills={historicalBills} />

        <SmartInsights appliances={appliances} historicalData={historicalBills} />

        {appliances.length > 0 && (
          <section
            className={`rounded-xl sm:rounded-2xl shadow-xl border p-4 sm:p-6 transition-all duration-300 ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <h2
              className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Detailed Energy Usage Chart
            </h2>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <ApexCharts
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={250}
                width="100%"
                className="min-w-full"
              />
            </div>
          </section>
        )}

        <SmartRecommender appliances={appliances} />

        {monthlyKWh > 0 && (
          <BenchmarkComparison monthlyKWh={monthlyKWh} city="Karachi" />
        )}

        <ExportData
          appliances={appliances}
          bills={historicalBills}
          metrics={{
            monthlyKWh,
            estimatedBill: ((monthlyKWh * 55 + 1550)).toFixed(2),
            potentialSavings: (monthlyKWh * 0.3).toFixed(1),
            carbonFootprint: (monthlyKWh * 0.84 * 30).toFixed(0),
          }}
        />
      </main>
    </div>
  );
};

export default Analytics;

