/* ==========================================================================
   Released Under the MIT Licence -- http://opensource.org/licenses/MIT
   ========================================================================== */

var counter, minutes, second, seconds; // "second" is the interval and "seconds" is part of the secToMin(); function

//-------------------- Time Unit Conversion Code ------------------------------------------------//

var secToMin = function (input) {
    "use strict";
    minutes = String(Math.floor(input / 60));
    seconds = input % 60;
    // Leading zero for second values under 10
    if (seconds < 10) {
        String(seconds);
        seconds = "0" + seconds;
    } else {
        String(seconds);
    }
    return minutes + ":" + seconds;
};

var minToSec = function (input) {
    "use strict";
    return input * 60;
};

//-------------------- Timer Code ---------------------------------------------------------------//

var stopTimer = function () {
    "use strict";
    window.clearInterval(second);
};

var timer = function () {
    "use strict";
    $("title, #time").text(secToMin(counter));
    if (counter === 0) {
        stopTimer();
        document.getElementById("alarm").play();
    } else {
        counter -= 1;
    }
};

var startTimer = function () {
    "use strict";
    second = window.setInterval("timer()", 1000);
};

//-------------------- Pomomdoro Code -----------------------------------------------------------//

var pomodorino = function () {
    "use strict";
    counter = 1500; // 25 Minutes
    startTimer();
};

var shortBreak = function () {
    "use strict";
    counter = 300; // 5 Minutes
    startTimer();
};

var longBreak = function () {
    "use strict";
    counter = 900; // 15 Minutes
    startTimer();
};

//-------------------- User Interaction Code ----------------------------------------------------//

$(document).ready(function () {
    "use strict";
    $("#pomodorino").click(function () {
        pomodorino();
    });
    $("#sb").click(function () {
        shortBreak();
    });
    $("#lb").click(function () {
        longBreak();
    });
    $("#start").click(function () {
        startTimer();
    });
    $("#stop").click(function () {
        stopTimer();
    });
});