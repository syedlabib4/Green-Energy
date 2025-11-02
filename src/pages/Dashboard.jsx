import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import StatsCard from "../components/StatsCard";
import Sidebar from "../components/Sidebar";
import WeatherCard from "../components/WeatherCard";
import { Trash2, Zap, TrendingUp, DollarSign, Leaf, BarChart3, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { success, error } = useToast();

  const [appliances, setAppliances] = useState(() => {
    try {
      const saved = localStorage.getItem("appliances");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error loading appliances:", err);
      return [];
    }
  });
  const [form, setForm] = useState({ name: "", wattage: "", hours: "" });
  const [historicalBills, setHistoricalBills] = useState(() => {
    try {
      const saved = localStorage.getItem("historicalBills");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error loading bills:", err);
      return [];
    }
  });

  // Save appliances to localStorage
  useEffect(() => {
    localStorage.setItem("appliances", JSON.stringify(appliances));
  }, [appliances]);

  // Save historical bills to localStorage
  useEffect(() => {
    localStorage.setItem("historicalBills", JSON.stringify(historicalBills));
  }, [historicalBills]);


  if (!user) return null;

  // ⚡ Appliance management
  const handleAdd = useCallback(() => {
    const { name, wattage, hours } = form;
    const watt = parseFloat(wattage);
    const hrs = parseFloat(hours);

    if (!name || !name.trim()) {
      error("Please enter an appliance name");
      return;
    }

    if (isNaN(watt) || watt <= 0 || watt > 100000) {
      error("Please enter a valid wattage (1-100,000W)");
      return;
    }

    if (isNaN(hrs) || hrs <= 0 || hrs > 24) {
      error("Please enter valid hours per day (1-24)");
      return;
    }

    const energy = ((watt * hrs) / 1000).toFixed(2);
    const newAppliance = {
      id: Date.now(),
      name: name.trim(),
      wattage: watt,
      hours: hrs,
      energy: parseFloat(energy),
    };

    setAppliances((prev) => [...prev, newAppliance]);
    setForm({ name: "", wattage: "", hours: "" });
    success(`${name} added successfully!`);
  }, [form, success, error]);

  const handleDelete = useCallback((id) => {
    const appliance = appliances.find(a => a.id === id);
    setAppliances((prev) => prev.filter((a) => a.id !== id));
    if (appliance) {
      success(`${appliance.name} removed`);
    }
  }, [appliances, success]);

  // Memoized calculations for performance
  const { totalWatts, dailyEnergyWh, totalKWh, monthlyKWh, estimatedBill } = useMemo(() => {
    const totalWatts = appliances.reduce((sum, a) => sum + (parseFloat(a.wattage) || 0), 0);
    const dailyEnergyWh = appliances.reduce(
      (sum, a) => sum + (parseFloat(a.wattage) || 0) * (parseFloat(a.hours) || 0),
      0
    );
    const totalKWh = dailyEnergyWh / 1000;
    const monthlyKWh = totalKWh * 30;
    
    // Pakistan electricity tariff calculation (2024 rates)
    // Tiered pricing structure for residential consumers
    const calculatePakistaniBill = (kWh) => {
      let bill = 0;
      if (kWh <= 100) {
        bill = kWh * 18; // Base tier
      } else if (kWh <= 300) {
        bill = 100 * 18 + (kWh - 100) * 20; // Second tier
      } else {
        bill = 100 * 18 + 200 * 20 + (kWh - 300) * 30; // Higher tier
      }
      // Add taxes: 17% GST + fixed charges
      bill = bill + (bill * 0.17) + 1550; // Rs 1550 fixed charges
      return bill.toFixed(2);
    };

    const estimatedBill = calculatePakistaniBill(monthlyKWh);
    
    return { totalWatts, dailyEnergyWh, totalKWh, monthlyKWh, estimatedBill };
  }, [appliances]);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar />
      <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto flex flex-col relative ml-0 md:ml-56 lg:ml-64" data-navbar-spacing>
        <div className="grid grid-cols-1 min-[375px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatsCard
            label="Load"
            value={`${totalWatts.toLocaleString()}W`}
            subvalue={`${(totalWatts / 1000).toFixed(1)}kW equivalent`}
            icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
          />
          <StatsCard
            label="Monthly"
            value={`${monthlyKWh.toFixed(0)}kWh`}
            subvalue={`Rs ${parseFloat(estimatedBill).toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />}
          />
          <StatsCard
            label="Daily"
            value={`${totalKWh > 0 ? totalKWh.toFixed(1) : '0.0'}kWh`}
            subvalue={`${dailyEnergyWh.toLocaleString()}Wh`}
            icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
          />
          <StatsCard
            label="CO₂ Emissions"
            value={`${Math.round(totalKWh * 0.84 * 30)}kg`}
            subvalue={`${(totalKWh * 0.84 * 30 / 1000).toFixed(1)} tonnes/year`}
            icon={<Leaf className="w-5 h-5 sm:w-6 sm:h-6" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 flex-1 overflow-y-auto min-h-0">
          <div className={`p-2 sm:p-3 rounded-lg shadow border ${darkMode ? "bg-gray-900/50 border-gray-700" : "bg-white/50 border-gray-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Weather</span>
              <WeatherCard />
            </div>
            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Appliances</span>
                <span className="font-bold">{appliances.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Bill</span>
                <span className="font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-cyan-300">Rs {estimatedBill}</span>
              </div>
              <Link to="/analytics" className="text-xs bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-cyan-300 hover:underline flex items-center gap-1 mt-1 font-semibold">
                Analytics <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className={`p-2 sm:p-3 rounded-lg shadow-lg border transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-emerald-900/30 via-cyan-900/20 to-emerald-900/30 border-emerald-500/40 shadow-emerald-500/20" : "bg-gradient-to-br from-emerald-50 via-cyan-50/50 to-emerald-50 border-emerald-300/60 shadow-emerald-500/10"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Impact</span>
              <Leaf className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Savings</p>
                <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-cyan-300">
                  Rs {((monthlyKWh * 0.3) * 55).toFixed(0)}/mo
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Carbon</p>
                <p className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-cyan-300">
                  {((monthlyKWh * 0.3 * 0.84 * 12) / 20).toFixed(0)} trees/yr
                </p>
              </div>
              <Link to="/impact" className="text-xs bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-300 dark:to-cyan-300 hover:underline flex items-center gap-1 mt-1 font-semibold">
                Details <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className={`p-2 sm:p-3 rounded-lg shadow border ${darkMode ? "bg-gray-900/50 border-gray-700" : "bg-white/50 border-gray-200"}`}>
            <h3 className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/solar-checker"
                className={`p-2 rounded-lg text-xs text-center font-medium transition ${
                  darkMode
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/30"
                    : "bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 hover:from-emerald-200 hover:to-cyan-200 border border-emerald-300/50"
                }`}
              >
                ☀️ Solar
              </Link>
              <Link
                to="/bill-reader"
                className={`p-2 rounded-lg text-xs text-center font-medium transition ${
                  darkMode
                    ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                📷 Bill
              </Link>
              <Link
                to="/tips"
                className={`p-2 rounded-lg text-xs text-center font-medium transition ${
                  darkMode
                    ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
              >
                💡 Tips
              </Link>
              <Link
                to="/ai-advisor"
                className={`p-2 rounded-lg text-xs text-center font-medium transition ${
                  darkMode
                    ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                🤖 AI
              </Link>
            </div>
          </div>
        </div>

        <section
          className={`rounded-lg shadow border p-3 sm:p-4 lg:p-5 transition-all ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
            <h2 className={`text-base sm:text-lg font-bold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            Add Appliance
          </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="Appliance Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className={`border rounded-lg p-3 sm:p-2.5 text-sm sm:text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px] transition-all duration-200 ${
                darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-gray-50 border-gray-300"
              }`}
            />
            <input
              type="number"
              placeholder="Wattage (W)"
              value={form.wattage}
              onChange={(e) => setForm({ ...form, wattage: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className={`border rounded-lg p-3 sm:p-2.5 text-sm sm:text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px] transition-all duration-200 ${
                darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-gray-50 border-gray-300"
              }`}
            />
            <input
              type="number"
              placeholder="Hours per day"
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className={`border rounded-lg p-3 sm:p-2.5 text-sm sm:text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px] transition-all duration-200 ${
                darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-gray-50 border-gray-300"
              }`}
            />
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-emerald-500 text-white rounded-lg text-sm sm:text-xs font-semibold px-4 sm:px-3 py-3 sm:py-2.5 transition-all duration-300 shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50 min-h-[44px] flex items-center justify-center"
            >
              Add
            </button>
          </div>

          {appliances.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {appliances.slice(0, 6).map((appliance) => (
                  <div
                    key={appliance.id}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-gray-300"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="font-medium truncate max-w-[80px] sm:max-w-[100px]">{appliance.name}</span>
                    <span className="text-gray-500">{appliance.wattage}W</span>
                    <button
                      onClick={() => handleDelete(appliance.id)}
                      className="ml-1 p-1 text-red-500 hover:text-red-600 rounded min-w-[32px] min-h-[32px] flex items-center justify-center"
                      aria-label={`Delete ${appliance.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              {appliances.length > 6 && (
                <p className="text-xs text-center text-gray-500 mt-1">
                  +{appliances.length - 6} more
                </p>
              )}
            </div>
          )}
        </section>

      
      </main>
    </div>
  );
};

export default Dashboard;
