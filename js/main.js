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

//-------------------- Settings Code ------------------------------------------------------------//

var pomodorinoValue = 1500; // 25 Minutes
var shortBreakValue = 300; // 5 Minutes
var longBreakValue = 900; // 15 Minutes
var strict = false;

var populateSettings = function () {
    "use strict";
    $("#setPom").attr("value", pomodorinoValue / 60);
    $("#setShort").attr("value", shortBreakValue / 60);
    $("#setLong").attr("value", longBreakValue / 60);
    if (strict) {
        $("#setStrict").attr("checked", "checked");
    }
};

$(document).ready(function () {
    "use strict";
    populateSettings();
});

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
        $("#count4").css("background-color", "#2ba6cb");
        pomCount = 0;
    } else if (pomCount === 3) {
        $("#count3").css("background-color", "#2ba6cb");
    } else if (pomCount === 2) {
        $("#count2").css("background-color", "#2ba6cb");
    } else if (pomCount === 1) {
        $("#count1").css("background-color", "#2ba6cb");
    } else {
        $(".counter").css("background-color", "#fff");
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
    counter = pomodorinoValue;
    printOut();
    startTimer();
    $("#start").addClass("hide");
    $("#stop").removeClass("hide");
    isPom = true;
};

var shortBreak = function () {
    "use strict";
    clearRecommendation();
    counter = shortBreakValue;
    printOut();
    startTimer();
    $("#start").addClass("hide");
    $("#stop").removeClass("hide");
    isPom = false;
};

var longBreak = function () {
    "use strict";
    clearRecommendation();
    counter = longBreakValue;
    printOut();
    startTimer();
    $("#start").addClass("hide");
    $("#stop").removeClass("hide");
    isPom = false;
};

//-------------------- User Interaction Code ----------------------------------------------------//

$(document).ready(function () {
    "use strict";
    $("#pomodorino").click(function () {
        pomodorino();
        document.getElementById("alarm").play(); // Media only loads on a click for mobile browsers
        document.getElementById("alarm").pause();
    });
    $("#sb").click(function () {
        shortBreak();
        document.getElementById("alarm").play();
        document.getElementById("alarm").pause();
    });
    $("#lb").click(function () {
        longBreak();
        document.getElementById("alarm").play();
        document.getElementById("alarm").pause();
    });
    $("#start").click(function () {
        startTimer();
        $("#start").addClass("hide");
        $("#stop").removeClass("hide");
    });
    $("#stop").click(function () {
        stopTimer();
        $("#stop").addClass("hide");
        $("#start").removeClass("hide");
        $("title").text("Pomodorino (PAUSED)");
        $("#time").text("PAUSED");
    });
});