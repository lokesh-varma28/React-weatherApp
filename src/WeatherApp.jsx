
import React, { useState, useEffect } from "react";
import "./WeatherApp.css";

function WeatherApp() {
  const [city, setCity] = useState("New York");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric"); 

  const API_KEY = "c19712e9f07fdfcfa189baa61f631878"; 

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},{village}&appid=${API_KEY}&units=${unit}`
      );
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
      } else {
        setError(data.message || "City not found");
      }
    } catch (err) {
      setError("Error fetching weather");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
   
  }, [unit]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  const getWeatherClass = () => {
    if (!weather) return "weather-app clear";
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes("cloud")) return "weather-app cloudy";
    if (main.includes("rain") || main.includes("drizzle")) return "weather-app rain";
    if (main.includes("snow")) return "weather-app snow";
    if (main.includes("storm") || main.includes("thunder")) return "weather-app storm";
    if (main.includes("night")) return "weather-app night";
    return "weather-app clear";
  };

  return (
    <div className={getWeatherClass()}>
    
      <div className="weather-effect">
        {weather?.weather[0].main.toLowerCase().includes("rain") &&
          Array.from({ length: 50 }).map((_, i) => <div key={i} className="raindrop"></div>)
        }
        {weather?.weather[0].main.toLowerCase().includes("snow") &&
          Array.from({ length: 30 }).map((_, i) => <div key={i} className="snowflake"></div>)
        }
        {weather?.weather[0].main.toLowerCase().includes("cloud") &&
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="cloud"></div>)
        }
      </div>

      <h1>React Weather App 🌦️</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      <button className="unit-toggle" onClick={toggleUnit}>
        Show in {unit === "metric" ? "°F" : "°C"}
      </button>

      {loading && <p className="info-text">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p className="desc">{weather.weather[0].description}</p>
          <p className="temp">
            {Math.round(weather.main.temp)}°{unit === "metric" ? "C" : "F"}
          </p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} {unit === "metric" ? "m/s" : "mph"}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;