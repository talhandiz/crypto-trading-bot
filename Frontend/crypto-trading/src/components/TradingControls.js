import React, { useState } from "react";

function TradingControls({ coin, interval }) {
  const [isTrading, setIsTrading] = useState(false);

  const startTrading = async () => {
    try {
      const response = await fetch("http://localhost:8000/trade/start_trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: coin, interval }),
      });

      if (!response.ok) {
        throw new Error("Trading başlatılamadı: " + response.statusText);
      }

      setIsTrading(true);
      console.log("Trading başladı");
    } catch (error) {
      console.error("Trading başlatılamadı:", error);
    }
  };

  const stopTrading = async () => {
    try {
      const response = await fetch("http://localhost:8000/trade/stop_trade", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Trading durdurulamadı: " + response.statusText);
      }

      setIsTrading(false);
      console.log("Trading durduruldu");
    } catch (error) {
      console.error("Trading durdurulamadı:", error);
    }
  };

  return (
    <div>
      <button onClick={startTrading} disabled={isTrading}>
        Start Trading
      </button>
      <button onClick={stopTrading} disabled={!isTrading}>
        Stop Trading
      </button>
    </div>
  );
}

export default TradingControls;
