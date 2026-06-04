import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Today from "./Today";
import Tasks from "./Tasks";
import Category from "./Category";
import SideBar from "./components/sideBar";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
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
