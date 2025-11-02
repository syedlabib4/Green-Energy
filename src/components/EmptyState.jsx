import { Zap, Plus, TrendingUp, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export const EmptyAppliances = () => {
  const { darkMode } = useTheme();
  return (
    <div
      className={`p-6 rounded-xl text-center ${
        darkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
      }`}
    >
      <Zap className="w-12 h-12 mx-auto mb-3 text-gray-400" />
      <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
        No Appliances Added Yet
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Start tracking your energy consumption by adding your first appliance
      </p>
      <button
        onClick={() => document.getElementById("appliance-form")?.scrollIntoView({ behavior: "smooth" })}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
      >
        <Plus className="w-4 h-4" />
        Add Your First Appliance
      </button>
    </div>
  );
};

export const EmptyBills = () => {
  const { darkMode } = useTheme();
  return (
    <div
      className={`p-6 rounded-xl text-center ${
        darkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
      }`}
    >
      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
      <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
        No Bills Tracked Yet
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Upload your electricity bills to enable bill prediction and insights
      </p>
      <Link
        to="/bill-reader"
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
      >
        <FileText className="w-4 h-4" />
        Upload Your First Bill
      </Link>
    </div>
  );
};

export const EmptyAnalytics = () => {
  const { darkMode } = useTheme();
  return (
    <div
      className={`p-8 rounded-xl text-center ${
        darkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
      }`}
    >
      <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Start Tracking for Insights
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Add appliances and upload bills to unlock powerful analytics, predictions, and personalized recommendations
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Appliances
        </Link>
        <Link
          to="/bill-reader"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          <FileText className="w-4 h-4" />
          Upload Bills
        </Link>
      </div>
    </div>
  );
};
