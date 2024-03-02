import os
import pandas as pd
import json
from datetime import datetime
BASE_FOLDER_PATH=''

def read_csv_to_dict(stock_name):
    file_path = f"{BASE_FOLDER_PATH}data/production/{stock_name}_merged_data.csv"
    
    df = pd.read_csv(file_path)
    data_dict = df.set_index('date')['Close'].astype(str).to_dict()
    return data_dict

def combine_dicts(stock_names):
    
    dicts = [ read_csv_to_dict(stock_names[0]),read_csv_to_dict(stock_names[1])]
    combined_dict = {}
    for stock_name, data_dict in zip(stock_names, dicts):
        combined_dict[stock_name] = data_dict
    return combined_dict

def read_sentiment_data(stock_symbol):
    file_path = f"data/stock_news_data/{stock_symbol}_sentiments.csv"
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)
        return df
    else:
        print(f"No sentiment data found for {stock_symbol}.")
        return pd.DataFrame()


def read_price_data(stock_symbol):
    file_path = f"data/stock_price_data/{stock_symbol}_data.json"
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            data = json.load(file)
            results = data.get("results", [])
            df = pd.DataFrame(results)
            df["date"] = pd.to_datetime(df["t"], unit="ms")
            df.set_index("date", inplace=True)
            df.drop(columns=["t"], inplace=True)
            # Rename columns to full form
            df.rename(
                columns={
                    "v": "Volume",
                    "vw": "Volume Weighted",
                    "o": "Open",
                    "c": "Close",
                    "h": "High",
                    "l": "Low",
                    "n": "Count",
                },
                inplace=True,
            )
            return df
    else:
        print(f"No price data found for {stock_symbol}.")
        return pd.DataFrame()


def merge_data(stock_symbols):
    for stock_symbol in stock_symbols:
        final_df = pd.DataFrame()
        sentiment_df = read_sentiment_data(stock_symbol)
        price_df = read_price_data(stock_symbol)
        if not sentiment_df.empty and not price_df.empty:
            # Resample price data to daily frequency to align with sentiment data
            price_df = price_df.resample("D").mean()
            # Merge sentiment and price data
            merged_df = pd.merge(
                sentiment_df, price_df, how="inner", left_index=True, right_index=True
            )
            # Remove rows with data of the current day
            today_date = datetime.today().strftime("%Y-%m-%d")
            merged_df = merged_df[merged_df.index != today_date]
            # Fill short gaps with forward fill
            merged_df = merged_df.ffill(
                limit=3
            )  # Limit defines the maximum number of consecutive NaN values to fill
            # Interpolate longer gaps
            merged_df.interpolate(
                method="linear", inplace=True, limit_area="inside"
            )  # Using linear interpolation
            # Save merged data to a separate file for each ticker
            save_data(merged_df, "data", stock_symbol)


def save_data(data, folder_path, stock_symbol):
    folder_path = os.path.join(folder_path, "production")
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    file_path = os.path.join(folder_path, f"{stock_symbol}_merged_data.csv")
    data.to_csv(file_path)


def main_production():
    try:
        with open("ticker.txt", "r") as ticker_file:
            stock_symbols = [ticker.strip() for ticker in ticker_file.readlines()]
            merge_data(stock_symbols)
            print("Data saved successfully.")
    except FileNotFoundError:
        print("Ticker file not found.")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main_production()