import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios'
import SelectWithOption from './SelectWithOption';

const BarChart = () => {
    const chartRef = useRef();
    const [data, setData] = useState([]);
    const [fullData, setFullData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3070/topic', {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true,
                });
                setData(response.data.data.filter(d => d.topic !== '').slice(0, 7));
                setFullData(response.data.data.filter(d => d.topic !== ""));
            } catch (error) {
                console.log("error = ", error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const width = 928;
        const height = 500;
        const marginTop = 30;
        const marginRight = 0;
        const marginBottom = 30;
        const marginLeft = 40;

        const x = d3.scaleBand()
            .domain(d3.groupSort(data, ([d]) => -d.count, (d) => d.topic))
            .range([marginLeft, width - marginRight])
            .padding(0.2);

        // replacing - d3.max(data, (d) => d.count)
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.count) + 100])
            .range([height - marginBottom, marginTop]);

        // use of useRef 
        // svg is auto responsive - check it 
        // viewBox in svg 
        // this is the main svg container 
        const svg = d3.select(chartRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
            .attr('style', 'max-width: 100%; height: auto;');

        // this  is the actual chart svg 
        // rect = rectangle 
        // .attr('height', (d) => height - marginBottom - y(d.count))
        svg.append('g')
            .attr('fill', 'steelblue')
            .selectAll()
            .data(data)
            .join('rect')
            .attr('x', (d) => x(d.topic))
            .attr('y', (d) => y(d.count))
            .attr('height', (d) => y(0) - y(d.count))
            .attr('width', x.bandwidth())
            .on('mouseover', (event, d) => {
                svg.select('g.text-labels')
                    .selectAll('text')
                    .data([d])
                    .join('text')
                    .attr('class', 'count-label')
                    .text((d) => d.count)
                    .attr('x', x(d.topic) + x.bandwidth() / 2)
                    .attr('y', y(d.count) - 5)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'white')
                    .style('font-size', '12px');
            })
            .on('mouseout', () => {
                svg.select('g.text-labels').selectAll('.count-label').remove();
            });


        // this svg is of x-axis 
        svg.append('g')
            .attr('transform', `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .call((g) => g.append('text')
                .attr('x', width - 50)
                .attr('y', marginBottom - 5)
                .attr('fill', 'currentColor')
                .attr('text-anchor', 'start')
                .text('topic -> '));

        // this svg is of y-axis 
        svg.append('g')
            .attr('transform', `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickFormat((y) => (y * 1).toFixed()))
            .call((g) => g.select('.domain').remove())
            .call((g) => g.append('text')
                .attr('x', -marginLeft)
                .attr('y', 10)
                .attr('fill', 'currentColor')
                .attr('text-anchor', 'start')
                .text('↑ count '));

        // text , after hovering on bar 
        svg.append('g')
            .attr('class', 'text-labels');

    }, [data]);

    return (
        <div
            name='topics'
            className='pt-12 '
        >
            <div
                className='flex flex-col gap-4 border border-gray-700 p-4 text-lg'>
                <div className='flex justify-center items-center'>
                    <div className='flex flex-col gap-2'>
                        <div
                            className='text-xl text-amber-600 font-bold'
                        >
                            Top 7 Topics with Frequency
                        </div>
                        <div> Count of Topics in Bar Chart  </div>
                    </div>
                </div>
                <svg ref={chartRef}></svg>

                <div>
                    <div> Frequency of each Topic </div>
                    <div>
                        <SelectWithOption fullData={fullData} />
                    </div>
                </div>
            </div>
        </div >
    )
};

export default BarChart;
