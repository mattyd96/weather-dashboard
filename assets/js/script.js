function initialize() {
    var options = {
        types: ['(cities)']
    };

    var input = document.getElementById('city-search');
    var autocomplete = new google.maps.places.Autocomplete(input , options);
    console.log(autocomplete);
}

google.maps.event.addDomListener(window, 'load', initialize);