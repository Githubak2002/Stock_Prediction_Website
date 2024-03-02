import React, { useState, useEffect } from "react";
import axios from "axios";
import CompareStocks from "../components/CompareStocks.jsx";
import { stks_lists_compare } from "../constants/constantss.js";
import toast, { Toaster } from "react-hot-toast";

import { SignedIn } from "@clerk/clerk-react";

const stocks = stks_lists_compare;
const notify = () => toast("Select a stock to compare");

// ================ Tailind CSS class ================
const err_loding_css = "text-center h-[60vh] text-4xl font-bold flexCenter";
const select_stock_css =
  "hover:cursor-pointer appearance-none bg-gray-200 border border-gray-200 text-gray-700 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ";

const Compare = () => {
  const [stocksData, setStocksData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStock1, setSelectedStock1] = useState("AMZN");
  const handleStockChange1 = (e) => {
    setSelectedStock1(e.target.value);
  };
  const [selectedStock2, setSelectedStock2] = useState("AAPL");
  const handleStockChange2 = (e) => {
    setSelectedStock2(e.target.value);
  };

  const compare_stk = () => {
    if (selectedStock1 == "" || selectedStock2 == "") {
      notify();  return;
    }
    // console.log("1st stock to compare ", selectedStock1);
    // console.log("1st stock to compare ", selectedStock2);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/graph_comparison?stock_name1=${selectedStock1}&stock_name2=${selectedStock2}`
        // "http://localhost:8080/graph_comparison?stock_name1=AAPL&stock_name2=MSFT"
      );
      setStocksData(response.data); // Assuming the API returns the data directly
      // console.log("Skocks data to compare → ", response.data);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.log("Error in fetching stock data error → ", error);
    }
  };

  if (loading) return <div className={err_loding_css}> Loading... </div>;
  if (error)
    return <div className={err_loding_css}>Error: {error.message}</div>;

  // Filter the stocks array to remove the selected stock from the first dropdown
  const filteredStocks = stocks.filter(
    (stock) => stock.stkName !== selectedStock1
  );

  return (
    <section>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            border: "1px solid #ff292999",
            padding: "16px",
            color: "#ff2929dd",
          },
        }}
      />
      <main className="flexCenter pt-5 sm:pt-8 gap-5 flex-col sm:flex-row">
        {/* ==================== Selecting First stock ==================== */}
        <div className="relative inline-block ">
          <select
            value={selectedStock1}
            onChange={handleStockChange1}
            className={select_stock_css}
          >
            <option value="">Select a stock ↓</option>
            {stocks.map((stock, index) => (
              <option key={index} value={stock.stkName}>
                {stock.label}
              </option>
            ))}
          </select>
        </div>

        {/* ==================== Selecting Second stock ==================== */}
        <div className="relative inline-block">
          <select
            value={selectedStock2}
            onChange={handleStockChange2}
            className={select_stock_css}
          >
            <option value="">Select a stock ↓</option>
            {filteredStocks.map((stock, index) => (
              <option key={index} value={stock.stkName}>
                {stock.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="border-2 border-slate-500 px-2 py-1 rounded-lg"
          onClick={compare_stk}
        >
          Compare
        </button>
      </main>

      {/* ======== Stokcks comparision graph ============= */}
      <main className="pt-8 w-auto md:w-[96vw] mx-auto">
        <CompareStocks msg={stocksData} />
      </main>
    </section>
  );
};

export default Compare;
