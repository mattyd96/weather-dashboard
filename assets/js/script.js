const input = document.getElementById('city-search');

const getWeather = (name, lat, lng) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude={part}&appid=cf0f236d99f05f78766736970398dfe2`)
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
    });
}

google.maps.event.addDomListener(window, 'load', initialize);


//saving to local storage
const localStorageSave = (city, lat_in, lng_in) => {

    //get array of city objects
    let cities = localStorageGet();

    //create new object
    const newCity = {
        name : city,
        lat : lat_in,
        lng : lng_in,
    }
    //add to front of array and only save most 10 recent cities
    cities.unshift(cities);
    cities = cities.slice(0, 10);

    //save to local storage
    localStorage.set('cities', JSON.stringify(cities));
};

//fetching from local storage
const localStorageGet = () => {
    return JSON.parse(localStorage.getItem('cities'));
}