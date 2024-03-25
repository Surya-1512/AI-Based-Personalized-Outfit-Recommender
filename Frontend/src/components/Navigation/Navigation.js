import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./Navigation.css"; // Import CSS file for custom styling

const Navigation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  
  const handleSignout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="bright" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">WearNow</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
              <Nav.Link className={location.pathname === '/weather' ? 'active' : ''} href="/weather">Weather</Nav.Link>
              <Nav.Link className={location.pathname === '/try-on' ? 'active' : ''} href="/try-on">Try-On</Nav.Link>
              <Nav.Link className={location.pathname === '/occasion' ? 'active' : ''} href="/occasion">Occasion</Nav.Link>
              <Nav.Link className={location.pathname === '/men' ? 'active' : ''} href="/men">Men</Nav.Link>
              <Nav.Link className={location.pathname === '/women' ? 'active' : ''} href="/women">Women</Nav.Link>
              <Nav.Link className={location.pathname === '/bestseller' ? 'active' : ''} href="/bestseller">BestSellers</Nav.Link>
              <Nav.Link className={location.pathname === '/recommand' ? 'active' : ''} href="/recommand">Recommendation</Nav.Link>

              <Nav.Link className={location.pathname === '/contact' ? 'active' : ''} href="/contact">Contact Us</Nav.Link>
            </Nav>
            {currentUser ? (
              <Button variant="outline-dark" onClick={handleSignout} style={{ marginLeft: "10px" }}>
                Logout
              </Button>
            ) : (
              <Nav.Link href="/login">Login/SignUp</Nav.Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
