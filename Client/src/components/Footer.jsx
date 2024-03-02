import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-10 py-5 border-t-[1.2px] flexCenter flex-col gap-y-4">
      <div className="flexCenter text-blue-400 text-center">
        <h2 className="text-black pr-2">Developed by </h2>
        <Link to="https://www.linkedin.com/in/dhruv-v-084693219" target="blank">
          Dhruv
        </Link>
        <h2 className="text-black px-2">&</h2>
        <Link to="https://ak-nextjs-portfolio.vercel.app" target="blank">
          Anurag
        </Link>
      </div>

      <h2 className=" text-center">
        © <b> STCXKX</b> 2024
      </h2>

      {/* <h2 className="flexCenter gap-2 text-base sm:text-xl "> Made wiht
        <CiHeart />
        using Next_js
        <TbBrandNextjs />
      </h2>
      <h2 className="text-center text-base sm:text-xl ">
        Feel free to contact
      </h2> */}

      {/* ==== LOGO LINKS ==== */}
      {/* <div className="flexCenter gap-4 text-3xl sm:text-5xl ">
        <Link href="https://github.com/Githubak2002" target="blank">
          <i className="ri-github-line font-thin" />
        </Link>
        <Link href="https://www.linkedin.com/in/anuraglohar" target="blank">
          <i className="ri-linkedin-fill " />
        </Link>
        <Link href="mailto:anuragofficial2023@gmail.com" target="blank">
          <BiLogoGmail />
        </Link>
      </div> */}
    </footer>
  );
};

export default Footer;
