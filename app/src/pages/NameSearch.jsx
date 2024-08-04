import { useState, useEffect, useRef } from "react";
import names from "../../../dataset/names_data.json";
import * as d3 from "d3";
import { useAnimation } from "../contexts/AnimationContext";

const NameSearch = () => {
  const [name, setName] = useState("");
  const [data, setData] = useState({});
  const [selectedName, setSelectedName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [secondData, setSecondData] = useState({});
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
    if (selectedName === "") {
      setSelectedName(name);
      setData(data);
    } else if (secondName === "") {
      if (selectedName === name) {
        setSelectedName("");
        setData({});
      } else {
        setSecondName(name);
        setSecondData(data);
      }
    } else if (selectedName === name) {
      setSelectedName(secondName);
      setData(secondData);
      setSecondName("");
      setSecondData({});
    } else if (secondName === name) {
      setSecondName("");
      setSecondData({});
    } else {
      setSecondName(name);
      setSecondData(data);
    }
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

  const handleDeselect = (name) => {
    return () => {
      if (selectedName === name) {
        setSelectedName(secondName);
        setData(secondData);
        setSecondName("");
        setSecondData({});
      } else if (secondName === name) {
        setSecondName("");
        setSecondData({});
      }
    };
  };

  return (
    <div className="flex m-3">
      <div className="w-1/3 flex flex-col items-center">
        <div className="flex items-center w-full">
          <input
            type="text"
            className="border-2 border-gray-300 rounded-lg p-2 mr-2 flex-grow"
            placeholder="Search for a name"
            value={name}
            onChange={(e) => handleUpdate(e.target.value)}
          />
          {selectedName && (
            <button
              className="mr-2 rounded-lg bg-red-500 text-white p-2 flex-grow min-w-fit"
              onClick={handleDeselect(selectedName)}
            >
              {selectedName}
            </button>
          )}
          {secondName && (
            <button
              className="rounded-lg bg-red-500 text-white p-2 flex-grow min-w-fit"
              onClick={handleDeselect(secondName)}
            >
              {secondName}
            </button>
          )}
        </div>
        <div className="w-full">
          {currentResults.map(({ name, data }) => (
            <div key={name} className="w-full">
              <div
                onClick={() => {
                  handleNameClick(name, data);
                }}
                className={`cursor-pointer p-2 rounded-lg my-2 w-full text-center ${
                  selectedName === name || secondName === name
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {name}
              </div>
            </div>
          ))}
        </div>
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
      <div className="w-2/3 flex flex-col items-center justify-center">
        <Info
          name={selectedName}
          data={data}
          secondName={secondName}
          secondData={secondData}
        />
      </div>
    </div>
  );
};

export default NameSearch;

const Info = ({ name, data, secondName, secondData }) => {
  const [selectedGender, setSelectedGender] = useState("");

  useEffect(() => {
    if (data && data["M"]) {
      setSelectedGender("M");
    } else if (data && data["F"]) {
      setSelectedGender("F");
    }
  }, [data]);

  useEffect(() => {
    if (secondData && secondData["M"] && data && data["M"]) {
      setSelectedGender("M");
    } else if (secondData && secondData["F"] && data && data["F"]) {
      setSelectedGender("F");
    }
  }, [secondData]);

  if (!data || Object.keys(data).length === 0) {
    return <div className="text-3xl">Please select a name.</div>;
  }

  const maleData = data["M"] ? data["M"].Data : [];
  const femaleData = data["F"] ? data["F"].Data : [];
  const secondMaleData = secondData["M"] ? secondData["M"].Data : [];
  const secondFemaleData = secondData["F"] ? secondData["F"].Data : [];

  const bothHaveMale = maleData.length > 0 && secondMaleData.length > 0;
  const bothHaveFemale = femaleData.length > 0 && secondFemaleData.length > 0;

  if (secondName && !bothHaveMale && !bothHaveFemale) {
    return (
      <div className="text-3xl">
        {name} and {secondName} do not have any data for the same gender
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl">
        <span
          className={selectedGender === "F" ? "text-pink-300" : "text-blue-500"}
        >
          {name}
        </span>
        {secondName && (
          <>
            <span className="text-gray-700"> vs </span>
            <span
              className={
                selectedGender === "F" ? "text-pink-600" : "text-blue-800"
              }
            >
              {secondName}
            </span>
          </>
        )}
      </div>
      <div className="flex gap-3">
        {!secondName && maleData.length > 0 && (
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
        {!secondName && femaleData.length > 0 && (
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
        {secondName && bothHaveMale && (
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
        {secondName && bothHaveFemale && (
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
          {maleData.length > 0 && (
            <NameGraph
              name={name}
              data={maleData}
              secondName={secondName}
              secondData={secondMaleData}
              gender={"M"}
            />
          )}
        </>
      )}
      {selectedGender === "F" && (
        <>
          {femaleData.length > 0 && (
            <NameGraph
              name={name}
              data={femaleData}
              secondName={secondName}
              secondData={secondFemaleData}
              gender={"F"}
            />
          )}
        </>
      )}
    </div>
  );
};

const NameGraph = ({ name, data, secondName, secondData, gender }) => {
  const svgRef = useRef();
  const { animationsEnabled, animationSpeed } = useAnimation();

  useEffect(() => {
    if (!name && !secondName) return;

    const primaryData = data || [];
    const secondaryData = secondData || [];

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = +svg.attr("width") - (margin.left + margin.right + 20);
    const height = +svg.attr("height") - (margin.top + margin.bottom + 20);

    const years = Array.from(
      new Set([
        ...primaryData.map((d) => d.Year),
        ...secondaryData.map((d) => d.Year),
      ])
    ).sort();

    const primaryCounts = primaryData.reduce((acc, curr) => {
      acc[curr.Year] = curr.Count;
      return acc;
    }, {});

    const secondaryCounts = secondaryData.reduce((acc, curr) => {
      acc[curr.Year] = curr.Count;
      return acc;
    }, {});

    const combinedCounts = years.map((year) => ({
      year,
      primary: primaryCounts[year] || 0,
      secondary: secondaryCounts[year] || 0,
    }));

    const xScale = d3
      .scaleBand()
      .domain(years.map(String))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(combinedCounts, (d) => Math.max(d.primary, d.secondary)),
      ])
      .nice()
      .range([height, 0]);

    const barWidth = Math.min(30, width / years.length); // Limit bar width to 30px or divide width evenly

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left + 30},${margin.top})`);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    g.selectAll(".bar.primary")
      .data(combinedCounts)
      .enter()
      .append("rect")
      .attr("class", "bar primary")
      .attr(
        "x",
        (d) => xScale(String(d.year)) + (xScale.bandwidth() - barWidth) / 2
      )
      .attr("y", height)
      .attr("width", barWidth / 2)
      .attr("height", 0)
      .attr("fill", gender === "M" ? "#3b82f6" : "#f9a8d4")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(300).style("opacity", 1);
        tooltip
          .html(`Name: ${name}<br>Year: ${d.year}<br>Count: ${d.primary}`)
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(animationsEnabled ? 750 * Math.pow(animationSpeed, -1) : 0)
      .delay((d, i) =>
        animationsEnabled ? i * 50 * Math.pow(animationSpeed, -1) * 2 : 0
      )
      .attr("y", (d) => yScale(d.primary))
      .attr("height", (d) => height - yScale(d.primary));

    if (secondData.length > 0) {
      g.selectAll(".bar.secondary")
        .data(combinedCounts)
        .enter()
        .append("rect")
        .attr("class", "bar secondary")
        .attr(
          "x",
          (d) =>
            xScale(String(d.year)) +
            (xScale.bandwidth() - barWidth) / 2 +
            barWidth / 2
        )
        .attr("y", height)
        .attr("width", barWidth / 2)
        .attr("height", 0)
        .attr("fill", gender === "M" ? "#1e40af" : "#db2777")
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip
            .html(
              `Name: ${secondName}<br>Year: ${d.year}<br>Count: ${d.secondary}`
            )
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        })
        .transition()
        .duration(animationsEnabled ? 750 * Math.pow(animationSpeed, -1) : 0)
        .delay((d, i) =>
          animationsEnabled ? i * 50 * Math.pow(animationSpeed, -1) * 2 : 0
        )
        .attr("y", (d) => yScale(d.secondary))
        .attr("height", (d) => height - yScale(d.secondary));
    }

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

    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

    // Add x-axis label
    svg
      .append("text")
      .attr(
        "transform",
        `translate(${width / 2 + margin.left + 30},${height + margin.top + 50})`
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
  }, [name, secondName, gender, data, secondData]);

  return <svg ref={svgRef} width={500} height={500}></svg>;
};
