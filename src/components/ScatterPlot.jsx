import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const ScatterPlot = () => {
    const chartRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3070/ir', {
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                setData(response.data.data);
                // console.log(response.data.data)
            } catch (error) {
                throw error;
                // console.log("error = ", error)
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const width = 500;
        const height = 500;
        const svg = d3.select(chartRef.current);

        if (data.length === 0) {
            return;  // Data is not available yet, don't render the chart
        }
        else {
            console.log("useEffect ran");

            const svgContainer = svg.select("g");
            if (svgContainer.empty()) {
                // Append SVG Object to the Page if not already present
                svg.append('svg')
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(40, 40)")
                    .attr('viewBox', [0, 0, width, height])
                    .attr('style', 'max-width: 100%; height: auto;');

                // X Axis
                const xScale = d3.scaleLinear()
                    .domain([0, d3.max(data, (d) => d[0])])
                    .range([0, 420]);

                // .ticks(20).tickFormat(d3.format('.0f'))
                svg.select("g")
                    .append("g")
                    .attr("transform", "translate(0, 420)")
                    .call(d3.axisBottom(xScale))
                    .call((g) => g.append('text')
                        .attr('x', 400)
                        .attr('y', 40)
                        .attr('fill', 'currentColor')
                        .attr('text-anchor', 'start')
                        .text('Intensity -> '));

                // Y Axis
                const yScale = d3.scaleLinear()
                    .domain([0, 10])
                    .range([420, 0]);

                svg.select("g")
                    .append("g")
                    .call(d3.axisLeft(yScale))
                    .call((g) => g.append('text')
                        .attr('x', -40)
                        .attr('y', -20)
                        .attr('fill', 'currentColor')
                        .attr('text-anchor', 'start')
                        .text('↑ Relevance '));


                // Dots
                svg.select("g")
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", d => xScale(d[0])) // intensity 
                    .attr("cy", d => yScale(d[1])) // relevance 
                    .attr("r", 3)
                    .style("fill", "Red");
            }
        }
    }, [data]);


    return (
        <div className='p-4' >
            <div className='flex justify-center items-center'>
                <div className='flex flex-col gap-2'>
                    <div
                        className='text-xl text-amber-600 font-bold'
                    >
                        Relevance vs Intensity 
                    </div>
                    <div> Dot Graph of Relevance & Intensity  </div>
                </div>
            </div>
            <div ref={chartRef}></div>
        </div>
    )


};

export default ScatterPlot;