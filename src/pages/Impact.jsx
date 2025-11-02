import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../contexts/ThemeContext";
import LoadSheddingImpact from "../components/LoadSheddingImpact";
import CarbonOffset from "../components/CarbonOffset";
import ImpactDashboard from "../components/ImpactDashboard";
import GovernmentSubsidy from "../components/GovernmentSubsidy";
import BenchmarkComparison from "../components/BenchmarkComparison";
import ExportData from "../components/ExportData";

const Impact = () => {
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

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 sm:gap-6 pt-16 md:pt-20 ml-0 md:ml-56 lg:ml-64">
        <div className="mb-4 sm:mb-6">
          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${
              darkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            🌍 Environmental Impact
          </h1>
          <p
            className={`text-sm sm:text-base lg:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Track your carbon footprint and measure real-world impact
          </p>
        </div>

        <ImpactDashboard
          appliances={appliances}
          monthlyKWh={monthlyKWh}
          historicalBills={historicalBills}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <LoadSheddingImpact monthlyKWh={monthlyKWh} />

          <CarbonOffset monthlyKWh={monthlyKWh} appliances={appliances} />
        </div>

        {monthlyKWh > 0 && (
          <GovernmentSubsidy systemSizeKW={monthlyKWh / 150} />
        )}

        {monthlyKWh > 0 && (
          <BenchmarkComparison monthlyKWh={monthlyKWh} city="Karachi" />
        )}

        <ExportData
          appliances={appliances}
          bills={historicalBills}
          metrics={{
            monthlyKWh,
            estimatedBill: (monthlyKWh * 55 + 1550).toFixed(2),
            potentialSavings: (monthlyKWh * 0.3).toFixed(1),
            carbonFootprint: (monthlyKWh * 0.84 * 30).toFixed(0),
          }}
        />
      </main>
    </div>
  );
};

export default Impact;
