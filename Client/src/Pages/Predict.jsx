// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import PredictStock from "../components/PredictStock.jsx";
// import { stks_lists_compare as stks_lists } from "../constants/constantss.js";

// import { SignedIn } from "@clerk/clerk-react";

// const stocks = stks_lists;

// // ================ Tailind CSS class ================
// const err_loding_css = "text-center h-[60vh] text-4xl font-bold flexCenter";
// const select_stock_css =
//   "hover:cursor-pointer appearance-none bg-gray-200 border border-gray-200 text-gray-700 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ";

// const Predict = () => {
//   const [stocksData, setStocksData] = useState(null);
//   // const [stockName, setstockName] = useState("AAPL");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [selectedStock1, setSelectedStock1] = useState("AMZN");
//   const handleStockChange1 = (e) => {
//     setSelectedStock1(e.target.value);
//   };

//   // const [selectedStock2, setSelectedStock2] = useState("AAPL");
//   // const handleStockChange2 = (e) => {
//   //   setSelectedStock2(e.target.value);
//   // };

//   const predict_stk = () => {
//     // console.log("1st stock to compare ", selectedStock1);
//     fetchData();
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/stock_prediction?stock_name=${selectedStock1}&days_to_predict=30`
//         // http://localhost:8080/stock_prediction?stock_name=AAPL&days_to_predict=30
//       );
//       setStocksData(response.data); // Assuming the API returns the data directly
//       // console.log("Skocks data to compare → ", response.data);

//       setLoading(false);
//     } catch (error) {
//       setError(error);
//       setLoading(false);
//       console.log("Error in fetching stock data error → ", error);
//     }
//   };

//   if (loading) return <div className={err_loding_css}> Loading... </div>;
//   if (error)
//     return <div className={err_loding_css}>Error: {error.message}</div>;

//   return (
//     <section>
//       {/* <SignedIn> */}
//       <main className="flexCenter pt-5 sm:pt-8 gap-5 flex-col sm:flex-row">
//         {/* ==================== Predict stock ==================== */}
//         <div className="relative inline-block ">
//           <select
//             value={selectedStock1}
//             onChange={handleStockChange1}
//             className={select_stock_css}
//           >
//             <option value="">Select a stock ↓ </option>
//             {stocks.map((stock, index) => (
//               <option key={index} value={stock.stkName}>
//                 {stock.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button
//           className="border-2 border-slate-500 px-2 py-1 rounded-lg"
//           onClick={predict_stk}
//         >
//           Predict
//         </button>
//       </main>

//       {/* ======== Stokcks comparision graph ============= */}
//       <main className="pt-8 w-auto md:w-[96vw] mx-auto">
//         <PredictStock msg={stocksData} />
//       </main>
//       {/* </SignedIn> */}
//     </section>
//   );
// };

// export default Predict;

// Predict component
import React, { useState, useEffect } from "react";
import axios from "axios";
import PredictStock from "../components/PredictStock.jsx";
import toast, { Toaster } from "react-hot-toast";
import { stks_lists_compare as stks_lists } from "../constants/constantss.js";

import { SignedIn } from "@clerk/clerk-react";

const stocks = stks_lists;
const notify = () => toast("Select a stock to Predict");

// ================ Tailind CSS class ================
const err_loding_css = "text-center h-[60vh] text-4xl font-bold flexCenter";
const select_stock_css =
  "hover:cursor-pointer appearance-none bg-gray-200 border border-gray-200 text-gray-700 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ";

const Predict = () => {
  const [stocksData, setStocksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock1, setSelectedStock1] = useState("AMZN");

  const handleStockChange1 = (e) => {
    if (e.target.value == "") {
      notify();
      return;
    }
    setSelectedStock1(e.target.value);
  };

  // const predict_stk = () => {
  //   fetchData();
  //   console.log("selected stock", selectedStock1);
  // };

  useEffect(() => {
    fetchData();
  }, [selectedStock1]); // Trigger useEffect when selectedStock1 changes

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/stock_prediction?stock_name=${selectedStock1}&days_to_predict=30`
      );
      setStocksData(response.data);
      console.log("data ", response.data);
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
        <div className="relative inline-block ">
          <select
            value={selectedStock1}
            onChange={handleStockChange1}
            className={select_stock_css}
          >
            <option value="">Select a stock ↓ </option>
            {stocks.map((stock, index) => (
              <option key={index} value={stock.stkName}>
                {stock.label}
              </option>
            ))}
          </select>
        </div>
        {/* <button
          className="border-2 border-slate-500 px-2 py-1 rounded-lg"
          onClick={predict_stk}
        >
          Predict
        </button> */}
      </main>
      <main className="pt-8 w-auto md:w-[96vw] mx-auto">
        <PredictStock msg={stocksData} />
      </main>
    </section>
  );
};

export default Predict;
