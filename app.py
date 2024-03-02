import time
from flask import Flask, jsonify, request
import json
import random
from datetime import datetime, timedelta
from flask_cors import CORS
from main import data_base_updation
from prediction import load_predicted_results
from production import combine_dicts, read_csv_to_dict

app = Flask(__name__)
CORS(app)
CORS(app, origins=['http://localhost:5173'])

# CORS(app)  # Enable CORS for all routes


# Sample data generator function
def generate_sample_data(years=3):
    data = {}
    current_date = datetime.now()
    start_date = current_date - timedelta(days=365 * years)
    while start_date <= current_date:
        date_str = start_date.strftime('%Y-%m-%d')
        price = round(random.uniform(100, 150), 2)
        data[date_str] = str(price)
        start_date += timedelta(days=1)
    return data

# Endpoint to show graph for a single stock
@app.route('/show_graph', methods=['GET'])
def show_graph():
    stock_name = request.args.get('stock_name')
    data = read_csv_to_dict(stock_name) # Replace with actual data retrieval logic
    return jsonify(data)

# Endpoint to compare graphs of two stocks
@app.route('/graph_comparison', methods=['GET'])
def graph_comparison():
    stock_name1 = request.args.get('stock_name1')
    stock_name2 = request.args.get('stock_name2')

    stock_names = [ stock_name1  , stock_name2]

    # data1 = generate_sample_data()  # Replace with actual data retrieval logic
    # data2 = generate_sample_data()  # Replace with actual data retrieval logic

    comparison_json = combine_dicts(stock_names)

    return jsonify(comparison_json)

# Endpoint to predict future stock data
# http://localhost:8080/stock_prediction?stock_name=MSFT&days_to_predict=30
@app.route('/stock_prediction', methods=['GET'])
def stock_prediction():
    # time.sleep(5)
    stock_name = request.args.get('stock_name')
    days_to_predict_str = request.args.get('days_to_predict')
    
    # Check if days_to_predict_str is None or empty
    if not days_to_predict_str:
        return jsonify({"error": "days_to_predict parameter is missing"}), 400  # Bad request

    try:
        days_to_predict = int(days_to_predict_str)
    except ValueError:
        return jsonify({"error": "days_to_predict must be a valid integer"}), 400  # Bad request


    prediction_json  =load_predicted_results(stock_name , days_to_predict)


    return jsonify(prediction_json)


# Check status and update records if necessary
def update_records():
    today_date = datetime.now().strftime('%Y-%m-%d')
    try:
        with open('status.json', 'r') as f:
            status_data = json.load(f)
            last_run_date = status_data.get('last_run_date')
            if last_run_date != today_date:
                # Run function to update records
                all_status = data_base_updation()
                print("Updating records...")
                status_data['last_run_date'] = today_date
                with open('status.json', 'w') as f:
                    json.dump(status_data, f)
    except FileNotFoundError:
        with open('status.json', 'w') as f:
            json.dump({'last_run_date': today_date}, f)
        all_status = data_base_updation()

if __name__ == '__main__':
    update_records()
    app.run(debug=True , port=8080 )
