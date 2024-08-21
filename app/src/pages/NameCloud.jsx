import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import names from "../../../dataset/name_counts_per_year.json";
import { Play, Pause, RotateCcw } from "lucide-react";

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
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [pendingWordCloudData, setPendingWordCloudData] = useState([]);

  const years = Object.keys(data).map((year) => +year);
  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const currentYear = years[currentIndex];

  const updateWordCloudData = useCallback(
    (index) => {
      const currentYearData = data[years[index]];
      const wordCloudEntries = Object.entries(currentYearData).map(
        ([name, count]) => ({ text: name, size: count })
      );
      setPendingWordCloudData(wordCloudEntries);
    },
    [data, years]
  );

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % years.length;
          updateWordCloudData(newIndex);
          return newIndex;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, updateWordCloudData, years.length]);

  useEffect(() => {
    updateWordCloudData(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (pendingWordCloudData.length === 0) return;

    const sizeScale = d3
      .scaleLinear()
      .domain([
        d3.min(pendingWordCloudData, (d) => d.size),
        d3.max(pendingWordCloudData, (d) => d.size),
      ])
      .range([10, 100]);

    const layout = cloud()
      .size([800, 400])
      .words(
        pendingWordCloudData.map((d) => ({
          text: d.text,
          size: sizeScale(d.size),
        }))
      )
      .rotate(() => ~~(Math.random() * 2) * 90)
      .fontSize((d) => d.size)
      .font("Arial")
      .padding(4)
      .on("end", (words) => {
        setWordCloudData(words);
      });

    layout.start();
  }, [pendingWordCloudData]);

  useEffect(() => {
    if (wordCloudData.length > 0) {
      draw(wordCloudData);
    }
  }, [wordCloudData]);

  const draw = (words) => {
    const wordCloudSvg = d3.select(wordCloudRef.current);

    wordCloudSvg.selectAll("*").remove();

    wordCloudSvg.attr("width", 800).attr("height", 400);

    const textElements = wordCloudSvg
      .append("g")
      .attr("transform", "translate(400,200)")
      .selectAll("text")
      .data(words);

    textElements
      .enter()
      .append("text")
      .style("font-size", (d) => d.size + "px")
      .style("fill", (d, i) => d3.schemeCategory10[i % 10])
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0,0)rotate(0)")
      .style("opacity", 0)
      .text((d) => d.text)
      .transition()
      .duration(500)
      .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .style("opacity", 1);

    textElements
      .transition()
      .duration(500)
      .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .style("opacity", 1);

    textElements
      .exit()
      .transition()
      .duration(500)
      .attr("transform", "translate(0,0)rotate(0)")
      .style("opacity", 0)
      .remove();
  };

  return (
    <div className="m-3">
      <div className="flex">
        <div className="p-0 m-2">{firstYear}</div>
        <input
          type="range"
          min="0"
          max={years.length - 1}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(+e.target.value)}
          className="w-full"
        />
        <div className="p-0 m-2">{lastYear}</div>
      </div>
      <div className="flex gap-3 w-full justify-center items-center mb-6">
        <div>Current year: {currentYear}</div>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? (
            <div className="flex items-center gap-1 bg-yellow-500 py-1 px-2 rounded-md">
              <Pause size={14} />
              Pause
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-green-500 py-1 px-2 rounded-md text-white">
              <Play size={14} />
              Play
            </div>
          )}
        </button>
        <button
          className="flex items-center gap-1 bg-red-500 py-1 px-2 rounded-md text-white"
          onClick={() => setCurrentIndex(0)}
        >
          <RotateCcw size={14} />
          Reset
        </button>
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(+e.target.value)}
          className="border-2 rounded-md py-1 px-2"
        >
          <option value="2000">0.5x</option>
          <option value="1000">1x</option>
          <option value="500">2x</option>
        </select>
      </div>
      <div className="w-full flex justify-center">
        <svg ref={wordCloudRef}></svg>
      </div>
    </div>
  );
};
