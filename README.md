<!-- ========================= TODO's ========================= -->

<!-- ======== Backend ========

1. aap.py - predict(5 sec delay) = [Uncomment it]
2. GOOGLE API NOT PROPER IN CASE OF PREDICE

-->

<!--  ======== Frontend ========

1. Footer
2. Nav Link - Contack,stock and About pg

-->
<!-- ========================= TODO's ========================= -->


# Stock Data Visualization and Prediction API

## Overview

This API provides endpoints for visualizing stock data, comparing stock performances, and predicting future stock prices. It's built using Flask and supports CORS, making it suitable for integration with web applications.

## Getting Started

### Prerequisites

- Python 3.x
- Flask
- Flask-CORS

### Installation

1. Clone the repository or download the source code.
2. Install the required Python packages:

show the graph , which will have output like
This endpoint will have one input stock name
{
"2024-02-01": "100.00",
"2024-02-02": "102.50",
"2024-02-03": "105.20",
"2024-02-04": "108.00",
"2024-02-05": "109.75",
....
}

graph comaparison
this endpoint will have two input stock_name1, stock_name2
{
"stock_name1": {
"2024-02-01": "100.00",
"2024-02-02": "102.50",
"2024-02-03": "105.20",
"2024-02-04": "108.00",
"2024-02-05": "109.75"
},
"stock_name2": {
"2024-02-01": "1500.00",
"2024-02-02": "1510.00",
"2024-02-03": "1520.00",
"2024-02-04": "1530.00",
"2024-02-05": "1550.00"
}
}

graphs stock prediction
this endpoint will have an input which is no of days to predict and stock name .
the output will be
{
"past_data": {
"2024-02-01": "100.00",
"2024-02-02": "102.50",
"2024-02-03": "105.20",
"2024-02-04": "108.00",
"2024-02-05": "109.75"
},
"future_data": {
"2024-02-06": "112.30",
"2024-02-07": "115.00",
"2024-02-08": "117.50"
}
}
