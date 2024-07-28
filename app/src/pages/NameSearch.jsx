/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import names from "../../../dataset/names_data.json";
import * as d3 from "d3";

const NameSearch = () => {
  const [name, setName] = useState("");
  const [data, setData] = useState({});
  const [selectedName, setSelectedName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const resultsPerPage = 10;

  useEffect(() => {
    setSearchResults(
      Object.keys(names).map((key) => ({ name: key, data: names[key] }))
    );
  }, []);

  const handleUpdate = (name) => {
    setName(name);
    if (name === "") {
      setSearchResults(
        Object.keys(names).map((key) => ({ name: key, data: names[key] }))
      );
      return;
    }

    const filteredResults = Object.keys(names)
      .filter((key) => key.toLowerCase().includes(name.toLowerCase()))
      .map((key) => ({ name: key, data: names[key] }));
    setSearchResults(filteredResults);
    setCurrentPage(1);
  };

  const handleNameClick = (name, data) => {
    setSelectedName(name);
    setData(data);
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPaginationRange = () => {
    const totalVisiblePages = 5;
    const halfVisiblePages = Math.floor(totalVisiblePages / 2);
    let start = Math.max(1, currentPage - halfVisiblePages);
    let end = Math.min(totalPages, currentPage + halfVisiblePages);

    if (end - start < totalVisiblePages - 1) {
      start = Math.max(1, end - totalVisiblePages + 1);
    }

    if (end - start < totalVisiblePages - 1) {
      end = Math.min(totalPages, start + totalVisiblePages - 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="flex m-3">
      <div className="w-1/3 flex flex-col items-center">
        <div className="flex items-center w-full">
          <input
            type="text"
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
            placeholder="Search for a name"
            value={name}
            onChange={(e) => handleUpdate(e.target.value)}
          />
        </div>
        <div className="w-full">
          {/* Render the current page of search results */}
          {currentResults.map(({ name, data }) => (
            <div key={name} className="w-full">
              <div
                onClick={() => {
                  handleNameClick(name, data);
                }}
                className={`cursor-pointer p-2 rounded-lg my-2 w-full text-center ${
                  selectedName === name
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {name}
              </div>
            </div>
          ))}
        </div>
        {/* Pagination controls */}
        <div className="flex mt-4 space-x-1 w-full justify-center">
          {currentPage > 1 && (
            <>
              <button onClick={() => paginate(1)} className="px-2 py-1 text-sm">
                First
              </button>
              <button
                onClick={() => paginate(currentPage - 1)}
                className="px-2 py-1 text-sm"
              >
                Previous
              </button>
            </>
          )}
          {paginationRange.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`${
                currentPage === number ? "text-blue-500" : "text-gray-200"
              } text-sm`}
            >
              {number}
            </button>
          ))}
          <input
            type="text"
            className="w-12 p-1 m-1 border border-gray-500 rounded-md"
            onChange={(e) => {
              const pageNumber = parseInt(e.target.value);
              if (pageNumber >= 1 && pageNumber <= totalPages) {
                paginate(pageNumber);
              }
            }}
          />
          {currentPage < totalPages && (
            <>
              <button
                onClick={() => paginate(currentPage + 1)}
                className="px-2 py-1 text-sm"
              >
                Next
              </button>
              <button
                onClick={() => paginate(totalPages)}
                className="px-2 py-1 text-sm"
              >
                Last
              </button>
            </>
          )}
        </div>
      </div>
      <div className="w-2/3 flex flex-col items-center">
        <Info name={selectedName} data={data} />
      </div>
    </div>
  );
};

export default NameSearch;

const Info = ({ name, data }) => {
  const [selectedGender, setSelectedGender] = useState("");

  useEffect(() => {
    if (data) {
      if (data["M"]) {
        setSelectedGender("M");
      } else if (data["F"]) {
        setSelectedGender("F");
      }
    }
  }, [data]);

  if (!data || Object.keys(data).length === 0) {
    return <div className="text-3xl">Please select a name.</div>;
  }

  const maleData = data["M"];
  const femaleData = data["F"];

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl">{name}</div>
      <div className="flex gap-3">
        {maleData && (
          <div
            className={`cursor-pointer p-2 rounded-lg my-2 w-[100px] text-center ${
              selectedGender === "M" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => {
              setSelectedGender("M");
            }}
          >
            Male
          </div>
        )}
        {femaleData && (
          <div
            className={`cursor-pointer p-2 rounded-lg my-2 w-[100px] text-center ${
              selectedGender === "F" ? "bg-pink-300 text-white" : "bg-gray-200"
            }`}
            onClick={() => {
              setSelectedGender("F");
            }}
          >
            Female
          </div>
        )}
      </div>
      {selectedGender === "M" && (
        <>
          {maleData && (
            <>
              <NameGraph name={name} gender={"M"} />
            </>
          )}
        </>
      )}
      {selectedGender === "F" && (
        <>
          {femaleData && (
            <>
              <NameGraph name={name} gender={"F"} />
            </>
          )}
        </>
      )}
    </div>
  );
};

const NameGraph = ({ name, gender }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!name || !gender || !names[name]) return;

    const data = names[name];
    const dataByGender = data[gender] && data[gender]["Data"];

    if (!dataByGender) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous elements

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = +svg.attr("width") - (margin.left + margin.right + 20);
    const height = +svg.attr("height") - (margin.top + margin.bottom + 20);

    const years = dataByGender.map((d) => d.Year);
    const counts = dataByGender.map((d) => d.Count);

    const xScale = d3
      .scaleBand()
      .domain(years.map(String))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(counts)])
      .nice()
      .range([height, 0]);

    const barWidth = Math.min(30, width / years.length); // Limit bar width to 30px or divide width evenly

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left + 30},${margin.top})`);

    g.selectAll(".bar")
      .data(dataByGender)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr(
        "x",
        (d) => xScale(String(d.Year)) + (xScale.bandwidth() - barWidth) / 2
      )
      .attr("y", height)
      .attr("width", barWidth)
      .attr("height", 0)
      .attr("fill", gender === "M" ? "#3b82f6" : "#f9a8d4")
      .transition()
      .duration(750)
      .delay((d, i) => i * 50)
      .attr("y", (d) => yScale(d.Count))
      .attr("height", (d) => height - yScale(d.Count));

    // Determine n based on the number of years
    const n = Math.ceil(years.length / 10);

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues(xScale.domain().filter((d, i) => !(i % n)))
      )
      .selectAll("text")
      .attr("dy", "1em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    // Add x-axis label
    svg
      .append("text")
      .attr(
        "transform",
        `translate(${width / 2 + margin.left},${height + margin.top + 50})`
      )
      .style("text-anchor", "middle")
      .text("Year");

    // Add y-axis label
    svg
      .append("text")
      .attr(
        "transform",
        `translate(${margin.left - 20},${height / 2 + margin.top}) rotate(-90)`
      )
      .style("text-anchor", "middle")
      .text("Count");
  }, [name, gender]);

  return <svg ref={svgRef} width={500} height={500}></svg>;
};
