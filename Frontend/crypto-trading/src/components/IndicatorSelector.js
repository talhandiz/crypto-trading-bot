import React, { useState } from "react";

function IndicatorSelector() {
  const [indicators, setIndicators] = useState({
    RSI: { active: false, period: 14, overbought: 70, oversold: 30 },
    "SMA Crossover": { active: false, period: 20, deviation: 2 },
    MACD: { active: false, fastLength: 12, slowLength: 26, signalLength: 9 },
    "Bollinger Bands": { active: false, period: 20, deviation: 2 },
  });

  const handleChange = (indicator, key, value) => {
    const updated = {
      ...indicators,
      [indicator]: {
        ...indicators[indicator],
        [key]: value,
      },
    };
    setIndicators(updated);
  };

  const handleSave = async () => {
    const activeIndicators = Object.entries(indicators)
      .filter(([_, config]) => config.active) // Sadece aktif indikatörler
      .map(([name, config]) => {
        const { active, ...params } = config; // "active" parametresini çıkar
        return { name, ...params }; // İndikatör adını ve parametrelerini birleştir
      });

    try {
      const response = await fetch("http://localhost:8000/strategy/set_strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeIndicators),
      });

      if (!response.ok) {
        throw new Error(`İstek başarısız: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Stratejiler kaydedildi:", data);
      alert("Stratejiler başarıyla kaydedildi!");
    } catch (error) {
      console.error("Hata:", error);
      alert("Stratejiler kaydedilemedi.");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Strateji Seçimi</h2>

      {/* Dinamik indikatör alanları */}
      {Object.keys(indicators).map((indicator) => (
        <div key={indicator}>
          <label>
            <input
              type="checkbox"
              checked={indicators[indicator].active}
              onChange={(e) =>
                handleChange(indicator, "active", e.target.checked)
              }
            />
            {indicator}
          </label>
          {indicators[indicator].active && (
            <div style={{ marginLeft: "20px" }}>
              {Object.keys(indicators[indicator])
                .filter((key) => key !== "active") // "active" hariç diğer parametreler
                .map((key) => (
                  <div key={key}>
                    <label>
                      {key}:
                      <input
                        type="number"
                        value={indicators[indicator][key]}
                        onChange={(e) =>
                          handleChange(
                            indicator,
                            key,
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}

      {/* Kaydet Butonu */}
      <button onClick={handleSave} style={{ marginTop: "20px" }}>
        Kaydet
      </button>
    </div>
  );
}

export default IndicatorSelector;
