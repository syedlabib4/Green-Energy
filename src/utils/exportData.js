// Utility functions for exporting data

export const exportToCSV = (data, filename = "energy-data") => {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas
      return typeof value === "string" && value.includes(",")
        ? `"${value}"`
        : value;
    });
    csvRows.push(values.join(","));
  }

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = "energy-data") => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.json`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateReport = (appliances, bills, metrics) => {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalAppliances: appliances.length,
      totalBills: bills.length,
      estimatedMonthlyConsumption: metrics.monthlyKWh || 0,
      estimatedMonthlyBill: metrics.estimatedBill || 0,
      potentialSavings: metrics.potentialSavings || 0,
      carbonFootprint: metrics.carbonFootprint || 0,
    },
    appliances: appliances.map(a => ({
      name: a.name,
      wattage: a.wattage,
      hoursPerDay: a.hours,
      dailyEnergy: a.energy,
    })),
    bills: bills.map(b => ({
      month: b.month || b.monthName,
      units: b.units,
      amount: b.amount,
    })),
  };

  return report;
};
