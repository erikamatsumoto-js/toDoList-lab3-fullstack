import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";

import Home from "./Home";
import Today from "./Today";
import Tasks from "./Tasks";
import Category from "./Category";
import NavBar from "./components/NavBar";

function Priorio() {
  return (
    <>
      <div className="headerNavbar">
        <NavBar />
      </div>
      <Outlet />
    </>
  );
}

const router = createHashRouter([
  {
    path: "/",
    element: <Priorio />,
    children: [
      { index: true, element: <Home /> },
      { path: "today", element: <Today /> },
      { path: "tasks", element: <Tasks /> },
      { path: "categories", element: <Category /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
