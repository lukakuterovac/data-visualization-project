import { NavLink } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import Switch from "./Switch";
import { useState } from "react";
import { Settings } from "lucide-react";

const Header = () => {
  const { isOn, toggle } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

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
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 text-gray-700"
          >
            <Settings
              size={16}
              className={`transform ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              } transition-transform`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-fit bg-white border rounded-lg shadow-lg z-10">
              <div className="p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="mr-2">Animations</span>
                  <Switch
                    isOn={isOn}
                    handleToggle={toggle}
                    onColor="bg-green-500"
                    offColor="bg-gray-200"
                    onLabel="On"
                    offLabel="Off"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
