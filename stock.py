import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
# import streamlit as st

# Global variable for look_back
look_back = 60

# Function to download and preprocess stock data
def get_stock_data(symbol, start_date, end_date):
    stock_data = yf.download(symbol, start=start_date, end=end_date)
    return stock_data

# Function to create dataset with lookback
def create_dataset(data, look_back=1):
    X, Y = [], []
    for i in range(len(data) - look_back - 1):
        X.append(data[i:(i + look_back), 0])
        Y.append(data[i + look_back, 0])
    return np.array(X), np.array(Y)

# Function to train LSTM model
def train_lstm_model(X, Y, epochs=100, batch_size=32):
    model = Sequential()
    model.add(LSTM(units=100, return_sequences=True, input_shape=(1, look_back)))
    model.add(Dropout(0.5))
    model.add(LSTM(units=100, return_sequences=True))
    model.add(Dropout(0.5))
    model.add(LSTM(units=100))
    model.add(Dropout(0.5))
    model.add(Dense(units=1))

    optimizer = Adam(lr=0.0001)

    model.compile(optimizer=optimizer, loss='mean_squared_error', metrics=['accuracy'])
    history = model.fit(X, Y, epochs=epochs, batch_size=batch_size, validation_split=0.2) # Added validation_split
    return model, history

def plot_Model_curve(history):
    plt.figure(figsize=(12, 6))
    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'], label='Training Loss', color='blue')
    plt.plot(history.history['val_loss'], label='Validation Loss', color='orange') # Added validation loss
    plt.title('Training Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True)

    # Plot training accuracy
    plt.subplot(1, 2, 2)
    plt.plot(history.history['accuracy'], label='Training Accuracy', color='red')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy', color='green') # Added validation accuracy
    plt.title('Training Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.grid(True)

    plt.tight_layout()
    return plt.gcf()

# Function to plot actual and predicted stock prices
def plot_stock_prices(actual_dates, actual_prices, predicted_date, predicted_price, look_back):
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(actual_dates[-look_back:], actual_prices, label='Actual Stock Price', color='blue')
    ax.plot(predicted_date, predicted_price, marker='o', markersize=8, label='Predicted Stock Price', color='red')
    ax.set_title('Stock Price Prediction')
    ax.set_xlabel('Date')
    ax.set_ylabel('Stock Price')
    ax.legend()
    ax.grid(True)
    return fig

# Streamlit app
def main():
    st.title("Stock Price Prediction using LSTM")
    symbol = st.text_input("Enter stock symbol (e.g., ADANIENT.BO):")
    start_date = st.date_input("Enter start date:")
    end_date = st.date_input("Enter end date:")
    if st.button("Predict"):
        st.write("Downloading and preprocessing stock data...")
        stock_data = get_stock_data(symbol, start_date, end_date)
        if stock_data.empty:
            st.write("No data found for the specified time period.")
            return
        
        prices = stock_data['Close'].values.reshape(-1, 1)
        scaler = MinMaxScaler(feature_range=(0, 1))
        prices_normalized = scaler.fit_transform(prices)
        X, Y = create_dataset(prices_normalized, look_back)  # Reshape X here
        X = np.reshape(X, (X.shape[0], 1, look_back))  # Reshape X to match expected shape
        st.write("Training LSTM model...")
        model, history = train_lstm_model(X, Y)
    
        # Plot model curve
        fig1 = plot_Model_curve(history)
        st.write("Training Loss:", history.history['loss'])
        st.write("Validation Loss:", history.history['val_loss'])
        st.write("Training Accuracy:", history.history['accuracy'])
        st.write("Validation Accuracy:", history.history['val_accuracy'])
        st.write("Predicting stock price...")
        last_price = prices_normalized[-look_back:]
        last_price = np.reshape(last_price, (1, 1, look_back))
        predicted_price_normalized = model.predict(last_price)
        predicted_price = scaler.inverse_transform(predicted_price_normalized)
        st.write("Predicted Stock Price:", predicted_price[0][0])
        st.write("Plotting actual and predicted stock prices...")
        fig = plot_stock_prices(stock_data.index[-look_back:], scaler.inverse_transform(prices_normalized[-look_back:]), 
                                stock_data.index[-1], predicted_price[0][0], look_back)
        st.pyplot(fig)
        st.pyplot(fig1)

if __name__ == "__main__":
    main()
