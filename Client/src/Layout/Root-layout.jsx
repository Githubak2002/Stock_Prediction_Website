import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import LandingPg from "../Pages/LandingPg";
// import { Toaster } from "react-hot-toast";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider navigate={navigate} publishableKey={PUBLISHABLE_KEY}>
      {/* <Toaster /> */}

      <Nav />
      {/* <LandingPg /> */}

      <header className="header">
        <div>
          {/* <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn> */}
          {/* <SignedOut>
            <Link to="/sign-in">Sign In</Link>
          </SignedOut> */}
        </div>
      </header>

      <main>
        <Outlet />
      </main>
      <Footer />
    </ClerkProvider>
  );
}
