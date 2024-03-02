import React from "react";
import { Link } from "react-router-dom";
// import img1 from "../assets/stock0.png";
// import bg1 from "../assets/stock_bg1.png";
// import img2 from "../assets/stock3.png";
// import bg2 from "../assets/stock_bg2.png";

// =============================================================
import axios from "axios";
// import WecomeTxt from "../components/Bubble txt/WelcomeTxt";
import Features from "../components/Features";

// Define the URL
const apiUrl = "http://localhost:8080/show_graph";
const stockName = "AMZN";
// Make a GET request to fetch data
// axios
//   .get(apiUrl, {
//     params: {
//       stock_name: stockName,
//     },
//   })
//   .then((response) => {
//     console.log("Data received:", response.data);
//   })
//   .catch((error) => {
//     console.error("Error fetching data:", error);
//   });

// ================================================================

const navCss = "hover:scale-110 transition-all hover:font-semibold";

const LandingPg = () => {
  return (
    <section>
      {/* <h2 className="flexCenter">  "Unlock the Power of Predictive Analytics -  Revolutionizing Stock Market Insights" </h2> */}

      {/* <main className=" flex items-center  justify-center sm:justify-evenly sm:flex-row flex-col h-[90vh] w-screen gap-y-20 gap-x-10 relative ">
        <h2 className="w-full sm:w-1/2 max-w-[510px] font-bold text-xl leading-8 sm:leading-[60px] sm:text-3xl text-center px-3 langingFont">
          "Predictive Insights, Profitable Investments: Welcome to the{" "}
          <span className=" text-green-500 langingFont">Future</span> of Stock
          Market Analysis"
        </h2>

        <img
          src={bg1}
          alt="err"
          className="absolute top-1/3 sm:top-[20%] -left-10 max-w-[250px] -z-20 opacity-85"
        />
        <img
          src={img1}
          alt="stock"
          className="w-full sm:w-1/2 p-5 sm:p-0 max-w-[380px]"
        />
      </main> */}

      <main className=" flexCenter flex-col gap-y-5 h-[80vh] sm:h-[90vh] xl:h-[580px]">
        <h2 className="text-4xl sm:text-6xl font-semibold text-center">
          Welcome to STCKX
        </h2>

        <h3 className="text-2xl pt-6 pb-2">Your AI stock predictor</h3>

        <div className="flexCenter gap-8">
          <Link>
            <button className={`p-2 text-white bg-orange-500`}>
              Gets started
            </button>
          </Link>
          <Link>
            <button>Learn more →</button>
          </Link>
        </div>

        {/* <p>Powerful feature of stock features</p> */}
      </main>

      <Features />
    </section>
  );
};

export default LandingPg;
