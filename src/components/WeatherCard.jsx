import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

// Dummy data for Karachi, Pakistan - realistic averages
const DUMMY_WEATHER = {
  temp: 32, // Average Karachi temperature
  humidity: 65, // Typical humidity
  wind: 12,
  condition: "Typical",
};

const WeatherCard = () => {
  const { darkMode } = useTheme();
  const [weather, setWeather] = useState(DUMMY_WEATHER); // Start with dummy data
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      // Timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 5000)
      );

      try {
        const apiKey = import.meta.env.VITE_TOMORROW_API_KEY;
        if (!apiKey) {
          console.warn("Weather API key not configured, using dummy data");
          setWeather(DUMMY_WEATHER);
          setLoading(false);
          return;
        }

        const url = `https://api.tomorrow.io/v4/weather/realtime?location=24.8607,67.0011&apikey=${apiKey}`;
        
        // Race between fetch and timeout
        const response = await Promise.race([
          fetch(url),
          timeoutPromise,
        ]);

        if (!response.ok) {
          throw new Error(`Weather fetch failed (status ${response.status})`);
        }
        
        const data = await response.json();

        // Safe access
        const values = data?.data?.values;
        if (!values || !values.temperature) {
          throw new Error("Unexpected weather response shape");
        }

        // Success - set live data
        setWeather({
          temp: values.temperature || DUMMY_WEATHER.temp,
          humidity: values.humidity || DUMMY_WEATHER.humidity,
          wind: values.windSpeed || DUMMY_WEATHER.wind,
          condition: values.weatherCode ? "Live" : "Typical",
        });
        setIsLive(true);
      } catch (err) {
        console.warn("Weather API unavailable, using dummy data:", err.message);
        // Use dummy data as fallback - UI stays good
        setWeather(DUMMY_WEATHER);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // Show compact loading for just 0.5s, then show dummy data immediately
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">⛅</span>
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-bold animate-pulse ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              --°C
            </span>
          </div>
          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate cooling needs for Pakistan climate
  const getCoolingAdvice = () => {
    const temp = weather.temp;
    if (temp > 35) return { icon: "☀️", advice: "High AC usage expected", energy: "High" };
    if (temp > 28) return { icon: "🌡️", advice: "Moderate cooling needed", energy: "Medium" };
    if (temp > 22) return { icon: "⛅", advice: "Fans sufficient", energy: "Low" };
    return { icon: "❄️", advice: "Minimal cooling needed", energy: "Very Low" };
  };

  const cooling = getCoolingAdvice();
  const valueCls = darkMode ? "text-white" : "text-gray-900";
  const subCls = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{cooling.icon}</span>
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-bold ${valueCls}`}>{Math.round(weather.temp)}°C</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            cooling.energy === "High" 
              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
              : cooling.energy === "Medium"
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          }`}>
            {cooling.energy}
          </span>
          {!isLive && (
            <span className="text-[8px] text-gray-400" title="Using estimated data">
              ~
            </span>
          )}
        </div>
        <p className={`text-xs ${subCls}`}>{Math.round(weather.humidity)}% 💧</p>
      </div>
    </div>
  );
};

export default WeatherCard;
