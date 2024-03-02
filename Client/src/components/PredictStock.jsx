// import React from "react";
// import ReactApexChart from "react-apexcharts";

// function downsample(array, step) {
//   return array.filter((element, index) => index % step === 0);
// }

// class PredictStock extends React.Component {
//   constructor(props) {
//     super(props);

//     const data = this.props.msg;
//     const keys = Object.keys(data);
//     const [futureStock, presentStock] = keys;
//     const stockData1 = data[presentStock];
//     const stockData2 = data[futureStock];

//     // Convert and downsample stockData1 and stockData2
//     const desiredPoints = 50; // Adjust as needed
//     const downsampledData1 = this.downsampleData(stockData1, desiredPoints);
//     const downsampledData2 = this.downsampleData(stockData2, desiredPoints);

//     this.state = {
//       series: [
//         {
//           name: presentStock,
//           data: downsampledData1,
//         },
//         {
//           name: futureStock,
//           data: downsampledData2,
//         },
//       ],
//       options: {
//         chart: {
//           type: "line",
//           height: 350,
//           zoom: {
//             enabled: true,
//           },
//         },
//         title: {
//           text: "Stock Price Movement",
//           align: "left",
//         },
//         yaxis: {
//           title: {
//             text: "Price",
//           },
//           labels: {
//             formatter: function (value) {
//               // Round the value to one decimal place and return
//               return value.toFixed(1);
//             },
//           },
//         },
//         xaxis: {
//           type: "datetime",
//           title: {
//             text: "Date",
//           },
//         },
//         stroke: {
//           curve: "smooth",
//           width: 2,
//         },
//         tooltip: {
//           x: {
//             format: "dd MMM yyyy",
//           },
//         },
//       },
//     };
//   }

//   downsampleData(stockData, desiredPoints) {
//     const dataArray = Object.entries(stockData).map(([date, value]) => ({
//       x: date,
//       y: parseFloat(value),
//     }));
//     const step = Math.ceil(dataArray.length / desiredPoints);
//     return downsample(dataArray, step);
//   }

//   render() {
//     return (
//       <div id="chart">
//         <ReactApexChart
//           options={this.state.options}
//           series={this.state.series}
//           type="line"
//           height={400}
//         />
//       </div>
//     );
//   }
// }

// export default PredictStock;

// ================================================= Function component =======

import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function downsample(array, step) {
  // Check if array is an array
  if (!Array.isArray(array)) {
    console.error("Input is not an array");
    return [];
  }

  // Check if array has filter method
  if (typeof array.filter !== "function") {
    console.error("Input array does not have a filter method");
    return [];
  }

  return array.filter((element, index) => index % step === 0);
}

const PredictStock = (props) => {
  const [chartData, setChartData] = useState({ series: [], options: {} });

  useEffect(() => {
    if (props.msg) {
      const data = props.msg;
      const keys = Object.keys(data);
      const [futureStock, presentStock] = keys;
      const stockData1 = data[presentStock];
      const stockData2 = data[futureStock];

      const desiredPoints1 = 50; // Adjust as needed for stockData1
      const desiredPoints2 = 1; // Adjust as needed for stockData2

      const downsampledData1 = downsample(
        Object.entries(stockData1),
        desiredPoints1
      );
      const downsampledData2 = downsample(
        Object.entries(stockData2),
        desiredPoints2
      );

      setChartData({
        series: [
          { name: presentStock, data: downsampledData1 },
          { name: futureStock, data: downsampledData2 },
        ],
        options: {
          chart: { type: "line", height: 350, zoom: { enabled: true } },
          title: { text: "Stock Price Movement", align: "left" },
          yaxis: {
            title: { text: "Price" },
            labels: {
              formatter: (value) => value.toFixed(1),
            },
          },
          xaxis: { type: "datetime", title: { text: "Date" } },
          stroke: { curve: "smooth", width: 2 },
          tooltip: { x: { format: "dd MMM yyyy" } },
        },
      });
    }
  }, [props.msg]);

  return (
    <div id="chart">
      {chartData.series.length > 0 && (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={400}
        />
      )}
    </div>
  );
};

// const PredictStock = (props) => {
//   const [chartData, setChartData] = useState({ series: [], options: {} });

//   useEffect(() => {
//     if (props.msg) {
//       const data = props.msg;
//       const keys = Object.keys(data);
//       const [futureStock, presentStock] = keys;
//       const stockData1 = data[presentStock];
//       const stockData2 = data[futureStock];

//       const desiredPoints = 50;
//       // const downsampledData1 = downsample(stockData1, desiredPoints);
//       // const downsampledData2 = downsample(stockData2, desiredPoints);

//       const downsampledData1 = downsample(
//         Object.entries(stockData1),
//         desiredPoints
//       );
//       // const downsampledData2 = stockData2;
//       const downsampledData2 = downsample(Object.entries(stockData2), desiredPoints);

//       console.log("stockData1 ", typeof stockData1);

//       setChartData({
//         series: [
//           { name: presentStock, data: downsampledData1 },
//           // { name: futureStock, data: stockData2 },
//           { name: futureStock, data: downsampledData2 },
//         ],
//         options: {
//           chart: { type: "line", height: 350, zoom: { enabled: true } },
//           title: { text: "Stock Price Movement", align: "left" },
//           yaxis: {
//             title: { text: "Price" },
//             labels: {
//               formatter: (value) => value.toFixed(1),
//             },
//           },
//           xaxis: { type: "datetime", title: { text: "Date" } },
//           stroke: { curve: "smooth", width: 2 },
//           tooltip: { x: { format: "dd MMM yyyy" } },
//         },
//       });
//     }
//   }, [props.msg]);

//   return (
//     <div id="chart">
//       {chartData.series.length > 0 && (
//         <ReactApexChart
//           options={chartData.options}
//           series={chartData.series}
//           type="line"
//           height={400}
//         />
//       )}
//     </div>
//   );
// };

export default PredictStock;
