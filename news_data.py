'''
    Code for updating the code data the stock news data 
'''
import asyncio
import aiohttp
import json
import os
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from textblob import TextBlob
BASE_FOLDER_PATH = ''

# Global variable for the starting point
START_DATE = "2021-04-22"
# START_DATE = "2021-01-01"
MAX_REQUESTS_PER_SECOND = 5  # Adjust this value as needed


async def analyze_sentiment(text):
    blob = TextBlob(text)
    sentiment_score = blob.sentiment.polarity
    # print(f"Sentiment score for '{text}': {sentiment_score}")
    return float(sentiment_score)


async def fetch_data_for_date(sem, ticker, date, api_key):
    """
    Fetches stock data from an API for a single date asynchronously.
    """
    async with sem:
        # url = f"https://api.polygon.io/v2/reference/news?ticker={ticker}&apiKey={api_key}&date={date}&limit=10"
        url = f"https://api.polygon.io/v2/reference/news?ticker={ticker}&published_utc={date}&order=asc&limit=10&sort=published_utc&apiKey={api_key}"
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    return {date: data.get('results', [])}
                else:
                    print(f"Failed to fetch data for {ticker} on {date}: HTTP {response.status}")
                    return {}


async def update_stock_data(ticker, new_data):
    """
    Updates or creates a JSON file for the ticker with new data.
    """
    folder_path = 'data/stock_news_data'
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)  # Create the folder if it doesn't exist

    file_path = os.path.join(folder_path, f'{ticker}.json')
    with open(file_path, 'w') as file:
        json.dump(new_data, file, indent=4)


async def check_and_update_data(ticker, api_key):
    """
    Checks if the current date's data is present and updates if necessary by fetching data day by day asynchronously.
    """
    current_date = datetime.now().strftime('%Y-%m-%d')
    file_path = os.path.join('data/stock_news_data', f'{ticker.upper()}.json')

    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            data = json.load(file)
            last_date = max(data.keys())
            start_date = datetime.strptime(last_date, '%Y-%m-%d') + timedelta(days=1)
    else:
        print(f"No data file found for ticker {ticker}. Starting initial fetch...")
        data = {}
        start_date = datetime.strptime(START_DATE, '%Y-%m-%d')

    tasks = []
    sem = asyncio.Semaphore(MAX_REQUESTS_PER_SECOND)  # Semaphore for throttling requests
    date_to_fetch = start_date
    while date_to_fetch.strftime('%Y-%m-%d') <= current_date:
        date_str = date_to_fetch.strftime('%Y-%m-%d')
        if date_str not in data:
            print(f"Fetching data for {date_str}...")
            tasks.append(fetch_data_for_date(sem, ticker, date_str, api_key))
        date_to_fetch += timedelta(days=1)

    # Fetch data asynchronously
    fetched_data = await asyncio.gather(*tasks)

    # Update the stock data file with all fetched data
    for new_data in fetched_data:
        if new_data:
            data.update(new_data)

    if data:
        await update_stock_data(ticker, data)
        print("Data has been updated with new information.")
    else:
        print("No new data available to update.")


async def get_stock_data_polygon(ticker, api_key):
    """
    This function is used for getting stock news data asynchronously.
    """
    await check_and_update_data(ticker, api_key)
    file_path = os.path.join('data/stock_news_data', f'{ticker}.json')

    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"File {file_path} not found.")
        return {}
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from {file_path}: {e}")
        return {}
    else:
        return data


async def get_ticker_headlines_and_sentiments(ticker, api_key):
    """
    Returns a DataFrame with sentiment scores as the only column.
    """
    # Check the data status if not available send update the JSON database.
    await check_and_update_data(ticker, api_key)
    file_path = os.path.join('data/stock_news_data', f'{ticker}.json')
    response_structure = []

    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            data = json.load(file)
            for date, articles in data.items():
                # Convert date string to datetime object
                date = pd.to_datetime(date)

                sentiment_scores = await asyncio.gather(*[analyze_sentiment(article['title']) for article in articles])
                mean_sentiment = np.mean(
                    sentiment_scores
                )  
                # Assuming 'title' holds the headline
                print(f"Sentiment scores for {date}: {sentiment_scores} with mean {mean_sentiment}")     
                response_structure.append({
                    "date": date,
                    "mean_sentiment": mean_sentiment,
                })
    else:
        print(f"No data file found for ticker {ticker}.")
        return pd.DataFrame()  # Return an empty DataFrame if no data file is foundq

    # Create a DataFrame from the response_structure list
    df = pd.DataFrame(response_structure)
    # Set the 'date' column as the index
    df.set_index('date', inplace=True)
    # Drop any columns other than 'mean_sentiment'
    df.drop(columns=[col for col in df.columns if col != 'mean_sentiment'], inplace=True)

    df.to_csv(f'data/stock_news_data/{ticker}_sentiments.csv')
    return df


async def main_news():
    api_key = '0VQBNxZe7WZ19GVMOiqTVKUN0oipj_HT'  # Replace with your API key
    try:
        with open('ticker.txt', 'r') as ticker_file:
            tickers = ticker_file.readlines()
            for ticker in tickers:
                ticker = ticker.strip()  # Remove any leading/trailing whitespace or newline characters
                await get_ticker_headlines_and_sentiments(ticker, api_key)
    except FileNotFoundError:
        print("Ticker file not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(main_news())
