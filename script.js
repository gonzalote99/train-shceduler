$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyB_4M-euWD8Jh3obPfVMh6Nn0-yTfPIgV8",
    authDomain: "traintime-e3d39.firebaseapp.com",
    databaseURL: "https://traintime-e3d39.firebaseio.com",
    projectId: "traintime-e3d39",
    storageBucket: "traintime-e3d39.appspot.com",
    messagingSenderId: "840554239570"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#submit").on("click", function() {
    event.preventDefault();
   var name = $('#nameInput').val().trim();
   var dest = $('#destInput').val().trim();
   var time = $('#timeInput').val().trim();
   var freq = $('#freqInput').val().trim();

   database.ref().push({
     name : name,
     dest : dest,
     time : time,
     freq : freq,
     timeAdded : firebase.database.ServerValue.TIMESTAMP
   });
   $("input").val('');
   return false;

  });

  database.ref().on("child_added", function(childSnapshot) {
    var name = childSnapshot.val().name;
    var dest = childSnapshot.val().dest;
    var time = childSnapshot.val().time;
    var freq = childSnapshot.val().freq;

    console.log("name:" + name);
    console.log("dest:" + dest);
    console.log("time:" + time);
    console.log("freq:" + freq);


  var freq = parseInt(freq);
  var currentTime = moment();
  console.log("current time:" + moment().format('HH:mm'));
  var dConverter = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
  console.log("converter:" + dConverter);
  var trainTime = moment(dConverter).format('HH:mm');
  console.log("traintime:" + trainTime);

  var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
  var tDifference = moment().diff(moment(tConverted), 'minutes');
  console.log("difference" + tDifference);
  var tRemainder = tDifference % freq;
  console.log("timeR" + tRemainder);
  var minsAway = freq - tRemainder;
  console.log("minsA" + minsAway);
  var nextTrain = moment().add(minsAway, 'minutes');
  console.log("arrival" + moment(nextTrain).format('HH:mm A'));


  $('#currentTime').text(currentTime);
  $('#trainTable').append(
    "<tr><td id='nameDisplay'>" + childSnapshot.val().name + 
    "</td><td id='destDisplay'>" + childSnapshot.val().dest +
    "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
    "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
    "</td><td id='awayDisplay'>" + minsAway + ' to min arrival' + "</td></tr>" );


  },
  
  function(errorObject) {
    console.log("failed" + errorObject.code);
  } );

});