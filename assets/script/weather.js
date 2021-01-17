function getCurrentWeather(city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=43802440c0c6de0f332937c0fa83470c")
    .then(function(response) {
        if (response.ok) {
            response.json()
            .then(function(data) 
            { 
                storeCitiesToLocalStorage(city);
                getForecastWeather(data.coord.lat,data.coord.lon,city); 

            });
        } else {
            alert("Error: " + response.statusText);
          }
    }).catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to Weather app " + error);
      });
      
  };

  function getForecastWeather(lat,lon,city){
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=43802440c0c6de0f332937c0fa83470c")
    .then(function(response) {
        if (response.ok) {
            response.json()
            .then(function(data) 
            {
                loadCurrentWeather(data,city)
                loadForeCastWeather(data);
            });
        } else {
            alert("Error: " + response.statusText);
          }
    }).catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to Weather app" + error);
      });
  }
function loadLocalStorageCities(cityName)
  {
      //Reading localstorage list if any
    var cityList = JSON.parse(localStorage.getItem('weatherCityList')) || [];
    var citiContainerEL = $("#cities-container");
    citiContainerEL.html('');
     // create a span element to hold repository name
     for(var i=0;i<cityList.length ; i++){
        var titleEl = $('<a>');
        titleEl.attr('href','#');
        titleEl.attr("cityName",cityList[i]);
        titleEl.addClass("list-group-item list-group-item-action");
        if(cityName===cityList[i]){
            titleEl.addClass('active');
        }
        titleEl.text(cityList[i]);
        citiContainerEL.append(titleEl); 
     }
  }
loadLocalStorageCities('');

$(document).on('click', '.list-group-item', function(event) {
    event.preventDefault();
    $(this).siblings(".active").removeClass('active');
    getCurrentWeather($(this).attr("cityName"));
    $(this).addClass('active');
}); 


//Load Current day weather
function loadCurrentWeather(weatherData,inputCity){
    var currentWeatherCardEl = $('#currentWeatherDiv');
    currentWeatherCardEl.html('');

    var currentCityH4El = $('<h3>')
    var temparatureSpanEl = $('<p>');
    var humiditySpanEl = $('<p>');
    var windSpeedSpanEl = $('<p>');
    var uvIndex = $('<span>');
    var weathericon = $('<img>');    

    currentCityH4El.addClass('card-title d-flex');
    temparatureSpanEl.addClass('card-text d-flex');
    humiditySpanEl.addClass('card-text');
    windSpeedSpanEl.addClass('card-text');
    uvIndex.addClass('card-text d-flex');

    var currentDate = moment().format("MM/DD/YYYY");
    var cityHeader = inputCity + "(" + currentDate + ")" ;

    currentCityH4El.text(cityHeader);
    temparatureSpanEl.html("Temparature: " + weatherData.current.temp + " &#8457 ");
    humiditySpanEl.text("Humidity: "+ weatherData.current.humidity + "%");
    windSpeedSpanEl.text("Wind Speed: " +  weatherData.current.wind_speed + " MPH");
    var iconurl = "https://openweathermap.org/img/w/" + weatherData.current.weather[0].icon + ".png";
    weathericon.attr('src', iconurl);
    weathericon.attr('alt','weather icon');

    if(weatherData.current.uvi < 3)
    {
        uvIndex.html("UV Index: " + "<p class='lowUV' >  " +  weatherData.current.uvi + "</p>");
    }else if(data.value >=3 && data.value <=5){
        uvIndex.html("UV Index: " + "<p class='moderateUv' >  " + weatherData.current.uvi + "</p>");
    }else{
        uvIndex.html("UV Index: " + "<p class='highUV' >  " +  weatherData.current.uvi + "</p>");
    }

    currentCityH4El.append(weathericon);
    currentWeatherCardEl.append(currentCityH4El);
    currentWeatherCardEl.append(temparatureSpanEl);
    currentWeatherCardEl.append(humiditySpanEl);
    currentWeatherCardEl.append(windSpeedSpanEl);
    currentWeatherCardEl.append(uvIndex);
}



function loadForeCastWeather(foreCastData){
    var mainForeCastEl = $('#forecastWeatherDiv');
    mainForeCastEl.html('');
    var heading = $("<h4>");
    heading.text("5-Day Forecast:");
    mainForeCastEl.append(heading);

    var forecastDivEl = $('<div>');
    forecastDivEl.addClass('d-flex');
    mainForeCastEl.append(forecastDivEl); 
    if(foreCastData.daily.length){
        for(i=1;i<=5;i++){
            
            var dailyObj = foreCastData.daily[i];
            
            var cardDivEl = $("<div>");
            cardDivEl.addClass("card-body text-white bg-primary forecast");
        
            var h5CardTitleEl = $("<h4>");
            h5CardTitleEl.addClass("card-title");
        
            var imgCardImageEl = $('<img>') 

            var pCardTempTextEl = $("<p>");
            pCardTempTextEl.addClass("card-text");

            var pCardHumTextEl = $("<p>");
            pCardHumTextEl.addClass("card-text");
        
            var currentDate = moment.unix(dailyObj.dt).format("MM/DD/YYYY");
            h5CardTitleEl.text(currentDate);
            var iconurl = "https://openweathermap.org/img/w/" + dailyObj.weather[0].icon + ".png";
            imgCardImageEl.attr('src', iconurl);
            imgCardImageEl.attr('alt','weather icon');

            var temparature = dailyObj.temp.day;
            pCardTempTextEl.html("Temp : " + temparature + " &#8457 ");
            pCardHumTextEl.html("Humidity : " + dailyObj.humidity + " %");

            cardDivEl.append(h5CardTitleEl);
            cardDivEl.append(imgCardImageEl);
            cardDivEl.append(pCardTempTextEl);
            cardDivEl.append(pCardHumTextEl);
            forecastDivEl.append(cardDivEl);
            
        }
    }

}

var searchCityInputEl = $("#cityname");
var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);
    var cityname = searchCityInputEl.val().trim();
    if (cityname) {
        searchCityInputEl.val('');
        getCurrentWeather(cityname);
        
    } 
    else {
        alert("Please enter a City");
    }
};
  
function storeCitiesToLocalStorage(cityName){
        //Reading localstorage list if any
        var cityList = JSON.parse(localStorage.getItem('weatherCityList')) || [];
        var isCityExist = false;
        for(var i=0;i<cityList.length;i++)
        {
            if(cityName === cityList[i]){
                isCityExist = true;
            }
        }
        if(!isCityExist){
            cityList.push(cityName);
            localStorage.setItem('weatherCityList',JSON.stringify(cityList));
            loadLocalStorageCities(cityName);
        }
        //Save tasklist to localstorage
        
}
SearchBtn.addEventListener("click", formSubmitHandler);