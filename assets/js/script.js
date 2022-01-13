const input = document.getElementById('city-search'); //city search input

//variables for today's weather info
const selectedCity = document.querySelector('#city-name');
const dateToday = document.querySelector('#date-today');
const tempToday = document.querySelector('#temp');
const windToday = document.querySelector('#wind');
const humidityToday = document.querySelector('#humidity');
const uvToday = document.querySelector('#uv');
const statusPic = document.querySelector('.weather-pic');

//variables for 5-day forcast
const forcast = document.querySelector('.forcast');

//variables for city buttons
const recentCities = document.querySelector('.recent-cities');

const getWeather = (name, lat, lng) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&exclude=minutely&appid=cf0f236d99f05f78766736970398dfe2`)
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
    let temp_min, temp_max, desc, date, icon;
    
    for(let i = 0; i < 5; i++) {
        //get info
        temp_min = info[i].temp.min;
        temp_max = info[i].temp.max;
        desc = info[i].weather[0].description;
        date = info[i].dt;
        icon = info[i].weather[0].icon;

        //create card
        const card = document.createElement('article');
        card.className = 'card';

        //create header -> day of the week
        const title = document.createElement('h3');
        title.className = 'day';
        title.innerText = dayjs.unix(date).format('dddd');

        //create subtitle
        const subTitle = document.createElement('p');
        subTitle.className = 'date';
        subTitle.innerText = dayjs.unix(date).format('MMM DD');

        //create section to hold weather info icon
        const picContainer = document.createElement('section');
        picContainer.className = "weather-pic-container";

        //create weather info icon
        const pic = document.createElement('img');
        pic.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`)
        pic.setAttribute('alt', desc);
        pic.className = "weather-pic";
        

        //create info container and elements
        const infoCont = document.createElement('section');
        const weatherDesc = document.createElement('p');
        const tempMax = document.createElement('p');
        const tempMin = document.createElement('p');
        infoCont.className = "day-card-info";
        weatherDesc.className = 'weather-desc';
        tempMax.className = 'temp-max';
        tempMin.className = 'temp-min';
        weatherDesc.innerText = desc;
        tempMax.innerText = temp_max;
        tempMin.innerText = temp_min;

        //append together and assemble card
        picContainer.append(pic);
        infoCont.append(weatherDesc, tempMax, tempMin);
        card.append(title, subTitle, picContainer, infoCont);

        //append entire card to parent div
        forcast.append(card);
    }
}

const populateRecentCities = () => {
    const cities = localStorageGet();

    cities.forEach(element => {
        const button = document.createElement('button');
        button.dataset.lat = element.lat;
        button.dataset.lng = element.lng;
        button.innerText = element.name;

        recentCities.append(button);
    })
}

const cityBtnClickHandler = event => {
    const target = event.target;
    getWeather(target.innerText, target.dataset.lat, target.dataset.lng);
}


const init = () => {
    populateRecentCities();
    google.maps.event.addDomListener(window, 'load', initialize);
    recentCities.addEventListener('click', cityBtnClickHandler);
}

init();