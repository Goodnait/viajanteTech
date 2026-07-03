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

/** 
 * Salva os dados de viagem no histórico do localStorage
 * @param {string} origin - Local de origem
 * @param {Object} location - Objeto com informações da cidade destino
 * @param {string} initialDate - Data de ida
 * @param {string} finalDate - Data de volta
 * @param {number} differenceDays - Diferença em dias entre ida e volta
 * @param {Object} weather - Objeto com informações do clima atual
 * @returns {Array} Lista atualizada de viagens salvas no localStorage      
*/
async function historySave(origin, location, initialDate, finalDate, differenceDays, weather)  {
  const dataObj = {
    Origem: origin,
    Cidade: location.name,
    DataIda: initialDate,
    DataVolta: finalDate,
    Dias: {
        Dias: differenceDays,
        Condicao: weather.condition.text,
        Temp: weather.temp_c,
        TempMin: weather.mintemp_c,
        TempMax: weather.maxtemp_c,
        Chuva: weather.daily_chance_of_rain,
        Vento: weather.wind_kph,
        UV: weather.uv
    }  
  };
  let datasList = JSON.parse(localStorage.getItem('datasList')) || [];
  datasList.push(dataObj);
  localStorage.setItem('datasList', JSON.stringify(datasList));
  return datasList; 
}



/** * Função principal que obtém os dados de viagem e clima, e salva no histórico
 * @returns {Promise<void>}
 */
async function main() {
    try{
        const origin = document.getElementById("origem").value;
        const location = document.getElementById("destino").value;
        const initialDate = document.getElementById("data-inicio").value;
        const finalDate= document.getElementById("data-fim");
        const differenceDays = finalDate-initialDate;
        
        // Obtém as condições meteorológicas atuais do local
        const current = await getCurrentWeather(location);
        const {location, current: weather } = current;
         
        // Obtém a previsão do tempo para os próximos dias
        const forecast = await getForecast(location.name, differenceDays);
        forecast.forecast.forecastday.forEach((day) => {
            day.date;
            day.day.condition.text;
            day.day.maxtemp_c;
            day.day.mintemp_c;
            day.day.wind_kph;
            day.day.daily_chance_of_rain; 
            day.day.uv;
        }); 
        
        // Salva os dados no localStorage
        let datasList = await historySave(origin, location, initialDate, finalDate, differenceDays, weather) || [];
        
        // Se fechar a aba do navegador, o localStorage é limpo
        window.addEventListener('load', () => {
            localStorage.removeItem('datasList');
        });

    } catch (error) {
        alert('Error:', error.message);
    }
}

main();