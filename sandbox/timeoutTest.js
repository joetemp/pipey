// setTimeout(function() {console.log('Hey there cowboy!');}, 3000)

var test = setInterval(myCallback, 3000);

function myCallback() {
    console.log("I'm intervaling hard now!");
}
