import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AuthContextProvider from "./contexts/AuthContext";
import Navigation from "./components/Navigation/Navigation";
import Home from "./components/Home/Home";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import Contact from "./components/Contact/Contact";
import Men from "./components/Product/Men";
import Women from "./components/Product/Women";
import BestSeller from "./components/Product/BestSeller";
import ProductDetails from "./components/Product/ProductDetails";
import Recommandation from "./components/RecommadProd/Recommandation";
import Weather from "./components/Weather/Weather";
import TryOn from "./components/TryOn/TryOn";
import Occasion from "./components/Occassion/Occassion"; // Importing the Occasion component

const App = () => {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/weather" element={<Weather />} />
          <Route exact path="/try-on" element={<TryOn />} />
          <Route exact path="/men" element={<Men />} />
          <Route exact path="/women" element={<Women />} />
          <Route exact path="/bestseller" element={<BestSeller />} />
          <Route exact path="/men/:title" element={<ProductDetails />} />
          <Route exact path="/women/:title" element={<ProductDetails />} />
          <Route exact path="/recommand" element={<Recommandation />} />
          <Route path="/:title" element={<ProductDetails />} />
          
          <Route exact path="/occasion" element={<Occasion />} /> {/* New route for Occasion component */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
};

export default App;