import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Info from "./pages/Info";
import NotFound from "./pages/NotFound";
import NameByYear from "./pages/NameByYear.jsx";
import NameSearch from "./pages/NameSearch.jsx";
import NameCloud from "./pages/NameCloud.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/search" element={<NameSearch />} />
          <Route path="/name-cloud" element={<NameCloud />} />
          <Route path="/name-by-year" element={<NameByYear />} />
          <Route path="/info" element={<Info />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
