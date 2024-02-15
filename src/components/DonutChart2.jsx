import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';


const width = 800;

const DonutChart2 = () => {

    const chartRef = useRef();
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3070/st');
                const responseArray = response.data.data;
                const sortedData = responseArray.sort((a, b) => b.title.length - a.title.length);
                const filterData = sortedData.filter((d) => d.sector !== "" && (d.title.length < 20 && d.title.length > 4));
                setData(filterData)
            } catch (error) {
                throw error
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const height = Math.min(width, 500);
        const radius = Math.min(width, height) / 2;

        const arc = d3.arc()
            .innerRadius(radius * 0.67)
            .outerRadius(radius - 1);

        const pie = d3.pie()
            .padAngle(1 / radius)
            .sort(null)
            .value(d => d.title.length);

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.sector))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

        const svg = d3.select(chartRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        svg.append("g")
            .selectAll()
            .data(pie(data))
            .join("path")
            .attr("fill", d => color(d.data.sector))
            .attr("d", arc)
            .append("title")
            .text(d => `${d.data.sector}: ${d.data.title.length.toLocaleString()}`);

        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "middle")
            .selectAll()
            .data(pie(data))
            .join("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .call(text => text.append("tspan")
                .attr("y", "-0.4em")
                .attr("font-weight", "bold")
                .text(d => d.data.sector))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                .text(d => d.data.title.length.toLocaleString("en-US")));
    }, [data]);

    return (
        <div className='pt-12'>
            <div
                className='flex flex-col gap-4 border border-gray-700 p-4 text-lg'>
                <div className='flex justify-center items-center'>
                    <div className='flex flex-col gap-2'>
                        <div
                            className='text-xl text-amber-600 font-bold'
                        >
                            Sector a/q to Title
                        </div>
                        <div> Sector & their Title Count  </div>
                    </div>
                </div>
                <svg ref={chartRef}></svg>
            </div>
        </div>
    )
};

export default DonutChart2;
