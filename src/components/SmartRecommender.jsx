import React, { useEffect, useState } from "react";

const ecoAlternatives = [
  {
    keywords: ["fan", "ceiling fan", "pedestal fan", "table fan"],
    name: "Inverter Fan (DC Motor)",
    wattage: 40,
    price: 12000,
    link: "https://www.daraz.pk/catalog/?q=inverter%20fan",
  },
  {
    keywords: ["ac", "air conditioner", "conditioner"],
    name: "Inverter AC (1 Ton)",
    wattage: 900,
    price: 95000,
    link: "https://www.daraz.pk/catalog/?q=inverter%20ac",
  },
  {
    keywords: ["bulb", "light", "lamp"],
    name: "LED Bulb 12W",
    wattage: 12,
    price: 700,
    link: "https://www.daraz.pk/catalog/?q=led%20bulb",
  },
  {
    keywords: ["fridge", "refrigerator", "freezer"],
    name: "Inverter Refrigerator",
    wattage: 100,
    price: 75000,
    link: "https://www.daraz.pk/catalog/?q=inverter%20refrigerator",
  },
  {
    keywords: ["iron", "press"],
    name: "Auto Steam Iron (Low Power)",
    wattage: 1000,
    price: 8500,
    link: "https://www.daraz.pk/catalog/?q=steam%20iron",
  },
  {
    keywords: ["washing machine", "washer"],
    name: "Inverter Washing Machine",
    wattage: 400,
    price: 45000,
    link: "https://www.daraz.pk/catalog/?q=inverter%20washing%20machine",
  },
  {
    keywords: ["cooler"],
    name: "Evaporative Air Cooler",
    wattage: 120,
    price: 25000,
    link: "https://www.daraz.pk/catalog/?q=air%20cooler",
  },
];

const SmartRecommender = ({ appliances }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(
        document.documentElement.classList.contains("dark")
          ? "dark"
          : "light"
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ⚙️ Calculate Recommendations
  useEffect(() => {
    if (!appliances.length) {
      setRecommendations([]);
      return;
    }

    const recs = appliances
      .map((a) => {
        const applianceName = a.name.toLowerCase();

        // 🔍 Find the first matching eco alternative
        const alt = ecoAlternatives.find((item) =>
          item.keywords.some((kw) => applianceName.includes(kw))
        );

        if (!alt) return null;

        const dailySavingKWh = ((a.wattage - alt.wattage) * a.hours) / 1000;
        const monthlySavingKWh = Math.max(dailySavingKWh * 30, 0);
        const monthlySavingRs = monthlySavingKWh * 55;

        return {
          appliance: a.name,
          current: a.wattage,
          alternative: alt.name,
          altWatt: alt.wattage,
          monthlySavingKWh: monthlySavingKWh.toFixed(2),
          monthlySavingRs: monthlySavingRs.toFixed(0),
          link: alt.link,
          price: alt.price,
        };
      })
      .filter(Boolean);

    setRecommendations(recs);
  }, [appliances]);
  const bgClass =
    theme === "dark"
      ? "bg-gray-800 text-gray-100"
      : "bg-white text-gray-900";

  const borderClass =
    theme === "dark" ? "border-gray-700" : "border-gray-200";

  const hoverClass =
    theme === "dark"
      ? "hover:bg-green-900/20"
      : "hover:bg-green-50";

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg transition-colors duration-300 ${bgClass}`}
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
        🔋 Smart Appliance Recommender
      </h2>
      <p className={`text-xs sm:text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        Get energy-efficient alternatives available in Pakistan
      </p>

      {!appliances.length ? (
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Add appliances to get eco-friendly upgrade suggestions for Pakistani market.
        </p>
      ) : recommendations.length ? (
        <div className="space-y-4">
          {recommendations.map((r, i) => (
            <div
              key={i}
              className={`border p-4 rounded-xl transition ${borderClass} ${hoverClass}`}
            >
              <h3 className="font-semibold text-base sm:text-lg mb-1 break-words">{r.appliance}</h3>
              <p className="text-xs sm:text-sm break-words">
                💡 Recommended: <strong>{r.alternative}</strong> ({r.altWatt.toLocaleString()} W)
              </p>
              <p className="text-xs sm:text-sm break-words">
                ⚡ Current: {r.current.toLocaleString()} W → Save{" "}
                <strong>{r.monthlySavingKWh} kWh/month</strong> (~Rs.{" "}
                <strong>{r.monthlySavingRs}</strong>)
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                🛒 Price: Rs. {r.price.toLocaleString()}
              </p>
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition min-h-[44px] flex items-center justify-center"
              >
                View on Daraz →
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No energy-efficient alternatives found for your current appliances.</p>
      )}
    </div>
  );
};

export default SmartRecommender;
