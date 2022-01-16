# Weather Dashboard

A weather dashboard that can take in a city search using google's places [autocomplete API](https://developers.google.com/maps/documentation/javascript/places-autocomplete) to get weather data from open weather's [one call API](https://openweathermap.org/api/one-call-api). Data visualization is handled by [chart.js](https://www.chartjs.org/). This has been created for a bootcamp assignment to satisfy the following user story and acceptance citeria.

<br/>
## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```


## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```


## Screenshot

![Demo GIF](./assets/demo/demo.gif)

## Notes

### Functionality limitations
At the moment this is set to work with google's autocomplete API. The limitation of this is that a user has to select a location from the drop down, for a proper response to come from the API. The alternative is to googles place Search which would return an array of locations based on an arbitrary string. However, I found this to be too vague when searching for specific cities, where there might be two locations and no way to tell which one the user wants. For this reason, I kept the autocomplete version as it forces the user to give a valid search input.

### Additional Features

There were a few things that I wanted to try, and this application was a good place to test them.
<br/><br/>

**Temperature Chart**
<br/>
Using the hourly array provided by the weather API. I created a chart of tempurature over the next two days in 3 hour steps. This was done using [chart.js](https://www.chartjs.org/).
<br/><br/>

**Theme Selection**
<br/>
Functionality allowing a user to select a light or dark theme, which is then saved to localStorage and applied when a user returns.
<br/><br/>

**Instruction Modal**
<br/>
A modal that explains to the user how to use the app. This also points out the limitation of the search bar, so that the user knows the proper way to search for a location.

## Links

[Live Website](https://mattyd96.github.io/weather-dashboard/)  

[My Github Account](https://github.com/mattyd96)