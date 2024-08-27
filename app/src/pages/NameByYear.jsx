/* eslint-disable react/prop-types */
import names from "../../../dataset/name_by_year.json";
import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { ArrowDown01, ArrowDownAZ, ArrowUp01, ArrowUpAZ } from "lucide-react";

const ITEMS_PER_PAGE = 10;
const PAGE_BUTTONS_LIMIT = 5;

const NameByYear = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("Year");
  const [sortOrder, setSortOrder] = useState("Asc");

  const totalPages = Math.ceil(names.length / ITEMS_PER_PAGE);

  const getCurrentData = (data) => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const currentData = data.slice(startIdx, endIdx);

    if (currentData.length < ITEMS_PER_PAGE && startIdx > 0) {
      const missingItemsCount = ITEMS_PER_PAGE - currentData.length;
      const additionalItems = data.slice(
        Math.max(0, startIdx - missingItemsCount),
        startIdx
      );
      return [...additionalItems, ...currentData];
    }

    return currentData;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const startPage = Math.max(
      1,
      Math.min(
        currentPage - Math.floor(PAGE_BUTTONS_LIMIT / 2),
        totalPages - PAGE_BUTTONS_LIMIT + 1
      )
    );
    const endPage = Math.min(totalPages, startPage + PAGE_BUTTONS_LIMIT - 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
          className={`m-2 ${
            i === currentPage ? "text-blue-500" : "text-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="min-w-fit">
        <button
          className="p-2"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className="p-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {pages}
        <button
          className="p-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className="p-2"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    );
  };

  const sortData = (data) => {
    if (sortField === "Year") {
      return data.sort((a, b) => {
        const order = sortOrder === "Asc" ? 1 : -1;
        return order * (Number(a.Year) - Number(b.Year));
      });
    } else if (sortField === "Count") {
      return data.sort((a, b) => {
        const order = sortOrder === "Asc" ? 1 : -1;
        return order * (a.Count - b.Count);
      });
    } else if (sortField === "Name") {
      return data.sort((a, b) => {
        const nameOrder = a.Name.localeCompare(b.Name);
        if (nameOrder === 0) {
          const yearOrder = sortOrder === "Asc" ? 1 : -1;
          return yearOrder * (Number(a.Year) - Number(b.Year));
        }
        return nameOrder;
      });
    } else {
      return data;
    }
  };

  const changeSortOrder = () => {
    setSortOrder(sortOrder === "Asc" ? "Desc" : "Asc");
  };

  const renderSortOptions = () => {
    const fields = ["Year", "Count", "Name"];

    return (
      <div className="flex items-center justify-center gap-2">
        <div>Sort by:</div>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="p-2 border rounded-md"
        >
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
        <button onClick={changeSortOrder}>
          {sortField === "Name" ? (
            sortOrder === "Asc" ? (
              <ArrowDownAZ size={20} />
            ) : (
              <ArrowUpAZ size={20} />
            )
          ) : sortOrder === "Asc" ? (
            <ArrowDown01 size={20} />
          ) : (
            <ArrowUp01 size={20} />
          )}
        </button>
      </div>
    );
  };

  const currentData = getCurrentData(sortData(names));

  return (
    <div className="my-3">
      <h1 className="text-center text-3xl">Most popular baby name each year</h1>
      <div className="min-h-fit">
        <div className="w-full min-h-full p-2 flex justify-evenly">
          <div className="flex flex-col items-center">
            {renderSortOptions()}
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-center">Year</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Gender</th>
                  <th className="text-center">Count</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{item.Year}</td>
                    <td className="text-center">{item.Name}</td>
                    <td className="text-center">{item.Gender}</td>
                    <td className="text-center">{item.Count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPaginationButtons()}
          </div>
          <BarChart data={currentData} />
        </div>
      </div>
    </div>
  );
};

export default NameByYear;

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 50, left: 70 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .select("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.selectAll("*").remove();

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.Year))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Count)])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("dy", "1em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(y));

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

    const bars = svg.selectAll(".bar").data(data);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.Year))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d) => (d.Gender === "M" ? "#3b82f6" : "#f9a8d4"))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`${d.Count}`)
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .merge(bars)
      .transition()
      .duration(750)
      .delay((d, i) => i * 50)
      .attr("y", (d) => y(d.Count))
      .attr("height", (d) => height - y(d.Count));

    bars
      .exit()
      .transition()
      .duration(750)
      .attr("y", height)
      .attr("height", 0)
      .remove();

    svg
      .append("text")
      .attr("transform", `translate(${width / 2},${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .text("Year");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Count");

    const labels = svg.selectAll(".bar-label").data(data);

    labels
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x(d.Year) + x.bandwidth() / 2)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .merge(labels)
      .transition()
      .duration(750)
      .delay((d, i) => i * 50)
      .attr("y", (d) => y(d.Count) - 5)
      .text((d) => d.Name);

    labels.exit().remove();
  }, [data]);

  return (
    <div ref={chartRef}>
      <svg width={800} height={400}>
        <g></g>
      </svg>
    </div>
  );
};
