const fetch = require('node-fetch');  // Ensure node-fetch is properly installed

const getWeather = async (req, res) => {
  const { latitude, longitude } = req.query;  // Extract latitude and longitude from query params
  
  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {
    // Construct the weather API URL using the extracted latitude and longitude
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`
    );
    const data = await response.json();
    res.json(data);  // Send the data back in the response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

module.exports = getWeather ;
