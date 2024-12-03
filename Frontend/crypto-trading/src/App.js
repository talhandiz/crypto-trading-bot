import React, { useState } from "react";
import CryptoChart from "./components/CryptoChart";
import IndicatorSelector from "./components/IndicatorSelector";
import TradingControls from "./components/TradingControls";
import TradingStatus from "./components/TradingStatus";

function App() {
  const [coin, setCoin] = useState("BTCUSDT");
  const [interval, setInterval] = useState("15m");
  const [indicators, setIndicators] = useState({});
  const [isTrading, setIsTrading] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Crypto Trading Uygulaması</h1>

      {/* Coin ve Zaman Aralığı */}
      <div style={{ marginBottom: "20px" }}>
        <select value={coin} onChange={(e) => setCoin(e.target.value)}>
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="AVAXUSDT">AVAX/USDT</option>
          <option value="SOLUSDT">SOLU/USDT</option>
          <option value="ETHUSDT,">ETH/USDT</option>
          <option value="RENDERUSDT">RENDER/USDT</option>
          <option value="FETUSDT">FET/USDT</option>
        </select>
        <select value={interval} onChange={(e) => setInterval(e.target.value)}>
          <option value="1m">1 Dakika</option>
          <option value="15m">15 Dakika</option>
          <option value="1h">1 Saat</option>
          <option value="4h">4 Saat</option>
          <option value="1d">1 Gün</option>
        </select>
      </div>

      {/* Grafik */}
      <CryptoChart coin={coin} interval={interval} />

      {/* İndikatör Seçimi */}
      <IndicatorSelector onIndicatorsChange={setIndicators} />

      {/* Trading Kontrolleri */}
      <TradingControls
        coin={coin}
        interval={interval}
        indicators={indicators}
        isTrading={isTrading}
        setIsTrading={setIsTrading}
      />

      {/* Trading Durumu */}
      <TradingStatus isTrading={isTrading} />
    </div>
  );
}

export default App;
