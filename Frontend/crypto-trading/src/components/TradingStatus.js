import React, { useState, useEffect } from "react";

function TradingStatus({ isTrading }) {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (isTrading) {
      // Trading aktifse her saniye timer'ı artır
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
      setTimer(0); // Trading durduğunda timer'ı sıfırla
    }
    return () => clearInterval(interval);
  }, [isTrading]);

  return (
    <div>
      <h3>Trading Süresi: {timer} saniye</h3>
    </div>
  );
}

export default TradingStatus;
