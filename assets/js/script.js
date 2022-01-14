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

//variables for search and city buttons
const searchForm = document.querySelector('#search-form');
const searchBtn = document.querySelector('#search-btn');
const recentCities = document.querySelector('.recent-cities');

//variables to hold place information from google places api
const options = {
    types: ['(cities)']
};
const autocomplete = new google.maps.places.Autocomplete(input , options);
let place;

//weather chart variables
let weatherChart = null;


const getWeather = (name = place.name, lat = place.geometry.location.lat(), lng = place.geometry.location.lng()) => {
    
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
            createChart(info.hourly);
            //save city to local storage
            localStorageSave(name, lat, lng);
            //clear input
            input.value = "";

        })
};

const apiFetchErrHandler = () => {
    //do something to show user here
};



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
    dateToday.innerText = dayjs.unix(info.dt).format('MMMM DD');
    tempToday.innerText = info.temp;
    windToday.innerText = info.wind_speed + ' m/s';
    humidityToday.innerText = info.humidity + '%';
    uvToday.innerText = info.uvi;

    statusPic.setAttribute('src', `http://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`);
    statusPic.setAttribute('alt', `${info.weather[0].description}`);

    document.querySelector('.today-card').classList.remove('hidden');
}

//create cards and populate 5 day forcast
/* <article class="card">
    <section class="card-title-container">
        <h3 class="day"></h3>
        <p class="date"></p>
    </section>
    <section class="day-pic-container">
        <img src="" alt="" class="weather-card-pic">
    </section>
    <section class="day-card-info">
        <p class="weather-desc"></p>
        <p class="temp-max"></p>
        <p class="temp-min"></p>
    </section>
</article> */
const populateDaily = info => {
    let temp_min, temp_max, desc, date, icon;
    const fragment = new DocumentFragment();
    
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

        //create header container
        const titleContainer = document.createElement('section');
        titleContainer.className = 'card-title-container';

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
        picContainer.className = "day-pic-container";

        //create weather info icon
        const pic = document.createElement('img');
        pic.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@4x.png`)
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
        weatherDesc.innerHTML = `<span>Cond:</span><span>${desc}</span>`;
        tempMax.innerHTML = `<span>High:</span><span>${temp_max}&#8451;</span>`;
        tempMin.innerHTML = `<span>Low:</span><span>${temp_min}&#8451;</span>`;

        //append together and assemble card
        picContainer.append(pic);
        infoCont.append(weatherDesc, tempMax, tempMin);
        titleContainer.append(title, subTitle);
        card.append(titleContainer, picContainer, infoCont);

        //append entire card to parent div
        fragment.append(card);
    }
    forcast.innerHTML = "";
    forcast.append(fragment);
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

const searchHandler = event => {
    event.preventDefault();
    place = autocomplete.getPlace();
    if(place) {getWeather();}
}


const init = () => {
    populateRecentCities();
    //google.maps.event.addDomListener(window, 'load', initialize);
    recentCities.addEventListener('click', cityBtnClickHandler);
    searchBtn.addEventListener('click', searchHandler);
    autocomplete.addListener("place_changed", () => {
        place = autocomplete.getPlace();
    });
}

init();


const createChart = dataInputArr => {
    const labels = createChartLabels(dataInputArr);
    const dataset = createChartDataSet(dataInputArr);
    const data = {
        labels: labels,
        datasets: [dataset],
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    };

    if(weatherChart) { weatherChart.destroy(); }

    weatherChart = new Chart(
        document.getElementById('weather-chart'),
        config
    );
}

const createChartLabels = dataInputArr => {
    let labels = [];
    dataInputArr.forEach(hour => {
        labels.push(dayjs.unix(hour.dt).format('HH'));
    });

    return labels;
};

const createChartDataSet = dataInputArr => {
    let data = [];
    dataInputArr.forEach(hour => {
        data.push(hour.temp);
    });

    const dataset = {
        label: 'Degrees',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        fill: true,
        data: data,
    };

    return dataset;
};

function beforePrintHandler () {
    for (var id in Chart.instances) {
      Chart.instances[id].resize();
    }
}

window.addEventListener('resize', beforePrintHandler);