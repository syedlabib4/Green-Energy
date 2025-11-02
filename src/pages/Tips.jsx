import Sidebar from "../components/Sidebar";
import { useTheme } from "../contexts/ThemeContext";
import PakistanEnergyTips from "../components/PakistanEnergyTips";

const Tips = () => {
  const { darkMode } = useTheme();

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
            💡 Energy Saving Tips
          </h1>
          <p
            className={`text-sm sm:text-base lg:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Practical, Pakistan-specific tips to reduce your energy bills
          </p>
        </div>

        <PakistanEnergyTips />
      </main>
    </div>
  );
};

export default Tips;

