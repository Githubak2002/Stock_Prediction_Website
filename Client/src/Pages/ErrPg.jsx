import React from "react";
import error from "../assets/stock.png";
import { Link } from "react-router-dom";

const ErrPg = () => {
  return (
    <div className="flexCenter flex-col h-[76vh]">
      <img
        src={error}
        alt="404_error_png"
        className=" min-w-[210px] w-[20vw] pb-8"
      />

      <Link
        to="/"
        className="text-xl font-semibold text-blue-500 hover:text-2xl hover:underline transition-all "
      >
        {" "}
        Go to Home page...
      </Link>
    </div>
  );
};

export default ErrPg;
