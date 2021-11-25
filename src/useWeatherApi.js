import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = (locationName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-5FFF1658-3B34-422E-8B78-DF3AE12B0B6F&locationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP", "HUMD", "Weather"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {}
      );
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        description: weatherElements.Weather,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD
      };
    });
};

const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-5FFF1658-3B34-422E-8B78-DF3AE12B0B6F&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      };
    });
};

const useWeatherApi = (currentLocation) => {
  const { locationName, cityName } = currentLocation;
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true
  });

  // 使用 useCallback 並將回傳的函式取名為 fetchData
  const fetchData = useCallback(() => {
    // 把原本的 fetchData 改名為 fetchingData 放到 useCallback 的函式內
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForecast(cityName)
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      });
    };

    setWeatherElement((preState) => {
      return { ...preState, isLoading: true };
    });

    // 記得要呼叫 fetchingData 這個方法
    fetchingData();
    // 因為 fetchingData 沒有相依到 React 組件中的資料狀態，所以 dependencies 陣列中不帶入元素
  }, [locationName, cityName]);

  useEffect(() => {
    console.log("fetch");
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;
