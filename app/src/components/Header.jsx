import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="rounded-lg shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">US Baby Names Visualization</h1>
      <div className="flex justify-center items-center gap-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "text-blue-500" : "text-gray-700"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? "text-blue-500" : "text-gray-700"
          }
        >
          Search
        </NavLink>
        <NavLink
          to="/name-cloud"
          className={({ isActive }) =>
            isActive ? "text-blue-500" : "text-gray-700"
          }
        >
          Name Cloud
        </NavLink>
        <NavLink
          to="/name-by-year"
          className={({ isActive }) =>
            isActive ? "text-blue-500" : "text-gray-700"
          }
        >
          Name By Year
        </NavLink>
        <NavLink
          to="/info"
          className={({ isActive }) =>
            isActive ? "text-blue-500" : "text-gray-700"
          }
        >
          Info
        </NavLink>
        <NavLink
          to="/other"
          className={({ isActive }) =>
            isActive ? "text-blue-500" : "text-gray-700"
          }
        >
          Other
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
