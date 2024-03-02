import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from datetime import datetime, timedelta
import json
BASE_FOLDER_PATH=''


def create_lstm_model(input_shape):
    model = Sequential()
    model.add(LSTM(50, input_shape=input_shape, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(50, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(50))
    model.add(Dense(1))
    return model


def train_models():
    data_folder = f"{BASE_FOLDER_PATH}data"
    models_folder = f"{BASE_FOLDER_PATH}trained_models"

    # Create models folder if not exists
    if not os.path.exists(models_folder):
        os.makedirs(models_folder)

    # Train models
    production_folder = os.path.join(data_folder, "production")
    for file in os.listdir(production_folder):
        if file.endswith(".csv"):
            csv_file_path = os.path.join(production_folder, file)
            print(f"Training model for {csv_file_path}...")
            train_and_save_model(csv_file_path, models_folder)
            
def train_and_save_model(csv_file_path, models_folder):
    # Load CSV data
    df = pd.read_csv(csv_file_path)

    # Convert Date column to datetime
    df["date"] = pd.to_datetime(df["date"])

    # Set Date as index
    df.set_index("date", inplace=True)

    # Filter data from start date to 2023-12-31
    end_date = pd.to_datetime("2023-12-31")
    df = df.loc[:end_date]

    # Normalize the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df[["Close", "mean_sentiment"]])

    # Prepare data for LSTM model
    look_back = 30
    X, y = [], []
    for i in range(len(df) - look_back):
        print(scaled_data[i : i + look_back])
        X.append(scaled_data[i : i + look_back])
        y.append(scaled_data[i + look_back, 0])  # Close price is the target

    X, y = np.array(X), np.array(y)

    # Reshape data for LSTM
    X = np.reshape(X, (X.shape[0], X.shape[1], 2))

    print(X.shape, y.shape)
    # Create and train LSTM model
    model = create_lstm_model((look_back, 2))
    optimizer = Adam(lr=0.001)
    model.compile(optimizer=optimizer, loss="mean_squared_error")
    model.fit(X, y, epochs=100, batch_size=64, verbose=0)

    # Save model
    stock_name = os.path.basename(csv_file_path).split("_")[0]
    model_name = f"{stock_name}_model.h5"
    model_path = os.path.join(models_folder, model_name)
    model.save(model_path)
    print(f"Model saved: {model_path}")


def load_predicted_results(stock_name , days_to_predict):
    today_date = datetime.today().strftime("%Y-%m-%d")

    predictions_folder = f"{BASE_FOLDER_PATH}predictions"

    # for json
    prediction_file_path_json = os.path.join(
    predictions_folder, f"{stock_name}_prediction_{today_date}_about_{days_to_predict}.json"
    )

    # for csv
    prediction_file_path = os.path.join(
    predictions_folder, f"{stock_name}_prediction_{today_date}_about_{days_to_predict}.csv"
    )

    if  not os.path.exists(prediction_file_path_json):
        print(f"data don't exist in database for stock {stock_name} for {days_to_predict},hence predicting...")
        prediction_file_path = predict_and_save(stock_name , days_to_predict)
    else:
        
        with open(prediction_file_path_json, "r") as json_file:
            json_data_= json.load(json_file)
            # Return the JSON data
            return json_data_
        

    data_path = os.path.join(f"{BASE_FOLDER_PATH}data/production", f"{stock_name}_merged_data.csv")
    # File paths
    file1_path = data_path
    file2_path = prediction_file_path
    import pandas as pd


    # Read the first CSV file and set the 'date' column as the index
    df1 = pd.read_csv(file1_path)
    df1['date'] = pd.to_datetime(df1['date'])
    df1.set_index('date', inplace=True)

    # Read the second CSV file and set the 'Date' column as the index
    df2 = pd.read_csv(file2_path)
    df2['Date'] = pd.to_datetime(df2['Date'])
    df2.set_index('Date', inplace=True)

    # Extract only the 'Close' prices from both DataFrames
    df1_close = df1['Close']
    df2_close = df2['Close']

    # Merge the 'Close' prices with a union of data and in ascending order
    merged_close = pd.concat([df1_close, df2_close]).sort_index()
    # merged_close.index = merged_close.index.strftime("%Y-%m-%d")

    # Split merged_close into past and future data
    past_data = merged_close[merged_close.index <= df1.index[-1]]
    future_data = merged_close[merged_close.index > df1.index[-1]]

    # Convert past_data and future_data into dictionaries with string keys
    past_data_dict = past_data.apply(str).to_dict()
    past_data_dict = {key.strftime('%Y-%m-%d'): value for key, value in past_data_dict.items()}
    future_data_dict = future_data.apply(str).to_dict()
    future_data_dict = {key.strftime('%Y-%m-%d'): value for key, value in future_data_dict.items()}


    # Construct the final output dictionary
    output_dict = {
        "past_data": past_data_dict,
        "future_data": future_data_dict
    }

    # Write the dictionary to a JSON file
    with open(prediction_file_path_json, "w+") as json_file:
        json.dump(output_dict, json_file)

    return output_dict



def predict_and_save(stock_name, days_to_predict):
    today_date = datetime.today().strftime("%Y-%m-%d")
    
    models_folder = f"{BASE_FOLDER_PATH}trained_models"
    predictions_folder = f"{BASE_FOLDER_PATH}predictions"

    # Create predictions folder if not exists
    if not os.path.exists(predictions_folder):
        os.makedirs(predictions_folder)


    # Load model
    model_path = os.path.join(models_folder, f"{stock_name}_model.h5")
    model = load_model(model_path)

    # Load data
    data_path = os.path.join(f"{BASE_FOLDER_PATH}data/production", f"{stock_name}_merged_data.csv")
    df = pd.read_csv(data_path)
    df["date"] = pd.to_datetime(df["date"])
    df.set_index("date", inplace=True)


    # Get last 30 days data for prediction if available
    if len(df) >= 30:
        last_date = df.index[-1]
        start_date = last_date - timedelta(days=30)
        if start_date < df.index[0]:  # If there's not enough historical data
            print("Insufficient historical data for prediction.")
            # return
        data_for_prediction = df.loc[start_date:last_date]
    else:
        print("Insufficient historical data for prediction.")
        # return

    # Normalize data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data_for_prediction[['Close', 'mean_sentiment']])

    # Prepare data for LSTM model
    look_back = min(len(scaled_data), 30)  # Adjust look_back based on available data
    print("look_back: ",look_back)
    X = []
    for i in range(len(scaled_data) - look_back):
        X.append(scaled_data[i:i+look_back])
    X = np.array(X)

    # Reshape data for LSTM
    X = np.reshape(X, (X.shape[0], X.shape[1], 2))

    # Predict future values
    predicted_values = []
    for i in range(days_to_predict):
        # Predict the next value
        predicted_value = model.predict(np.array([X[-1]]))[0][0]
        predicted_values.append(predicted_value)

        # Append the predicted value to X and adjust the shape
        if i + 1 < len(scaled_data):  # Ensure we don't go beyond available data
            next_data_point = np.append(X[-1][1:], scaled_data[[-(look_back - 1) + i]], axis=0)
            next_data_point = next_data_point.reshape(1, next_data_point.shape[0], next_data_point.shape[1])
            X = np.append(X, next_data_point, axis=0)

    # Reshape predicted_values to ensure it's a 2D array with one column
    predicted_values = np.array(predicted_values).reshape(-1, 1)

    # Inverse transform the predicted values
    predicted_values = scaler.inverse_transform(np.concatenate((predicted_values, np.zeros((days_to_predict, 1))), axis=1))[:, 0]

    # Create DataFrame for prediction output
    prediction_df = pd.DataFrame({
        'Date': pd.date_range(start=last_date + timedelta(days=1), periods=days_to_predict),
        'Close': predicted_values.flatten()
    })

    # Save prediction to CSV
    prediction_file_path = os.path.join(
        predictions_folder, f"{stock_name}_prediction_{today_date}.csv"
    )
    prediction_df.to_csv(prediction_file_path, index=False)
    print(f"Prediction saved: {prediction_file_path}")

    
    
    return prediction_file_path

if __name__ == "__main__":
    load_predicted_results(stock_name='AAPL' , days_to_predict=30)