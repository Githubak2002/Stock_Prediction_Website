import { Route, Routes, BrowserRouter as Router, Link } from "react-router-dom";

import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";

// ================= pages =================
import LandingPg from "./Pages/LandingPg.jsx";
import Graph from "./Pages/Graph.jsx";
import Compare from "./Pages/Compare.jsx";
import Predict from "./Pages/Predict.jsx";
import ErrPg from "./Pages/ErrPg.jsx";

// ================ CLERK AUTH =============
import SignInPg from "./Pages/SignInPg.jsx";
import SignUpPg from "./Pages/SignUpPg.jsx";


function App() {
  return (
    <section className="mx-auto max-w-[1440px] ">
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<LandingPg />} />

          <Route path="/signin" element={<SignInPg />} />
          <Route path="/signup" element={<SignUpPg />} />
          <Route path="*" element={<ErrPg />} />

          <Route path="/graph" element={<Graph />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/predict-stock" element={<Predict />} />
        </Routes>
        <Footer />
      </Router>
    </section>
  );
}

export default App;

{
  /* <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<LandingPg />} />

          <Route path="/signin" element={<SignInPg />} />
          <Route path="/signup" element={<SignUpPg />} />
          <Route path="*" element={<ErrPg />} />


          <Route path="/graph" element={<Graph />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/predict-stock" element={<Predict />} />
        </Routes>
        <Footer />
      </Router> */
}
