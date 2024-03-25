import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Typography, CircularProgress } from "@material-ui/core";
import Row from "react-bootstrap/Row";

import backendUrl from "../Product/axios";
import PosterCarousal from "./Carousals/PosterCarousal";
import Header from "./Header";
import CompanyMoto from "./CompanyMoto";
import MainCard from "./MainCard";
import ProductCard from "../Product/ProductCard";

import "./Home.css"; // Import custom CSS file

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(6);

  const loadPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/bestsellers`, {
        headers: {
          "ngrok-skip-browser-warning": "skip-browser-warning"
        }
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPost();
  }, []);

  return (
    <>
      <PosterCarousal />
      <Header header="COLLECTIONS" />
      <Grid container spacing={3} className="collections">
        <MainCard
          url="./images/Collection/NewArrival.jpg"
          alt="New Arrival Collection"
          link="/"
        />
        <MainCard
          url="./images/Collection/bestseller.jpg"
          alt="BestSeller Collection"
          link="/bestSeller"
        />
        <MainCard
          url="./images/Collection/NewArrivals_solids.jpg"
          alt="Basic Collection"
          link="/"
        />
      </Grid>
      <Header header="Recommendation For You" />
      <Box mt={4} mb={6} className="product-list">
        <Typography variant="h5" align="center" gutterBottom>
          {loading ? "Loading..." : "Products"}
        </Typography>
        <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
          {loading ? (
            <CircularProgress />
          ) : (
            data.slice(10, count + 10).map((item) => (
              <ProductCard
                key={item.product_id}
                id={item.product_id}
                url={item.img1}
                title={item.title}
                pTitle={item.title}
                type={item.product_type}
                price={item.variant_price}
                aPrice={item.variant_compare_at_price}
              />
            ))
          )}
        </Row>
      </Box>
      <CompanyMoto />
    </>
  );
};

export default Home;
