require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");
var omdb = require("omdb");
var fs = require("fs");

var getTweets = function getTweets() {
  var twitterClient = new Twitter(keys.twitter);
  var parameters = {
    screen_name: "sbutters12345",
    count: 20
  };
  twitterClient.get("statuses/user_timeline", parameters, function(err, data) {
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].created_at);
      console.log(data[i].text);
      console.log("--------------------------------------------");
    }
  });
};

var getSpotify = function getSpotify() {
  var spotifyClient = new Spotify(keys.spotify);

  inquirer
    .prompt({
      type: "input",
      message: "What song do you want to search?",
      name: "userInput"
    })
    .then(function(answer) {
      var songName = answer.userInput;

      spotifyClient.search(
        {
          type: "track",
          query: songName,
          limit: 20
        },
        function(err, data) {
          if (err) {
            return console.log("Error occurred: " + err);
          }

          if (answer === " " || null) {
            console.log("ACE OF BASE - THE SIGN");
          } else {
            var songInfo = data.tracks.items[0];
            var songResult = console.log(songInfo.artists[0].name);
            console.log(songInfo.name);
            console.log(songInfo.album.name);
            console.log(songInfo.preview_url);
          }
          getCommand();
        }
      );
    });
};

var getMovie = function getMovie() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Which movie do you want to search?",
        name: "userInput"
      }
    ])
    .then(function(movie) {
      // console.log(movie.userInput);
      var request = require("request");
      var movieName = movie.userInput;
      var queryURL =
        "http://www.omdbapi.com/?t=" +
        movieName +
        "&y=&plot=short&apikey=trilogy";
      // console.log(queryURL);
      request(queryURL, function(error, response, body) {
        if (!error && !movieName) {
          return console.log(`
          Title: Mr. Nobody 
          Year: 2009
          IMDB Rating: 7.9
          Rotten Tomatoes Rating: 66%
          Country: Belgium, Germany, Canada, France, USA, UK
          Language: English, Mohawk
          Plot: A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't choose, anything is possible.
          Actors: Jared Leto, Sarah Polley, Diane Kruger, Linh Dan Pham
          `);
        }
        if (!error && response.statusCode === 200) {
          console.log("Title: " + JSON.parse(body).Title);
          console.log("Year: " + JSON.parse(body).Year);
          console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
          console.log(
            "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
          );
          console.log("Country: " + JSON.parse(body).Country);
          console.log("Language: " + JSON.parse(body).Language);
          console.log("Plot: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors);
        } else if (error) {
          console.log("An error occured: " + error);
        }
      });
    });
};

var doWhatItSays = function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");

    for (var i = 0; i < dataArr.length; i++) {
      var functionToRun = dataArr[0];
      var toFind = dataArr[1];
      //pseudocode -- if the readFile comes back with "x" action, then run "y" function
      if (functionToRun === "getTweets") {
        getTweets(toFind);
      } else if (functionToRun === "getSpotify") {
        getSpotify(toFind);
      } else if (functionToRun === "getMovie") {
        getMovie(toFind);
      } else {
        console.log("I don't have anything else.");
      }
    }
  });
};

function getCommand() {
  inquirer
    .prompt({
      name: "command",
      type: "rawlist",
      message: "Which command would you like to run?",
      choices: [
        "Get Tweets",
        "Search for a song",
        "Search for a movie",
        "Do what it says"
      ]
    })
    .then(function(answer) {
      var command = answer.command;

      switch (command) {
        case "Get Tweets":
          getTweets();
          break;
        case "Search for a song":
          getSpotify();
          break;
        case "Search for a movie":
          getMovie();
          break;
        case "Do what it says":
          doWhatItSays();
          break;
        default:
          console.log("Please try again.");
      }
    });
}

getCommand();
