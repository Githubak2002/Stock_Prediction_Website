// import React from "react";
// import ReactApexChart from "react-apexcharts";

// function downsample(array, step) {
//   return array.filter((element, index) => index % step === 0);
// }

// class CompareStocks extends React.Component {
//   constructor(props) {
//     super(props);

//     const data = this.props.msg;
//     console.log("data ",data);
//     const keys = Object.keys(data);
//     const [stock_name1, stock_name2] = keys;
//     const stockData1 = data[stock_name1];
//     const stockData2 = data[stock_name2];

//     // Convert and downsample stockData1 and stockData2
//     const desiredPoints = 50; // Adjust as needed
//     const downsampledData1 = this.downsampleData(stockData1, desiredPoints);
//     const downsampledData2 = this.downsampleData(stockData2, desiredPoints);

//     this.state = {
//       series: [
//         {
//           name: stock_name1,
//           data: downsampledData1,
//         },
//         {
//           name: stock_name2,
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

// export default CompareStocks;

import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

function downsample(array, step) {
  return array.filter((element, index) => index % step === 0);
}

const CompareStocks = (props) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (props.msg) {
      const data = props.msg;
      const keys = Object.keys(data);
      const [stock_name1, stock_name2] = keys;
      const stockData1 = data[stock_name1];
      const stockData2 = data[stock_name2];

      // Convert and downsample stockData1 and stockData2
      const desiredPoints = 50; // Adjust as needed
      const downsampledData1 = downsampleData(stockData1, desiredPoints);
      const downsampledData2 = downsampleData(stockData2, desiredPoints);

      setChartData([
        {
          name: stock_name1,
          data: downsampledData1,
        },
        {
          name: stock_name2,
          data: downsampledData2,
        },
      ]);
    }
  }, [props.msg]);

  function downsampleData(stockData, desiredPoints) {
    const dataArray = Object.entries(stockData).map(([date, value]) => ({
      x: date,
      y: parseFloat(value),
    }));
    const step = Math.ceil(dataArray.length / desiredPoints);
    return downsample(dataArray, step);
  }

  return (
    <div id="chart">
      {chartData && (
        <ReactApexChart
          options={{
            chart: {
              type: "line",
              height: 350,
              zoom: {
                enabled: true,
              },
            },
            title: {
              text: "Stock Price Movement",
              align: "left",
            },
            yaxis: {
              title: {
                text: "Price",
              },
              labels: {
                formatter: function (value) {
                  // Round the value to one decimal place and return
                  return value.toFixed(1);
                },
              },
            },
            xaxis: {
              type: "datetime",
              title: {
                text: "Date",
              },
            },
            stroke: {
              curve: "smooth",
              width: 2,
            },
            tooltip: {
              x: {
                format: "dd MMM yyyy",
              },
            },
          }}
          series={chartData}
          type="line"
          height={400}
        />
      )}
    </div>
  );
};

export default CompareStocks;
