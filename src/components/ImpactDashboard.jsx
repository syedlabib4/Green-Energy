import { useMemo } from "react";
import { Target, TrendingUp, DollarSign, Leaf } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ImpactDashboard = ({
  appliances = [],
  monthlyKWh = 0,
  historicalBills = [],
}) => {
  const { darkMode } = useTheme();

  const impactMetrics = useMemo(() => {
    if (!monthlyKWh || monthlyKWh === 0) return null;

    // Calculate savings if switching to efficient appliances (30% reduction)
    const potentialSavings = monthlyKWh * 0.3;
    const yearlySavings = potentialSavings * 12;
    const savingsInRs = yearlySavings * 55; // Rs 55 per kWh

    // Carbon savings
    const carbonFactor = 0.84; // kg CO2 per kWh
    const carbonSaved = yearlySavings * carbonFactor;

    // Total lifetime savings (10 years)
    const lifetimeSavings = savingsInRs * 10;

    // Average bill reduction
    const currentMonthlyBill = monthlyKWh * 55 + 1550;
    const potentialMonthlyBill = (monthlyKWh - potentialSavings) * 55 + 1550;
    const monthlyReduction = currentMonthlyBill - potentialMonthlyBill;

    // Trees equivalent
    const treesEquivalent = Math.ceil(carbonSaved / 20); // 1 tree ≈ 20 kg CO2/year

    return {
      potentialSavings: potentialSavings.toFixed(1),
      yearlySavings: yearlySavings.toFixed(1),
      savingsInRs: savingsInRs.toFixed(0),
      carbonSaved: carbonSaved.toFixed(2),
      lifetimeSavings: lifetimeSavings.toFixed(0),
      monthlyReduction: monthlyReduction.toFixed(0),
      treesEquivalent,
    };
  }, [monthlyKWh]);

  // Calculate total historical savings if bills show improvement
  const billTrend = useMemo(() => {
    if (historicalBills.length < 2) return null;

    const bills = historicalBills
      .map((b) => parseFloat(b.amount))
      .filter((b) => !isNaN(b))
      .slice(-6); // Last 6 months

    if (bills.length < 2) return null;

    const latest = bills[bills.length - 1];
    const previous = bills[0];
    const reduction = latest - previous;
    const reductionPercent = ((reduction / previous) * 100).toFixed(1);

    return {
      reduction: Math.abs(reduction).toFixed(0),
      reductionPercent: Math.abs(reductionPercent),
      isPositive: reduction < 0,
    };
  }, [historicalBills]);

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
          <Target className={`w-6 h-6 ${darkMode ? "text-green-400" : "text-green-600"}`} />
        </div>
        <div>
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Impact Dashboard
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Your green energy journey impact
          </p>
        </div>
      </div>

      {impactMetrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div
            className={`p-5 rounded-xl ${
              darkMode
                ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
                : "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <p
                className={`font-bold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Energy Savings Potential
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
              {impactMetrics.potentialSavings} kWh/month
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {impactMetrics.yearlySavings} kWh/year with efficient appliances
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
              <DollarSign className="w-5 h-5 text-blue-500" />
              <p
                className={`font-bold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Financial Impact
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
              Rs {parseFloat(impactMetrics.savingsInRs).toLocaleString()}/year
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Rs {parseFloat(impactMetrics.lifetimeSavings).toLocaleString()} over 10 years
            </p>
            <p className="text-xs mt-2 text-green-600 dark:text-green-400 font-semibold">
              Save Rs {impactMetrics.monthlyReduction}/month
            </p>
          </div>

          <div
            className={`p-5 rounded-xl ${
              darkMode
                ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                : "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-purple-500" />
              <p
                className={`font-bold ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Environmental Impact
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
              {impactMetrics.carbonSaved} kg CO₂/year
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Equivalent to planting {impactMetrics.treesEquivalent} trees
            </p>
          </div>

          <div
            className={`p-5 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <p
              className={`font-bold mb-3 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Your Progress
            </p>
            {billTrend ? (
              <div>
                <p
                  className={`text-2xl font-bold mb-2 ${
                    billTrend.isPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {billTrend.isPositive ? "↓" : "↑"} Rs{" "}
                  {parseFloat(billTrend.reduction).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {billTrend.reductionPercent}%{" "}
                  {billTrend.isPositive ? "reduction" : "increase"} in bills
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload bills to track your progress
              </p>
            )}
            <div className="mt-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Appliances Tracked
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((appliances.length / 10) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {appliances.length} / 10+ appliances
              </p>
            </div>
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
            Add appliances and track bills to see your impact
          </p>
        </div>
      )}
    </div>
  );
};

export default ImpactDashboard;

