// Find the 'ul' element (which will contain the shown movies) and name it 'ulElement'
const ulElement         = document.getElementById("moviesList");
// Find the "New Movies" 'checkbox' element and name it 'yearFilterButton'
const yearFilterButton  = document.getElementById("filter1");
// Find the 'searchbar' element and name it 'searchbar'
const searchbar         = document.getElementById("searchbar");

// Make a new empty array and name it 'currentMovies'
let currentMovies   = [];
// Make a new empty array and name it 'filteredMovies'
let filteredMovies  = [];

// Create a variable 'yearFilterOn' that keeps track of wheter the 'yearfilterButton' checkbox is active
let yearFilterOn  = false;
// Create a variable 'yearChecked' that keeps track of wheter an array has been through the 'FilterOnYear' function
let yearChecked   = false;
// Create a variable 'titleFilter' which holds the string to filter the titles by
let titleFilter = "";
// Create a variable 'yearFilter' which holds the year to filter the release dates by
let yearFilter = 2014;

// Create a function 'displayMovies' which displays the movies array it's given on screen
let displayMovies = function (filteredMovies) {

  // If the "New Movies" checkbox is checked, and the array hasn't been through the 'filterOnYear' function...
  if (yearFilterOn == true && yearChecked == false) {
    // Run the array through the 'filterOnYear' function
    filterOnYear (yearFilter);
    return;
  };

  // Set 'yearChecked' to 'false', so they next array can be passed through the 'filterOnYear' function
  yearChecked = false;

  // Empty the list that is currently displayed.
  emptyList(currentMovies);
  
  // Create an 'li' element for every entry (movie) in the array and fill it with information
  // For every movie in the array...
  filteredMovies.forEach(function (movie) {
    // Create new List (<li>) element
    let newListItem = document.createElement("li");
    // Create new Link (<a>) element
    let newLink = document.createElement("a");
    // Create new Image (<img>) element
    let newImage = document.createElement("img");

    // Add a new List element within the unordened list 'moviesList'
    ulElement.appendChild(newListItem);
    // Add a new Link element within the just created List element
    newListItem.appendChild(newLink);
    // Add attributes to the just created Link element
    newLink.setAttribute("href", "https://www.imdb.com/title/" + movie.imdbID);
    newLink.setAttribute("target", "_blank");
    newLink.setAttribute("title", "Go to IMDB page of " + movie.title);
    // Add a new Image element to the just created Link element
    newLink.appendChild(newImage);
    // Add attributes to the just created Image element
    newImage.setAttribute("src", movie.poster);
    newImage.setAttribute("alt", movie.title + " poster");
  });

  // Create an empty string which can be changed to "new" in case the "New Movies" checkbox is on and no movies can be found
  let newText = "";

  // Display an error message if they array is empty (if no movies could be found after applying the current filters)
  // If the array is empty...
  if (filteredMovies.length == 0) {
    // Create one new List (<li>) element
    let newListItem = document.createElement("li");
    // Add the new List element within the unordened list 'moviesList'
    ulElement.appendChild(newListItem);

    // If the "New Movies" checkbox is checked, change 'newText' to "new "
    if (yearFilterOn == true) {
      newText = "new ";
    }
    // If the "New Movies" checkbox is unchecked, change 'newText' to ""
    else {
      newText = "";
    }

    // Add the error text to the just created List element, using "new" if the "New Movies" filter is on, and the filter word
    newListItem.innerHTML = "Sorry, I couldn't find any " + newText + "movies or series containing '" + titleFilter + "'";
    // Add one entry to the 'filteredMovies' array, so the List item containing the error message can be removed with the 'emptyList' function
    filteredMovies = ["Error Message"];
  }

  // Set the 'currentMovies' array to same length as the 'filteredMovies' array (so the full displayed list can be removed with the 'emptyList' function)
  currentMovies = filteredMovies;
};


// Create a function 'emptyList' which removes all the currently displayed movies from the screen 
let emptyList = function (currentMovies) {
  // For each entry in the 'currentMovies' array...
  currentMovies.forEach(function (movie) {
    // Take the first List element in 'moviesList' and delete it
    let liElement = ulElement.getElementsByTagName("li")[0];
    ulElement.removeChild(liElement);
  });
};


