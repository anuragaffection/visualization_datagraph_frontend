import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios'

const AreaChart = () => {
    const chartRef = useRef();
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3070/lm');
                const sortedData = response.data.data.slice().sort((a, b) => {
                    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    return months.indexOf(a.month) - months.indexOf(b.month);
                });
                setData(sortedData);
            } catch (error) {
                throw error
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        // Declare the chart dimensions and margins.
        const width = 928;
        const height = 500;
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;

        // declare the horizontal  scale 
        const x = d3.scaleBand()
            .domain(data.map(d => d.month))
            .range([marginLeft, width - marginRight])
            .padding(0.1);

        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear([0, d3.max(data, d => d.sumOfLikelihoodOfmonth)], [height - marginBottom, marginTop]);

        // Declare the area generator.
        const area = d3.area()
            .x(d => x(d.month))
            .y0(y(0))
            .y1(d => y(d.sumOfLikelihoodOfmonth));

        // Create the SVG container.
        const svg = d3.select(chartRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        // Append a path for the area (under the axes).
        svg.append("path")
            .attr("fill", "steelblue")
            .attr("d", area(data));

        // Add the x-axis.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        // Add the y-axis, remove the domain line, add grid lines and a label.
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(height / 40))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ sum Of Likelihood "));
    }, [data]);

    return (
        <div
            name='yearAdded'
            className='pt-12'>

            <div
                className='flex flex-col gap-4 border border-gray-700 p-4 text-lg'>
                <div className='flex justify-center items-center'>
                    <div className='flex flex-col gap-2'>
                        <div
                            className='text-xl text-amber-600 font-bold'
                        >
                            Sum of Likelihood in Month
                        </div>
                        <div> Area Graph of Likelihood & Added Year  </div>
                    </div>
                </div>
                <svg ref={chartRef}></svg>
            </div>
        </div>
    )
}

export default AreaChart;
