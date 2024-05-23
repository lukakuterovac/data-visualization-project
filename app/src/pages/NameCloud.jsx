/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import names from "../../../dataset/name_counts_per_year.json";

const NameCloud = () => {
  return (
    <div className="my-3">
      <TimelineWithWordCloud data={names} />
    </div>
  );
};

export default NameCloud;

const TimelineWithWordCloud = ({ data }) => {
  const wordCloudRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordCloudData, setWordCloudData] = useState([]);
  const [wordCloudPositions, setWordCloudPositions] = useState([]);

  const years = Object.keys(data).map((year) => +year);

  useEffect(() => {
    const updateWordCloudData = (index) => {
      const currentYearData = data[years[index]];
      const wordCloudEntries = Object.entries(currentYearData).map(
        ([name, count]) => ({ text: name, size: count })
      );
      setWordCloudData(wordCloudEntries);
    };

    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % years.length;
          updateWordCloudData(newIndex);
          return newIndex;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      updateWordCloudData(currentIndex);
    }
  }, [isPlaying, currentIndex, data]);

  useEffect(() => {
    if (wordCloudData.length === 0) return;

    const sizeScale = d3
      .scaleLinear()
      .domain([
        d3.min(wordCloudData, (d) => d.size),
        d3.max(wordCloudData, (d) => d.size),
      ])
      .range([10, 100]);

    const layout = cloud()
      .size([800, 400])
      .words(
        wordCloudData.map((d) => ({ text: d.text, size: sizeScale(d.size) }))
      )
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font("Impact")
      .fontSize((d) => d.size)
      .on("end", (words) => {
        setWordCloudPositions(words);
        draw(words);
      });

    layout.start();
  }, [wordCloudData]);

  useEffect(() => {
    if (wordCloudPositions.length > 0) {
      draw(wordCloudPositions);
    }
  }, [wordCloudPositions]);

  const draw = (words) => {
    const wordCloudSvg = d3.select(wordCloudRef.current);
    wordCloudSvg.selectAll("*").remove(); // Clear previous elements

    wordCloudSvg
      .attr("width", 800)
      .attr("height", 400)
      .append("g")
      .attr("transform", "translate(400,200)")
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", (d) => d.size + "px")
      .style("font-family", "Impact")
      .style("fill", (d, i) => d3.schemeCategory10[i % 10])
      .attr("text-anchor", "middle")
      .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .text((d) => d.text);
  };

  return (
    <div>
      <input
        type="range"
        min="0"
        max={years.length - 1}
        value={currentIndex}
        onChange={(e) => setCurrentIndex(+e.target.value)}
      />
      <div>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={() => setCurrentIndex(0)}>Reset</button>
      </div>
      <svg ref={wordCloudRef}></svg>
      <div>Year: {years[currentIndex]}</div>
    </div>
  );
};
