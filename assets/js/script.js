const input = document.getElementById('city-search'); //city search input

//variables for today's weather info
const selectedCity = document.querySelector('#city-name');
const dateToday = document.querySelector('#date-today');
const tempToday = document.querySelector('#temp');
const windToday = document.querySelector('#wind');
const humidityToday = document.querySelector('#humidity');
const uvToday = document.querySelector('#uv');
const statusPic = document.querySelector('.weather-pic');

//variables for city buttons
const recentCities = document.querySelector('.recent-cities');

const getWeather = (name, lat, lng) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=cf0f236d99f05f78766736970398dfe2`)
        .then(response => {
            if(response.ok) { 
                return response.json()
            } else {
                 apiFetchErrHandler();
                 return;
            }
        })
        .then(info => {
            console.log(info);
            //populate with info
            populatePage(name, info);
            //save city to local storage
            localStorageSave(name, lat, lng);
            //clear input
            input.value = "";

        })
};

const apiFetchErrHandler = () => {
    //do something to show user here
};



const initialize = () => {
    const options = {
        types: ['(cities)']
    };

    
    const autocomplete = new google.maps.places.Autocomplete(input , options);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        console.log(place);
        getWeather(place.name, lat, lng);
    })
}

google.maps.event.addDomListener(window, 'load', initialize);


//saving to local storage
const localStorageSave = (city, lat_in, lng_in) => {

    //get array of city objects
    let cities = localStorageGet();
    let newCity;

    //see if city already exists
    const exists = cities.findIndex(element => element.name == city);

    if(exists >= 0) {
        newCity = cities.splice(exists, 1)[0];
    } else {
        //create new object
        newCity = {
            name : city,
            lat : lat_in,
            lng : lng_in,
        }
    }

    //add to front of array and only save most 10 recent cities
    cities.unshift(newCity);
    cities = cities.slice(0, 10);

    //save to local storage
    localStorage.setItem('cities', JSON.stringify(cities));
}

//fetching from local storage
const localStorageGet = () => {
    const data = localStorage.getItem('cities');

    return data ? JSON.parse(data) : [];
}



const populatePage = (name, info) => {
    populateToday(name, info.current);
    populateDaily(info.daily);
}

//populate todays weather div
const populateToday = (name, info) => {
    selectedCity.innerText = name;
    tempToday.innerText = info.temp;
    windToday.innerText = info.wind_speed + ' m/s';
    humidityToday.innerText = info.humidity + '%';
    uvToday.innerText = info.uvi;

    statusPic.setAttribute('src', `http://openweathermap.org/img/wn/${info.weather[0].icon}@4x.png`);
    statusPic.setAttribute('alt', `${info.weather[0].description}`);
}

//create cards and populate 5 day forcast
const populateDaily = info => {

}

const populateRecentCities = () => {
    const cities = localStorageGet();

    cities.forEach(element => {
        const button = document.createElement('button');
        button.dataset.lon = element.lon;
        button.dataset.lng = element.lng;
        button.innerText = element.name;

        recentCities.append(button);
    })
}

populateRecentCities();