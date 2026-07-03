import "../App.css";
import { Link } from "react-router-dom";
import Logo from "../assets/PriorioLogo.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavBar() {
  return (
    <>
      <Navbar
        expand="lg"
        data-bs-theme="dark"
        style={{ backgroundColor: "rgb(33, 58, 163)" }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src={Logo}
              className="logo d-inline-block align-top"
              alt="Priorio Logo"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/today">
                Today
              </Nav.Link>
              <Nav.Link as={Link} to="/tasks">
                Tasks
              </Nav.Link>
              <Nav.Link as={Link} to="/categories">
                Category
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
