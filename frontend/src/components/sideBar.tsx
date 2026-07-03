import "../App.css";
import { Link } from "react-router-dom";
import Logo from "../assets/PriorioLogo.png";

function SideBar() {
  return (
    <nav>
      <Link to="/">
        <img src={Logo} className="logo" width="10%" alt="" />
      </Link>

      <Link to="/">Home</Link>
      <Link to="/today">Today</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/categories">Category</Link>
    </nav>
  );
}

export default SideBar;
