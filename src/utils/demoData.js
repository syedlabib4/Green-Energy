// Demo data for hackathon presentation

export const generateDemoData = () => {
  const demoAppliances = [
    { id: 1, name: "AC (1.5 Ton)", wattage: 1500, hours: 8, energy: 12.0 },
    { id: 2, name: "Refrigerator", wattage: 200, hours: 24, energy: 4.8 },
    { id: 3, name: "LED Lights", wattage: 100, hours: 6, energy: 0.6 },
    { id: 4, name: "Fans (3x)", wattage: 225, hours: 12, energy: 2.7 },
    { id: 5, name: "Washing Machine", wattage: 2000, hours: 1, energy: 2.0 },
    { id: 6, name: "Water Motor", wattage: 750, hours: 2, energy: 1.5 },
  ];

  const demoBills = [
    { month: "Jan", monthName: "January", amount: "12500", units: 520 },
    { month: "Feb", monthName: "February", amount: "11800", units: 490 },
    { month: "Mar", monthName: "March", amount: "13200", units: 550 },
    { month: "Apr", monthName: "April", amount: "14800", units: 620 },
    { month: "May", monthName: "May", amount: "16200", units: 680 },
    { month: "Jun", monthName: "June", amount: "17500", units: 730 },
  ];

  return { demoAppliances, demoBills };
};

export const loadDemoData = () => {
  const { demoAppliances, demoBills } = generateDemoData();
  
  localStorage.setItem("appliances", JSON.stringify(demoAppliances));
  localStorage.setItem("historicalBills", JSON.stringify(demoBills));
  
  return { demoAppliances, demoBills };
};
