import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

function downsample(array, step) {
  return array.filter((element, index) => index % step === 0);
}

const StockChart = (props) => {
  const [chartData, setChartData] = useState(null);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    if (props) {
      // Convert and downsample your data here
      const dataArray = Object.entries(props.data).map(([date, value]) => ({
        x: date,
        y: parseFloat(value),
      }));
      const desiredPoints = 50;
      const step = Math.ceil(dataArray.length / desiredPoints);
      const downsampledData = downsample(dataArray, step);

      // Update the state with the new data
      setChartData([
        {
          name: "Stock Price",
          data: downsampledData,
        },
      ]);

      // Increment the key to force remounting of the ReactApexChart component
      setChartKey((prevKey) => prevKey + 1);
    }
  }, [props]);

  return (
    <div id="chart">
      {chartData && (
        <ReactApexChart
          key={chartKey} // Use key to force remounting
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
              width: 2, // Adjust this value to decrease the line thickness
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

export default StockChart;
