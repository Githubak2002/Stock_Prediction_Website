import asyncio
from stock_data import main_price
from news_data import main_news
from production import main_production
# from prediction import  load_predicted_results
import concurrent.futures
BASE_FOLDER_PATH = ''

def run_main_news():
    asyncio.run(main_news())
    return "News data updated"

def data_base_updation():
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        future_price = executor.submit(main_price)
        future_news = executor.submit(run_main_news)

        # Wait for both main_price and main_news to complete
        concurrent.futures.wait([future_price, future_news])

        # Get the results
        price_data_status = future_price.result()
        news_data_status = future_news.result()

        # Execute main_production
        # This function will be executed after main_price and main_news are completed
        # Also it will update the final csv file which is inside the production folder
        main_production()

        return price_data_status, news_data_status
if __name__ == "__main__":
    all_status = data_base_updation()

# if __name__ == "__main__":
#     with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
#         future_price = executor.submit(main_price)
#         future_news = executor.submit(run_main_news())

#         # Wait for both main_price and main_news to complete
#         concurrent.futures.wait([future_price, future_news])

#         # Get the results
#         price_data = future_price.result()
#         news_data = future_news.result()

#         # Execute main_production
#         main_production()