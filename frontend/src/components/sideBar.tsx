import "../App.css";
import { Routes, Route, Link } from "react-router-dom";

import Today from "../Today";
import Tasks from "../Tasks";
import Category from "../Category";

function SideBar() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/today">Today</Link>
        {" | "}
        <Link to="/tasks">Tasks</Link>
        {" | "}
        <Link to="/categories">Category</Link>
      </nav>

      <Routes>
        <Route path="/" element={""} />
        <Route path="/today" element={<Today />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/categories" element={<Category />} />
      </Routes>
    </>
  );
}

export default SideBar;
