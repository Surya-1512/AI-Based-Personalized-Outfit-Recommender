import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { Row } from "react-bootstrap";
import axios from "axios";
import backendUrl from "./axios";
import ProductCard from "./ProductCard";

const Catelogue = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");

  const menPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/menProducts`, {
        headers: {
          "ngrok-skip-browser-warning": "skip-browser-warning"
        }
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching menProducts:", error);
    }
    setLoading(false);
  };
  
  const womenPost = async () => {
    setLoading(true);
    try {
      console.log("Sending request to womenProducts endpoint...");
      const response = await axios.get(`${backendUrl}/womenProducts`,{
        headers: {
          "ngrok-skip-browser-warning": "skip-browser-warning"
        }
      });
      console.log("Received response from womenProducts endpoint:", response);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching womenProducts:", error);
    }
    setLoading(false);
  };
  
  const bestSellerPost = async () => {
    setLoading(true);
    try {
      console.log("Sending request to bestsellers endpoint...");
      const response = await axios.get(`${backendUrl}/bestsellers`,{
        headers: {
          "ngrok-skip-browser-warning": "skip-browser-warning"
        }
      });
      console.log("Received response from bestsellers endpoint:", response);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching bestsellers:", error);
    }
    setLoading(false);
  };
  

  const getFunc = () => {
    if (props.catelogue === "men") {
      setCategory("men");
      return menPost();
    } else if (props.catelogue === "women") {
      setCategory("women");
      return womenPost();
    } else if (props.catelogue === "bestseller") {
      setCategory("bestSellerProducts");
      return bestSellerPost();
    }
  };

  useEffect(() => {
    getFunc();
  }, []);

  return (
    <>
      <Box className="container" style={{ marginTop: "40px" }}>
        <Row xs={1} md={2} className="g-4">
          {loading ? (
            <h4>Loading...</h4>
          ) : (
            data.map((item) => {
              return (
                <ProductCard
                  id={item.product_id}
                  cat={category}
                  key={item.product_id}
                  url={item.img1}
                  title={item.title}
                  pTitle={item.title}
                  type={item.product_type}
                  price={item.variant_price}
                  aPrice={item.variant_compare_at_price}
                />
              );
            })
          )}
        </Row>
      </Box>
    </>
  );
};

export default Catelogue;
