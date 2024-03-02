// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// // ==== CLERK FOR AUTH ===
// import { ClerkProvider } from "@clerk/clerk-react";

// // Import your publishable key
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key");
// }

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
//       <App />
//     </ClerkProvider >
//   </React.StrictMode>
// );

// ====================================================================================
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";

// Import the layouts
import RootLayout from "./Layout/Root-layout.jsx";
import CompareLayout from "./Layout/Compare-layout.jsx";

// Import the components
// import IndexPage from './routes'
// import ContactPage from './routes/contact'
// import DashboardPage from './routes/dashboard'
// import InvoicesPage from './routes/dashboard.invoices'
// import Nav from "./components/Nav.jsx";
// import Footer from "./components/Footer.jsx";

// ================= pages =================
import LandingPg from "./Pages/LandingPg.jsx";
import Graph from "./Pages/Graph.jsx";
import Compare from "./Pages/Compare.jsx";
// import ErrPg from "./Pages/ErrPg.jsx";
// import Predict from "./Pages/Predict.jsx";

// ================ CLERK AUTH =============
// import { SignedOut, SignedIn, UserButton, SignUp } from "@clerk/clerk-react";
import SignInPg from "./Pages/SignInPg.jsx";
import SignUpPg from "./Pages/SignUpPg.jsx";
import Predict from "./Pages/Predict.jsx";
import ErrPg from "./Pages/ErrPg.jsx";
import { Contact } from "./Pages/Contact.jsx";
import { About } from "./Pages/About.jsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPg /> },
      { path: "/graph", element: <Graph /> },
      { path: "/stocks", element: <Graph /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/sign-in", element: <SignInPg /> },
      { path: "/sign-up", element: <SignUpPg /> },
      { path: "*", element: <ErrPg /> },
      // { path: "/contact", element: <ContactPage /> },

      {
        element: <CompareLayout />,
        children: [
          { path: "/predict-stock", element: <Predict /> },
          { path: "/compare", element: <Compare /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
