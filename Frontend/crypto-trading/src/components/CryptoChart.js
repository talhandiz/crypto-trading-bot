import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const CryptoChart = ({ coin, interval, network = "MAINNET" }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const wsRef = useRef(null);

  const baseApiUrl =
    network === "TESTNET"
      ? "https://testnet.binance.vision/api/v3/klines"
      : "https://api.binance.com/api/v3/klines";
  const baseWsUrl =
    network === "TESTNET"
      ? "wss://testnet.binance.vision/ws"
      : "wss://stream.binance.com:9443/ws";

  useEffect(() => {
    const chartElement = chartContainerRef.current;
    if (!chartElement) return;

    const chart = createChart(chartElement, {
      width: chartElement.clientWidth,
      height: 400,
      layout: {
        textColor: "#d1d4dc",
        background: { type: "solid", color: "#1c1f26" },
      },
      grid: {
        vertLines: { color: "#2f353b" },
        horzLines: { color: "#2f353b" },
      },
      rightPriceScale: { borderColor: "#2f353b" },
      timeScale: { borderColor: "#2f353b" },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    return () => {
      chart.remove();
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const loadInitialData = async () => {
    if (!candlestickSeriesRef.current) return;

    const url = `${baseApiUrl}?symbol=${coin}&interval=${interval}&limit=1000`;
    const response = await fetch(url);
    const data = await response.json();

    const formattedData = data.map((item) => ({
      time: item[0] / 1000,
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));

    candlestickSeriesRef.current.setData(formattedData);
  };

  const subscribeToLiveUpdates = () => {
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(
      `${baseWsUrl}/${coin.toLowerCase()}@kline_${interval}`
    );

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { k: candle } = message;

      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.update({
          time: candle.t / 1000,
          open: parseFloat(candle.o),
          high: parseFloat(candle.h),
          low: parseFloat(candle.l),
          close: parseFloat(candle.c),
        });
      }
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    loadInitialData();
    subscribeToLiveUpdates();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [coin, interval]);

  return <div ref={chartContainerRef} style={{ position: "relative", height: "400px" }}></div>;
};

export default CryptoChart;
