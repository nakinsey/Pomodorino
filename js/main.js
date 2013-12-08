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
    $("#setPom").val(pomodorinoValue / 60);
    $("#setShort").val(shortBreakValue / 60);
    $("#setLong").val(longBreakValue / 60);
    if (strict) {
        $("#setStrict").attr("checked", "checked");
    } else {
        $("#setStrict").removeAttr("checked");
    }
};

$(document).ready(function () {
    "use strict";
    populateSettings();
});

var toNumber = function (number) {
    "use strict";
    var n = parseInt(number, 10);
    if (n !== n) { // Recommended by MDN in place of isNaN(), until Number.isNaN() is widely implemented
        return "NaN";
    }
    return minToSec(n);
};

var saveSettings = function () {
    "use strict";
    var userPomodorinoValue = toNumber($("#setPom").val()),
        userShortBreakValue = toNumber($("#setShort").val()),
        userLongBreakValue = toNumber($("#setLong").val());

    if (userPomodorinoValue === "NaN" || userPomodorinoValue <= 0) {
        pomodorinoValue = 1500;
    } else {
        pomodorinoValue = userPomodorinoValue;
    }

    if (userShortBreakValue === "NaN" || userShortBreakValue <= 0) {
        shortBreakValue = 300;
    } else {
        shortBreakValue = userShortBreakValue;
    }

    if (userLongBreakValue === "NaN" || userLongBreakValue <= 0) {
        longBreakValue = 900;
    } else {
        longBreakValue = userLongBreakValue;
    }

    strict = $("#setStrict").prop("checked");

    populateSettings();
};

// Save settings on modal close
$(document).on('close', '[data-reveal]', function () {
    "use strict";
    saveSettings();
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
        if (strict && !isPom) {
            pomodorino();
        } else {
            recommend();
        }
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
    
    $("#time").text(secToMin(pomodorinoValue));
});