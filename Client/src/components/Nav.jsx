import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import "remixicon/fonts/remixicon.css";
// import { useSelector,useDispatch } from 'react-redux';
// import { logout } from '../redux/store';
// import toast from 'react-hot-toast';

import { SignedIn, UserButton } from "@clerk/clerk-react";

const navCss = "hover:scale-110 transition-all hover:font-semibold";
const Nav = () => {
  const [menu, setMenu] = useState("hidden");
  const { userId } = useAuth();

  // console.log("test userId by clerk → ", userId);

  // ==== global state ====
  // let isLogin = useSelector(state => state.isLogin);
  // isLogin = isLogin || localStorage.getItem("userId");
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const logoutHandler = () => {
  //   toast.success("Logout successfully");
  //   dispatch(logout());
  //   localStorage.clear();
  //   navigate('/login');
  //   setMenu("hidden")
  // }

  return (
    // <nav className="flex justify-between items-center sm:px-8 py-[2vh] shadow-2xl border-b-2 bg-white border-slate-700">
    <nav className="flex justify-between items-center sm:px-8 py-[2vh] shadow-2xl border-b border-black h-[10vh]">
      <Link
        className={`font-bold sm:p-0 pl-4 md:text-3xl text-xl text-slate-600`}
        to="/"
      >
        STCKX
      </Link>

      {/* ==== nav for laptop and tablet size screen ==== */}
      <main className="sm:flex hidden text-xl font-semibold text-[#454545f0]">
        <div className="flex gap-x-6 text-xl">
          <Link className={navCss} to="/">
            Home
          </Link>
          <Link className={navCss} to="/about">
            About
          </Link>
          <Link className={navCss} to="/stocks">
            Stocks
          </Link>
          <Link className={navCss} to="/contact">
            Contact
          </Link>
        </div>
      </main>

      {userId ? (
        <main className={`sm:flex hidden text-xl gap-4 font-semibold`}>
          <SignedIn>
            {/* <SignOutButton signOutCallback={() => redirect("/")} /> */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </main>
      ) : (
        <main className={`sm:flex hidden text-xl font-semibold`}>
          <div className="flexCenter gap-x-6 text-xl">
            {/* <SignInButton redirectUrl="/signin" /> */}
            <Link className={navCss} to="/sign-in">
              Sign In
            </Link>
            <Link className={navCss} to="/sign-up">
              <button className="py-1 px-2 text-white bg-orange-500">
                Sign Up
              </button>
            </Link>
          </div>
        </main>
      )}

      {/* ============================= nav for mobile size screen ======================================= */}
      <div className="flex sm:hidden gap-3 flex-row-reverse ">
        <i
          onClick={() => setMenu("flex")}
          className="sm:hidden hover:cursor-pointer pr-4 text-xl font-bold ri-menu-2-fill"
        ></i>

        {userId && (
          <>
            <SignedIn>
              {/* <SignOutButton signOutCallback={() => redirect("/")} /> */}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </>
        )}
      </div>

      <main
        className={`z-50 fixed top-0 sm:hidden h-screen ${menu} items-center justify-center  bg-gradient-to-r from-[#e3e3e3] to-[#dbdbfffd] shadow-2xl shadow-slate-700  border-b-2 border-black w-full font-bold text-xl`}
      >
        <div className="py-7 flex flex-col items-start gap-y-6">
          <i
            onClick={() => setMenu("hidden")}
            className=" hover:cursor-pointer  absolute top-[2%] right-[4%] text-3xl ri-close-line"
          />
          <Link onClick={() => setMenu("hidden")} to="/">
            → Home
          </Link>
          <Link onClick={() => setMenu("hidden")} to="/stocks">
            → Stocks
          </Link>
          <Link onClick={() => setMenu("hidden")} to="/about">
            → About
          </Link>
          <Link onClick={() => setMenu("hidden")} to="/contact">
            → Contact
          </Link>

          {!userId && (
            <>
              <Link onClick={() => setMenu("hidden")} to="/sign-in">
                → Sign In
              </Link>
              <Link
                className={navCss}
                onClick={() => setMenu("hidden")}
                to="/sign-up"
              >
                <button className="py-1 px-2 text-white bg-orange-500">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </main>
    </nav>
  );
};

export default Nav;
