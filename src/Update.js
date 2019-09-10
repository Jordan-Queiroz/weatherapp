import * as R from 'ramda';

const MSGS = {
  ADD_WEATHER: "ADD_WEATHER",
  WEATHER_INPUT: "WEATHER_IPNUT",
  DELETE_WEATHER: "DELETE_WEATHER",
  HTTP_SUCCESS: 'HTTP_SUCCESS',
  HTTP_ERROR: 'HTTP_ERROR'
}

const APPID = '';

function weatherUrl(city) {
  return `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
    city,
  )}&units=imperial&APPID=${APPID}`;
}

export function deleteWeatherMsg(location) {
  return {
    type: MSGS.DELETE_WEATHER,
    location
  }
}

export function weatherInputMsg(location) {
  return {
    type: MSGS.WEATHER_INPUT,
    location
  }
}

export function addWeatherMsg(data) {
  return {
    type: MSGS.ADD_WEATHER
  }
}

function addWeather(msg, model) {
  const { weathers, location } = model

  const newWeather = {
    location,
    "temp": "?",
    "low": "?",
    "high": "?"
  }

  const weatherList = [newWeather, ...weathers]

  return [
    {
      ...model,
      weathers: weatherList,
      location: ""
    },
    {
      request: { url: weatherUrl(location) },
      successMsg: httpSuccessMsg(location),
      errorMsg: httpErrorMsg(location)
    }
  ]
}

function deleteWeather(msg, model) {
  const { weathers } = model
  const { location } = msg

  const newWeathers = R.filter(l => {
    if (l.location != location)
      return true
    return false
  }, weathers)

  return { ...model, weathers: newWeathers}
}

const httpSuccessMsg = R.curry((id, response) => ({
  type: MSGS.HTTP_SUCCESS,
  id,
  response
}))

const httpErrorMsg = R.curry((id, response) => ({
  type: MSGS.HTTP_ERROR,
  id,
  response
}))

function update(msg, model) {

  switch(msg.type) {
    case MSGS.ADD_WEATHER:
      return addWeather(msg, model)
    case MSGS.DELETE_WEATHER:
      return deleteWeather(msg, model)
    case MSGS.WEATHER_INPUT:
      const { location } = msg

      return {...model, location}
    case MSGS.HTTP_SUCCESS:
      const { id, response } = msg;
      const{ weathers } = model;
      const { temp, temp_min, temp_max } = R.pathOr(
        {},
        ['data', 'main'],
        response
      );

      const updaloadedWheaters = R.map(weather => {
        if (weather.location == id) {
          return {
            ...weather,
            temp: Math.round(temp),
            low: Math.round(temp_min),
            high: Math.round(temp_max)
          };
        }
        return weather
      }, weathers);

      return {
        ...model,
        weathers: updaloadedWheaters
      }
    
    case MSGS.HTTP_ERROR:
      return deleteWeather({location: msg.id}, model)
  }
  return model;
}

export default update;
