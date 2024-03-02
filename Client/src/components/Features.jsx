import React from "react";
import { Link } from "react-router-dom";
import { features } from "../constants/constantss";

const Features = () => {
  return (
    <section className=" text-white bg-[#55578b] py-10 text-center">
      <div className="flexCenter flex-col gap-y-5">
        <h2 className=" font-black text-xl">FEATURES</h2>
        <h1 className="text-xl sm:text-3xl">
          Unlock the Power of <span className="font-bold"> STOCKX </span>Feature
        </h1>
        <p className="text-sm sm:md">
          Experience cutting-edge features designed to enhance your stock
          trading journey.
        </p>
      </div>
      <div className="flexCenter gap-3 flex-wrap max-w-[680px] mx-auto">
        {features.map((ele, i) => {
          return (
            <div key={i} className=" bg-[#ffffff51] p-2 w-[300px] mt-4 ">
              <Link to={ele.link}>
                <button>
                  <h2 className="text-xl py-3">{ele.heading}</h2>
                  <h5 className="text-sm">{ele.subHeading}</h5>
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
