$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCqo5AAhAUfMpF9_CsDaCBRodYx0lWxDCk",
        authDomain: "test-project-4ed2e.firebaseapp.com",
        databaseURL: "https://test-project-4ed2e.firebaseio.com",
        projectId: "test-project-4ed2e",
        storageBucket: "test-project-4ed2e.appspot.com",
        messagingSenderId: "137134483420"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    //Declaring variables
    var trainName = "";
    var destination = "";
    var firstTime = "";
    var frequency = 0;
    
    //Create click event
    $("#submit").on("click", function(event) {
        event.preventDefault();

        //Capturing the user input from the form input fields
        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTime = $("#first-time").val().trim()
        frequency = $("#frequency").val().trim();
        

        //Code for the push
        database.ref().push({

            trainName : trainName,
            destination : destination,
            firstTime : firstTime,
            frequency : frequency

        })

        // Clears all of the form fields
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-time").val("");
        $("#frequency").val("");

    });

    //Create Firebase event for adding train info to the database and a row to table
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());
  
        // Store everything into a variable.
        trainName = childSnapshot.val().trainName;
        destination = childSnapshot.val().destination;
        firstTime = childSnapshot.val().firstTime;
        frequency = childSnapshot.val().frequency;

        //Calculating the time of next train using moment.js
        var currentTime = moment();
        var firstTimeMoment = moment(firstTime, "HH:mm");

        var timeSinceFirstArrival = currentTime.diff(firstTimeMoment, "minutes");
        var timeSinceLastArrival = timeSinceFirstArrival % frequency;
        var minutesAway = frequency - timeSinceLastArrival;

        var nextArrival = currentTime.add(minutesAway, "minutes").format("HH:mm");

        //Make a new row and append to page
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(nextArrival),
            $("<td>").text(minutesAway)
        );

        $("#train-table").append(newRow);

    }, function (errorObject) {

        // In case of error this will print the error
          console.log("The read failed: " + errorObject.code);
    });

});