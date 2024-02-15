import React from "react"
import BarChart from "./components/BarChart"
import AreaChart from "./components/AreaChart"
import LineChart from './components/LineChart'
import DonutChart from "./components/DonutChart"
import ScatterPlot from "./components/ScatterPlot"
import DonutChart2 from "./components/DonutChart2"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  return (
    <>

      <Navbar />

      <div className="bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col gap-12 p-4 justify-around items-center">
        <BarChart />
        <AreaChart />
        <LineChart />
        <div
          name='sector'>
          <DonutChart />
          <DonutChart2 />
        </div>
      </div>



      <div className="p-4 pt-16">
        <div
          name="relevance"
          className="overflow-x-auto md:flex justify-center items-center border border-gray-700" >

          <ScatterPlot />
        </div>
      </div>
      <Footer />

    </>
  )
}

export default App
