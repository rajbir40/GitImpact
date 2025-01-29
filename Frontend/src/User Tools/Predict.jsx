import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Predict() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY; // Add your API key in the .env file
      const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST; // Add your API host in the .env file
      const city = "London"; // You can dynamically change this to take user input

      try {
            
        const response = await axios.get(`https://weather-api-by-any-city.p.rapidapi.com/weather/current?location=London&units=metric`, {
          headers: {
            headers: {
                  "X-RapidAPI-Key": API_KEY,
                  "X-RapidAPI-Host": API_HOST
                }
                
          }
        });
        setWeatherData(response.data);
      } catch (err) {
            console.log("API Key:", import.meta.env.VITE_RAPIDAPI_KEY);
console.log("API Host:", import.meta.env.VITE_RAPIDAPI_HOST);

        setError(err+"Failed to fetch weather data.");
      }
    };

    fetchWeather();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!weatherData) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  const { location, current } = weatherData;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Weather Details</h2>
        <div className="space-y-2">
          <div className="text-gray-700">
            <strong>Location:</strong> {location.name}, {location.region}, {location.country}
          </div>
          <div className="text-gray-700">
            <strong>Temperature:</strong> {current.temp_c}&deg;C / {current.temp_f}&deg;F
          </div>
          <div className="text-gray-700">
            <strong>Condition:</strong> {current.condition.text}
          </div>
          <div className="text-gray-700">
            <strong>Wind:</strong> {current.wind_kph} kph ({current.wind_dir})
          </div>
          <div className="text-gray-700">
            <strong>Humidity:</strong> {current.humidity}%
          </div>
          <div className="text-gray-700">
            <strong>Visibility:</strong> {current.vis_km} km
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <img
            src={current.condition.icon}
            alt={current.condition.text}
            className="h-12 w-12"
          />
        </div>
      </div>
    </div>
  );
}
