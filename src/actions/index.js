import axios from 'axios';
const API_KEY = '8a3254738b94a96ee21e23be01cadb63';
const ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`;

export const FEATCH_WEATHER = 'FEATCH_WEATHER';

export function fetchWeather() {
   const url = `${ROOT_URL}&q=${city},us`;
   const request = axios.get(url);
   return {
      type: 'FETCH_WEATHER',
      payload: request
   }
}