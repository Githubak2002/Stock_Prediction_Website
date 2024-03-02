import React from "react";
import img1 from "../assets/stock0.png";
import { about_us } from "../constants/constantss.js";

// ===== css classes =====
const main_class_css =
  "flex items-center justify-center sm:justify-evenly sm:flex-row flex-col h-[90vh] gap-y-20 gap-x-10 relative";
const main_heading_css =
  "w-full sm:w-1/2 max-w-[510px] font-bold text-xl leading-8 sm:leading-[60px] sm:text-3xl text-center px-3 langingFont";

export const About = () => {
  return (
    <section className="w-full">
      {/* <h2 className="flexCenter">
        "Unlock the Power of Predictive Analytics - Revolutionizing Stock Market
        Insights"
      </h2> */}

      <header className={main_class_css}>
        <h2 className={main_heading_css}>
          "Predictive Insights, Profitable Investments: Welcome to the{" "}
          <span className=" text-green-500 langingFont">Future</span> of Stock
          Market Analysis"
        </h2>

        {/* <img
          src={bg1}
          alt="err"
          className="absolute top-1/3 sm:top-[20%] -left-10 max-w-[250px] -z-20 opacity-85"
        /> */}
        <img
          src={img1}
          alt="stock"
          className="w-full sm:w-1/2 p-5 sm:p-0 max-w-[380px]"
        />
      </header>

      {/* {console.log(about_us)} */}
      {about_us.map((ele, i) => {
        return (
          <div className="text-center ">
            <h2 className="text-xl sm:text-2xl font-bold">{ele.heading}</h2>
            <p className="">{ele.subheading}</p>
          </div>
        );
      })}
    </section>
  );
};
