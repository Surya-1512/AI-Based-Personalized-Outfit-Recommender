import React, { useEffect, useState } from "react";
import axios from "axios";
import './weather.css'; // Import CSS file for styling

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        // Use the browser's Geolocation API to get the user's coordinates
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        // Use OpenCage Geocoding API to get location details based on coordinates
        const { data } = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?key="OPENCAGE API KEY"&q=${position.coords.latitude}+${position.coords.longitude}&language=en&pretty=1`
        ); /*Paste your opencage api key*/

        // Get the city name from the OpenCage response
        const cityName = data.results[0].components.city;

        // Use OpenWeatherMap API to get current weather based on the city name
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid="#OPEN_WEATHER_MAP_API"` /* Paste your OPEN WEATHER MAP API KEY */
        );

        setWeatherData(weatherResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  if (loading) {
    return <div className="loading">Loading weather data...</div>;
  }

  if (!weatherData) {
    return <div className="error">Unable to fetch weather data.</div>;
  }

  // Convert temperature from Kelvin to Fahrenheit
  const temperatureFahrenheit = Math.round((weatherData.main.temp - 273.15) * 9/5 + 32);

  // Add your logic to suggest outfits based on the weather data
  const suggestOutfit = () => {
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const temperature = temperatureFahrenheit;
  
    let outfitSuggestion = "";
  
    if (weatherCondition === "clear") {
      // Outfit suggestions for clear weather
      if (temperature > 77) {
        outfitSuggestion = (
          <div>
            <p>It's hot and sunny. Wear shorts, a light-colored t-shirt, and sunglasses.</p>
            <p>Consider a hat and sunscreen to protect yourself from the sun.</p>
          </div>
        );
      } else if (temperature > 59) {
        outfitSuggestion = (
          <div>
            <p>It's warm and sunny. Wear breathable clothing like cotton shirts and shorts.</p>
            <p>A light jacket or sweater might be useful for cooler evenings.</p>
          </div>
        );
      } else {
        outfitSuggestion = (
          <div>
            <p>It's sunny but cooler. Opt for long sleeves and pants.</p>
            <p>A light jacket or sweater is recommended.</p>
          </div>
        );
      }
    } else if (weatherCondition === "clouds") {
      // Outfit suggestions for cloudy weather
      outfitSuggestion = (
        <div>
          <p>It's cloudy. Wear comfortable clothing and consider bringing a light jacket.</p>
          <p>Avoid heavy coats as it's not too cold.</p>
        </div>
      );
    } else if (weatherCondition === "rain") {
      // Outfit suggestions for rainy weather
      outfitSuggestion = (
        <div>
          <p>It's raining. Wear a waterproof jacket and bring an umbrella.</p>
          <p>Opt for waterproof shoes or boots to keep your feet dry.</p>
        </div>
      );
    } else if (weatherCondition === "snow") {
      // Outfit suggestions for snowy weather
      outfitSuggestion = (
        <div>
          <p>It's snowing. Dress warmly with layers, a heavy coat, and insulated boots.</p>
          <p>Don't forget gloves, a scarf, and a hat to protect yourself from the cold.</p>
        </div>
      );
    } else if (weatherCondition === "thunderstorm") {
      // Outfit suggestions for thunderstorms
      outfitSuggestion = (
        <div>
          <p>It's a thunderstorm. Stay indoors and wear comfortable clothing.</p>
          <p>Avoid going outside unless necessary.</p>
        </div>
      );
    } else if (weatherCondition === "mist" || weatherCondition === "haze") {
      // Outfit suggestions for misty or hazy weather
      outfitSuggestion = (
        <div>
          <p>It's misty or hazy. Wear breathable clothing such as light pants and a long-sleeve shirt.</p>
          <p>Avoid heavy fabrics and consider wearing a light jacket in case of cool temperatures.</p>
        </div>
      );
    } else {
      outfitSuggestion = "Weather conditions are uncertain. Dress appropriately.";
    }
  
    return outfitSuggestion;
  };
  
  return (
    <div className="weather-container">
      <div className="weather-details">
        <h2 className="title">Weather Information</h2>
        <p>City: {weatherData.name}</p>
        <p>Temperature: {temperatureFahrenheit} °F</p>
        <p>Weather: {weatherData.weather[0].main}</p>
      </div>
      <div className="outfit-suggestion-box">
        <h2 className="outfit-title">Outfit Suggestion</h2>
        <div className="outfit-suggestion">{suggestOutfit()}</div>
      </div>
    </div>
  );
};

export default Weather;
