$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDXcrKkSJALcjMMYfoYjh4BBHTxZg4hSmY",
        authDomain: "train-schedule-af36c-f5b56.firebaseapp.com",
        databaseURL: "https://train-schedule-af36c-f5b56.firebaseio.com",
        projectId: "train-schedule-af36c",
        storageBucket: "train-schedule-af36c.appspot.com",
        messagingSenderId: "835851321143",
        appId: "1:835851321143:web:8f892b23069a878f"
      };
      
      firebase.initializeApp(config);

      var database = firebase.database()

      $("#add-train-button").on("click", function (event) {
        event.preventDefault();
    
        // grab user input from form
        var trainName = $("#train-name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var trainFirstTime = $("#first-train-input").val().trim();
        var trainFrequency = $("#frequency-input").val().trim();
    
        // Save user input as newTrain object
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            first: trainFirstTime,
            frequency: trainFrequency
        };
    
        // Write newTrain object to database
        database.ref().push(newTrain);

        //Logging everything to the console
        // console.log(trainName);
        // console.log(trainDestination);
        // console.log(trainFirstTime);
        // console.log(trainFrequency);
    
        // Clearing input
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");
    });
       
    // Listen for child added event
    database.ref().on("child_added", function (childSnapshot) {

      var trainName = childSnapshot.val().name;
      var trainDestination = childSnapshot.val().destination;
      var trainFirstTime = childSnapshot.val().first;
      var trainFrequency = childSnapshot.val().frequency;
  
      // --------------------------------------
      // saturates info put into form
      var trainFreq = parseInt(trainFrequency);
    
      var firstTime = moment(trainFirstTime, "HH:mm");
  
      // Difference in minutes between train added and the current time
      var differenceTime = moment().diff(moment(firstTime), "minutes");
  
      // Remainder of above difference when divided by train frequency
      var timeRemainder = differenceTime % trainFreq;
  
      // Minute Until Train variable that we'll use
      var MinutesUntillTrain;
      
      // If the first train has already arrived
      if (differenceTime >= 0) { 
          MinutesUntillTrain = trainFreq - timeRemainder;
      }

      // If the first train of the day hasn't arrived yet
      else if (differenceTime < 0) { 
          MinutesUntillTrain = -differenceTime + 1;
      }
  
      // Next Train Time variable that will be appended to the screen
      var nextArrival = moment().add(MinutesUntillTrain, "minutes");
  
      // --------------------------------------------------------
  
  
      var newRow = $("<tr>").append(
          $("<td>").text(trainName),
          $("<td>").text(trainDestination),
          $("<td>").text(trainFrequency),
          $("<td>").text(moment(nextArrival).format("hh:mm a")),
          $("<td>").text(MinutesUntillTrain)
      );
  
  
      $("#train-table > tbody").append(newRow);
  });
});