import { cn } from "../utils/cn";
import { useTheme } from "../contexts/ThemeContext";

const StatsCard = ({ icon, label, value, subvalue, className }) => {
  const { darkMode } = useTheme();
  
  return (
    <div 
      className={cn(
        "flex flex-col items-start p-2 sm:p-2.5 rounded-lg transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02]",
        darkMode 
          ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-emerald-500/20 backdrop-blur-sm shadow-md shadow-emerald-500/10" 
          : "bg-gradient-to-br from-white via-emerald-50/30 to-cyan-50/30 border border-emerald-200/60 shadow-sm",
        className
      )}
    >
      {/* Icon */}
      <div 
        className={cn(
          "w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center mb-1.5",
          "transition-all duration-300",
          darkMode 
            ? "bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 text-emerald-300" 
            : "bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-600"
        )}
      >
        <span className="text-xs sm:text-sm">{icon}</span>
      </div>

      {/* Label */}
      <p 
        className={cn(
          "text-[10px] sm:text-xs font-medium mb-1 uppercase tracking-wide",
          darkMode ? "text-gray-400" : "text-gray-500"
        )}
      >
        {label}
      </p>

      {/* Primary Value */}
      <p 
        className={cn(
          "text-sm sm:text-base md:text-lg font-bold mb-0.5 leading-tight break-words",
          "bg-gradient-to-r bg-clip-text",
          darkMode 
            ? "text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300" 
            : "text-transparent bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600"
        )}
      >
        {value}
      </p>

      {/* Secondary Value */}
      {subvalue && (
        <p 
          className={cn(
            "text-[9px] sm:text-[10px] font-medium",
            darkMode ? "text-gray-400" : "text-gray-600"
          )}
        >
          {subvalue}
        </p>
      )}
    </div>
  );
};

export default StatsCard;

