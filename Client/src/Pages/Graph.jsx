import React, { useState, useEffect } from "react";
import axios from "axios";
import { StockButtons } from "../constants/constantss.js";

// import StockChart from "../components/ShowGraph1.jsx";
import StockChart from "../components/ShowGraph.jsx";
// import { data } from "autoprefixer";

// ================ Tailind CSS class ================
const err_loding_css = "text-center h-[60vh] text-4xl font-bold flexCenter";

const Graph = () => {
  const [activeButton, setActiveButton] = useState(0);
  const [stockName, setStockName] = useState("AMZN");

  const [stockData, setStockData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const url = `http://localhost:8080/show_graph?stock_name=AAPL`;

  // useEffect(() => {
  //   console.log(stockData);
  // }, [stockData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('http://localhost:8080/show_graph?stock_name=AAPL');
        const response = await axios.get(
          `http://localhost:8080/show_graph?stock_name=${stockName}`
        );
        setStockData(response.data); // Assuming the API returns the data directly
        // console.log("Skock data → ", response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        console.log("Error in fetching stock data error → ", error);
      }
    };

    fetchData();
  }, [stockName]);

  if (loading) return <div className={err_loding_css}> Loading... </div>;
  if (error)
    return <div className={err_loding_css}>Error: {error.message}</div>;

  // Combined click handler
  const handleButtonClick = (stkName, index) => {
    setStockName(stkName);
    setActiveButton(index);
  };

  return (
    <section className="">
      {/* === Stock btns === */}
      <div className="flex justify-center flex-wrap gap-4 p-4 mt-4">
        {StockButtons.map((button, index) => (
          <button
            key={index}
            // className={` ${button.bgColor} ${button.hoverColor} text-white font-bold py-2 px-4 rounded ${ activeButton === index  ? "opacity-100 border-black border-2"   : "opacity-50"  } `}.
            className={`font-bold py-2 px-4 rounded-xl ${
              activeButton === index
                ? "opacity-100 border-black border-2"
                : "opacity-50"
            } `}
            onClick={() => handleButtonClick(button.stkName, index)}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* ========== STOCK GRAPH ========== */}
      <main className="pt-8 w-auto md:w-[96vw] mx-auto">
        <StockChart data={stockData} />
      </main>
    </section>
  );
};

export default Graph;
