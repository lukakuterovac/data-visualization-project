import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="rounded-lg shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">US Baby Names Visualization</h1>
      <div className="flex justify-center items-center gap-3">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/name-cloud">Name Cloud</Link>
        <Link to="/name-by-year">Name By Year</Link>
        <Link to="/info">Info</Link>
        <Link to="/other">Other</Link>
      </div>
    </header>
  );
};

export default Header;
