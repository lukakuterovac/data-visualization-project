import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col p-4">
      <Header />

      <Outlet />
    </div>
  );
};

export default Layout;
