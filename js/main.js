/* ==========================================================================
   Released Under the MIT Licence -- http://opensource.org/licenses/MIT
   ========================================================================== */

var minutes, second, seconds; // "second" is the interval and "seconds" is part of the secToMin(); function
var counter = 1500;

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

//-------------------- Pomodorino Recommendation Code -------------------------------------------//

var isPom = false;
var pomCount = 0;

var recommend = function () {
    "use strict";
    if (isPom) {
        pomCount += 1;
    }

    if (isPom && pomCount === 4) {
        $("#lb").addClass("recommended");
    } else if (isPom && pomCount > 0) {
        $("#sb").addClass("recommended");
    } else {
        $("#pomodorino").addClass("recommended");
    }

    if (pomCount === 4) {
        $("#count4").css("background-color", "#333");
        pomCount = 0;
    } else if (pomCount === 3) {
        $("#count3").css("background-color", "#333");
    } else if (pomCount === 2) {
        $("#count2").css("background-color", "#333");
    } else if (pomCount === 1) {
        $("#count1").css("background-color", "#333");
    } else {
        $(".counter").css("background-color", "#F0F0F0");
    }

    isPom = false;
};

var clearRecommendation = function () {
    "use strict";
    $(".recommended").removeClass("recommended");
};
//-------------------- Timer Code ---------------------------------------------------------------//

var printOut = function () {
    "use strict";
    var currentTime = secToMin(counter);
    $("title").text("Pomodorino (" + currentTime + ")");
    $("#time").text(currentTime);
};

var stopTimer = function () {
    "use strict";
    window.clearInterval(second);
};

var timer = function () {
    "use strict";
    counter -= 1;
    printOut();
    if (counter === 0) {
        stopTimer();
        document.getElementById("alarm").play();
        recommend();
    }
};

var startTimer = function () {
    "use strict";
    window.clearInterval(second); // To ensure that there is only one timer running, cancel any previous ones.
    second = window.setInterval("timer()", 1000);
};

//-------------------- Pomomdoro Code -----------------------------------------------------------//

var pomodorino = function () {
    "use strict";
    clearRecommendation();
    counter = 1500; // 25 Minutes
    printOut();
    startTimer();
    $("#start").css("display", "none");
    $("#stop").css("display", "inline");
    isPom = true;
};

var shortBreak = function () {
    "use strict";
    clearRecommendation();
    counter = 300; // 5 Minutes
    printOut();
    startTimer();
    $("#start").css("display", "none");
    $("#stop").css("display", "inline");
    isPom = false;
};

var longBreak = function () {
    "use strict";
    clearRecommendation();
    counter = 900; // 15 Minutes
    printOut();
    startTimer();
    $("#start").css("display", "none");
    $("#stop").css("display", "inline");
    isPom = false;
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
        $("#start").css("display", "none");
        $("#stop").css("display", "inline");
    });
    $("#stop").click(function () {
        stopTimer();
        $("#stop").css("display", "none");
        $("#start").css("display", "inline");
        $("title").text("Pomodorino (PAUSED)");
        $("#time").text("PAUSED");
    });
});

//-------------------- Settings Code ------------------------------------------------------------//

$(document).ready(function () {
    "use strict";
    $(".icon-cog").click(function () {
        $(".dimmer").css("display", "block");
        $("#settings").css("display", "block");
    });
});