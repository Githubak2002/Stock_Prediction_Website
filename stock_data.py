'''
    It will update the price data 
'''
import requests
import json
from datetime import datetime, timedelta
import os

# Set the start date for fetching data as global variable
START_DATE = "2021-04-22"  # Fixed start date

def fetch_and_append_data(ticker, START_DATE, end_date, api_key, data_folder):
    url = f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/1/day/{START_DATE}/{end_date}?adjusted=true&sort=asc&limit=50000000&apiKey={api_key}"

    response = requests.get(url)
    data = response.json()

    # Check if data retrieval was successful
    if response.status_code == 200:
        # Check if the file already exists
        filename = os.path.join(data_folder, "stock_price_data", f"{ticker}_data.json")
        if os.path.exists(filename):
            # If file exists, read the existing data
            with open(filename, "r") as f:
                existing_data = json.load(f)
                # Find the maximum date from the existing data
                max_date = max([entry["t"] for entry in existing_data["results"]])
                # Filter out new data starting from the day after max_date until yesterday
                new_data = [
                    entry
                    for entry in data["results"]
                    if entry["t"] > max_date
                    and entry["t"]
                    <= (datetime.now() - timedelta(days=1)).timestamp() * 1000
                ]
                # Append the new data to the existing data
                existing_data["results"].extend(new_data)
                # Update the results count and query count
                existing_data["resultsCount"] += len(new_data)
                existing_data["queryCount"] += 1
                data = existing_data

        # Save the updated data to the file
        with open(filename, "w") as f:
            json.dump(data, f, indent=4)
        print(f"Data saved to {filename}")
    else:
        print("Error fetching data:", data)


def main_price():
    # Set the start date, end date, and API key
    end_date = datetime.now().strftime("%Y-%m-%d")  # Current date as end date
    api_key = "0VQBNxZe7WZ19GVMOiqTVKUN0oipj_HT"  # Your Polygon.io API key
    data_folder = "data"

    # Create the data folder if it doesn't exist
    if not os.path.exists(data_folder):
        os.makedirs(data_folder)

    # Create the stock_price_data folder inside the data folder if it doesn't exist
    stock_price_data_folder = os.path.join(data_folder, "stock_price_data")
    if not os.path.exists(stock_price_data_folder):
        os.makedirs(stock_price_data_folder)

    # Read ticker symbols from the ticker.txt file
    with open("ticker.txt", "r") as file:
        tickers = file.read().splitlines()

    # Fetch and append data for each ticker
    for ticker in tickers:
        fetch_and_append_data(ticker, START_DATE, end_date, api_key, data_folder)

    return "Price data updated"
if __name__ == "__main__":
    main_price()