import { useState } from "react";
import Sidebar from "../components/Sidebar";
import BillReader from "../components/BillReader";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

const BillReaderPage = () => {
  const { darkMode } = useTheme();
  const [billData, setBillData] = useState(null);

  const handleExtract = (data) => {
    setBillData(data);
    console.log("Extracted Bill Data:", data);
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 pt-16 md:pt-20 ml-0 md:ml-56 lg:ml-64">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${darkMode ? "text-green-400" : "text-green-600"}`}>
          📷 AI Bill Reader
        </h1>
        <p className={`text-sm mb-4 sm:mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Upload your K-Electric or other Pakistani utility bill image for automatic data extraction
        </p>

        <div
          className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <BillReader onExtract={handleExtract} />

          {billData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 sm:p-6 rounded-xl shadow-lg border ${
                darkMode
                  ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30"
                  : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className={`text-xl font-bold flex items-center gap-2 ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  <span>🔍</span> Extracted Bill Details
                </h2>
                {billData.confidence && (
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    billData.confidence >= 70
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : billData.confidence >= 40
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}>
                    {billData.confidence}% Confidence
                  </div>
                )}
              </div>

              {/* Primary Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                {billData.units && (
                  <div
                    className={`p-3 sm:p-4 rounded-lg ${
                      darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200"
                    }`}
                  >
                    <p
                      className={`text-xs sm:text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Units Consumed
                    </p>
                    <p
                      className={`text-xl sm:text-2xl font-bold break-words ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {billData.units.toLocaleString()} kWh
                    </p>
                  </div>
                )}
                {billData.amount && (
                  <div
                    className={`p-3 sm:p-4 rounded-lg ${
                      darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200"
                    }`}
                  >
                    <p
                      className={`text-xs sm:text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Bill Amount
                    </p>
                    <p
                      className={`text-xl sm:text-2xl font-bold break-words ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      Rs {billData.amount.toLocaleString()}
                    </p>
                  </div>
                )}
                {billData.billNumber && (
                  <div
                    className={`p-3 sm:p-4 rounded-lg ${
                      darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200"
                    }`}
                  >
                    <p
                      className={`text-xs sm:text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Bill Number
                    </p>
                    <p
                      className={`text-lg sm:text-xl font-bold break-words ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {billData.billNumber}
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              {(billData.customerId || billData.customerName || billData.billingPeriod || 
                billData.dueDate || billData.previousReading || billData.currentReading || billData.tariff) && (
                <details className={`mt-4 rounded-lg p-4 ${
                  darkMode ? "bg-gray-800/30 border border-gray-700" : "bg-white/50 border border-gray-200"
                }`}>
                  <summary
                    className={`text-sm font-semibold cursor-pointer mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Additional Details
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {billData.customerId && (
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Customer ID
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          {billData.customerId}
                        </p>
                      </div>
                    )}
                    {billData.customerName && (
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Customer Name
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          {billData.customerName}
                        </p>
                      </div>
                    )}
                    {billData.billingPeriod && (
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Billing Period
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          {billData.billingPeriod}
                        </p>
                      </div>
                    )}
                    {billData.dueDate && (
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Due Date
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          {billData.dueDate}
                        </p>
                      </div>
                    )}
                    {billData.previousReading && (
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Previous Reading
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          {billData.previousReading.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {billData.currentReading && (
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Current Reading
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          {billData.currentReading.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {billData.tariff && (
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Tariff / Category
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          {billData.tariff}
                        </p>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BillReaderPage;
