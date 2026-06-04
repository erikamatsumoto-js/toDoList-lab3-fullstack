import heroImg from "./assets/lab3Hero.png";
import "./App.css";
import SideBar from "./components/sideBar";

function Home() {
  return (
    <>
      <div className="hero">
        <img src={heroImg} className="hero" width="100%" alt="" />
      </div>
      <SideBar />
    </>
  );
}

export default Home;
