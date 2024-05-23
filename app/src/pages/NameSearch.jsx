/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import names from "../../../dataset/names_data.json";
import * as d3 from "d3";

const NameSearch = () => {
  const [name, setName] = useState("");
  const [data, setData] = useState({});
  const [secondData, setSecondData] = useState({});
  const [selectedName, setSelectedName] = useState("");
  const [secondSelectedName, setSecondSelectedName] = useState("");
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
    if (name === selectedName) {
      setSelectedName("");
      setData({});
      return;
    }
    if (name === secondSelectedName) {
      setSecondSelectedName("");
      setSecondData({});
      return;
    }

    if (selectedName) {
      setSecondSelectedName(name);
      setSecondData(data);
      return;
    } else {
      setSelectedName(name);
      setData(data);
    }
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex my-3">
      <div className="w-1/2 flex flex-col items-center">
        <div className="flex items-center">
          <input
            type="text"
            className="border-2 border-gray-300 rounded-lg p-2 mr-2 w-[300px]"
            placeholder="Search for a name"
            value={name}
            onChange={(e) => handleUpdate(e.target.value)}
          />
        </div>
        <div>
          {/* Render the current page of search results */}
          {currentResults.map(({ name, data }) => (
            <div key={name}>
              <div
                onClick={() => {
                  handleNameClick(name, data);
                }}
                className={`cursor-pointer bg-gray-200 p-2 rounded-lg my-2 w-[300px] text-center ${
                  selectedName === name || secondSelectedName === name
                    ? "bg-green-500 text-white"
                    : ""
                }`}
              >
                {name}
              </div>
            </div>
          ))}
        </div>
        {/* Pagination controls */}
        <div className="flex mt-4">
          {searchResults.length > resultsPerPage && (
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2 px-4 py-2 bg-gray-200 rounded-lg"
            >
              Previous
            </button>
          )}
          {searchResults.length > resultsPerPage && (
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastResult >= searchResults.length}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Next
            </button>
          )}
        </div>
      </div>
      <div className="w-1/2 flex flex-col items-center">
        <Info
          name={selectedName}
          data={data}
          secondName={secondSelectedName}
          secondData={secondData}
        />
      </div>
    </div>
  );
};

export default NameSearch;

const Info = ({ name, data, secondName, secondData }) => {
  const [selectedGender, setSelectedGender] = useState("M");

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
            className={`cursor-pointer bg-gray-200 p-2 rounded-lg my-2 w-[100px] text-center ${
              selectedGender === "M" ? "bg-blue-500 text-white" : ""
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
            className={`cursor-pointer bg-gray-200 p-2 rounded-lg my-2 w-[100px] text-center ${
              selectedGender === "F" ? "bg-pink-300 text-white" : ""
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
      .attr("transform", `translate(${margin.left + 15},${margin.top})`);

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
      .attr("fill", gender === "M" ? "steelblue" : "pink")
      .transition()
      .duration(750)
      .delay((d, i) => i * 50)
      .attr("y", (d) => yScale(d.Count))
      .attr("height", (d) => height - yScale(d.Count));

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
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
