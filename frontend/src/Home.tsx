import "./App.css";
import heroImg from "./assets/lab3Hero.png";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="homeNavBar">
        <Outlet />
      </div>
      <div className="hero">
        <img src={heroImg} className="hero" width="100%" alt="" />
      </div>
    </>
  );
}

export default Home;