// Create a function 'filterOnTitle' which compares the titles in the 'movies' array with a filter word
let filterOnTitle = function (filter) {
  // For each entry in the 'movies' array...
  filteredMovies = movies.filter((movie) => {
    // Check if the filter word is part of the title and if so, add that entry to the 'filteredMovies' array
    // I made both the titles and the filter word lowercase (during the search) to avoid having to search for case sensitive words (eg. "Batman" vs "batman")
    return movie.title.toLowerCase().includes(filter.toLowerCase());
  });

  // Run 'displayMovies' with the new 'filteredMovies' array
  displayMovies(filteredMovies);
};


// Create a function 'filterOnTitle' which compards the release dates in the 'movies' array with a filter year (default: 2014)
let filterOnYear = function (filter) {
  // For each entry in the 'filteredMovies' array...
  filteredMovies = filteredMovies.filter((movie) => {
    // Check if the filter year is equal or earlier than the release date and if so, add that entry to the new 'filteredMovies' array
    // I'm checking against the last 4 characters of the "year" string in case of series with a longer span. If the series hasn't ended before the filter year it is still added to the array
    // (I am aware that I am comparing a string with an integer here, but javascript allows for that, which makes it easier for me) (parseInt(movie.year) would be another approach)
    return movie.year.slice(-4) >= filter;
  });

  // Set 'yearChecked' to 'true' so we won't end up in a loop when we run 'displayMovies' again
  yearChecked = true;

  // Run 'displayMovies' with the new 'filteredMovies' array 
  displayMovies(filteredMovies);
};


// Add an EventListeners to the "New Movies" checkbox
yearFilterButton.addEventListener("change", function() {
  // If it is checked...
  if (this.checked == true) {
    // Set 'yearFilterOn' to 'true'
    yearFilterOn = true;
    // Run 'displayedMovies' with the 'filteredMovies' array (which will get run through 'filterOnYear' now, because the checkbox was just checked)
    displayMovies(filteredMovies);
  }
  // If it is unchecked...
  else {
    // Set 'yearFilterOn' to 'false'
    yearFilterOn = false;
    // Run 'filterOnTitle' with the last known 'titleFilter', without running it through 'filterOnYear' again
    filterOnTitle(titleFilter);
  }
});


// Add an EventListener to the "Search by Title" submit button
searchbar.addEventListener("submit", function(event) {
  // Prevent the page from reloading (and erasing the current filters) when submitting a new search
  event.preventDefault();
  // Get the user input and use it as the filter word while running 'filterOnTitle'
  titleFilter = document.getElementById("searchbarInput").value;
  filterOnTitle(document.getElementById("searchbarInput").value);

  // Uncheck every radiobutton when submitting a new search (otherwise it might look like one of the pre-set filters is still active, during a custom user input search)
  document.getElementsByName("movieFilter").forEach((element) => {
    element.checked = false;
  })
})


// Add an EventListener for every radiobutton
document.getElementsByName("movieFilter").forEach((element) => {
  element.addEventListener("change", function(event) {
    let filterName = event.target.value;

    // Change the 'titleFilter' depending on the active radiobutton, and run 'filterOnTitle' with that filter word
    switch (filterName) {
      case "avenger":
        titleFilter = "Avengers";
        filterOnTitle(titleFilter);
        break;

      case "x-men":
        titleFilter = "X-Men";
        filterOnTitle(titleFilter);
        break;

      case "princess":
        titleFilter = "Princess";
        filterOnTitle(titleFilter);
        break;

      case "batman":
        titleFilter = "Batman";
        filterOnTitle(titleFilter);
        break;

      case "reset":
        titleFilter = "";
        filterOnTitle(titleFilter);
        break;

      default:
        titleFilter = "";
        filterOnTitle(titleFilter);
    };
  });
});

// Run 'filterOnTitle' for the first time when loading the script (using default: "")
filterOnTitle(titleFilter);