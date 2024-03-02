// import React from "react";
// import ReactApexChart from "react-apexcharts";

// function downsample(array, step) {
//   return array.filter((element, index) => index % step === 0);
// }

// class StockChart1 extends React.Component {
//   constructor(props) {
//     super(props);

//     // Convert and downsample your data here
//     const dataArray = Object.entries(this.props.data).map(([date, value]) => ({
//       x: date,
//       y: parseFloat(value),
//     }));
//     const desiredPoints = 50;
//     const step = Math.ceil(dataArray.length / desiredPoints);
//     const downsampledData = downsample(dataArray, step);

//     // const series = [{
//     //   name: "Stock Data",
//     //   data: downsampledData
//     // }];

//     this.state = {
//       series: [
//         {
//           name: "Stock Price",
//           data: downsampledData,
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
//         },
//         xaxis: {
//           type: "datetime",
//           title: {
//             text: "Date",
//           },
//         },
//         stroke: {
//           curve: "smooth",
//           width: 2, // Adjust this value to decrease the line thickness
//         },
//         tooltip: {
//           x: {
//             format: "dd MMM yyyy",
//           },
//         },
//       },
//     };
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

// export default StockChart1;
