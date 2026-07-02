/**
 * WeatherAPI.com — Current Weather (JavaScript Fetch API)
 * Docs: https://www.weatherapi.com/docs/
 * Sign up free: https://www.weatherapi.com/signup.aspx
 * https://github.com/weatherapicom/weatherapi-examples/blob/main/javascript/current.js
*/

const API_KEY = "a47b53784e9541c8a0101129260107"; 
const BASE_URL ="https://api.weatherapi.com/v1"; 


/* *
*   Obtém as condições meteorológicas atuais de um local
*   @param {string} location - Nome da cidade, latitude/longitude, código postal ou endereço IP
*   @param {boolean} includeAqi - Inclui dados de qualidade do ar
*   @returns {Promise<Object>} Dados meteorológicos
*/
async function getCurrentWeather(location, includeAqi = true) {
    const params = new URLSearchParams({
        key: API_KEY,
        q: location,
        aqi: includeAqi ? 'yes' : 'no',
    });
    
    const response = await fetch('${BASE_URL}/current.json?${params}');

    if (!response.ok) {
        const error = await response.json();
        throw new Error('WeatherAPI codigo de error ${error.code}: ${error.error.message}');
    }

    return response.json();
}

/**
* Obter previsão de ate 14 dias com detalhamento por hora
* @param {string} location - Nome da cidade, lat/lon, código postal, endereço IP
* @param {number} days - Número de dias (1-14)
* @returns {Promise<Object>} Dados da previsão
*/
async function getForecast(location, days) {
    const params = new URLSearchParams({
        key: API_KEY,
        q: location,
        days: days,
        aqi: 'yes',
        alerts: 'yes',
    });

    const response = await fetch('${BASE_URL}/forecast.json?${params}');

    if(!response.ok) {
        const error = await response.json();
        throw new  Error('WeatherAPI codigo de error ${error.code}: ${error.error.message}');
    }

    return response.json();
}


// Personaliza main conforme requisitos
async function main() {
    try{
        const location = document.getElementById("destino").value;
        const initialDate = document.getElementById("data-inicio").value;
        const finalDate= document.getElementById("data-fim");
        const differenceDays = finalDate-initialDate;
        
        // Cidade destino
        const current = await getCurrentWeather(location);
        const {location, current: weather } = current;
         
        // Clima do destino
        const forecast = await getForecast(location.name, differenceDays);
        forecast.forecast.forecastday.forEach((day) => {
            // voltar dados previsão de tempo 
        }); 
        
        let 
    } catch (error) {
        alert('Error:', error.message);
    }
}


main();