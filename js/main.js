/* ==========================================================================
   Released Under the MIT Licence -- http://opensource.org/licenses/MIT
   ========================================================================== */
/*jslint browser:true*/
/*global $, Notify*/
/*jshint camelcase:true, curly:true, eqeqeq:true, freeze:true, newcap:true, quotmark:double, strict:true, trailing:true, browser:true, jquery:true*/

var initValue, minutes, second, seconds; // "second" is the interval and "seconds" is part of the secToMin(); function
var counter = 1500;

//-------------------- Time Unit Conversion -----------------------------------------------------//

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

//-------------------- Settings -----------------------------------------------------------------//

var pomodorinoValue = 1500; // 25 Minutes
var shortBreakValue = 300; // 5 Minutes
var longBreakValue = 900; // 15 Minutes
var strict = false;


$(document).ready(function () {
    "use strict";
    var custom = localStorage.getItem("custom"),
        getPomodorino = localStorage.getItem("pomodorino"),
        getShortBreak = localStorage.getItem("shortBreak"),
        getLongBreak = localStorage.getItem("longBreak"),
        getStrict = localStorage.getItem("strict");
    if (custom === "true") {
        pomodorinoValue = parseInt(getPomodorino, 10);
        shortBreakValue = parseInt(getShortBreak, 10);
        longBreakValue = parseInt(getLongBreak, 10);

        if (getStrict === "true") {
            strict = true;
        }
    }
});

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
    if (isNaN(n)) { // Recommended by MDN in place of isNaN(), until Number.isNaN() is widely implemented
        return "NaN";
    }
    return minToSec(n);
};

var saveSettings = function () {
    "use strict";
    var userPomodorinoValue = toNumber($("#setPom").val()),
        userShortBreakValue = toNumber($("#setShort").val()),
        userLongBreakValue = toNumber($("#setLong").val());

    if (userPomodorinoValue === "NaN" || userPomodorinoValue <= 0 || userPomodorinoValue >= 3600) {
        pomodorinoValue = 1500;
        localStorage.setItem("pomodorino", "1500");
    } else {
        pomodorinoValue = userPomodorinoValue;
        localStorage.setItem("pomodorino", userPomodorinoValue);
    }

    if (userShortBreakValue === "NaN" || userShortBreakValue <= 0 || userShortBreakValue >= 3600) {
        shortBreakValue = 300;
        localStorage.setItem("shortBreak", "300");
    } else {
        shortBreakValue = userShortBreakValue;
        localStorage.setItem("shortBreak", userShortBreakValue);
    }

    if (userLongBreakValue === "NaN" || userLongBreakValue <= 0 || userLongBreakValue >= 3600) {
        longBreakValue = 900;
        localStorage.setItem("longBreak", "900");
    } else {
        longBreakValue = userLongBreakValue;
        localStorage.setItem("longBreak", userLongBreakValue);
    }

    strict = $("#setStrict").prop("checked");
    if (strict) {
        localStorage.setItem("strict", "true");
    } else {
        localStorage.setItem("strict", "false");
    }

    localStorage.setItem("custom", "true");

    populateSettings();
};

// Save settings on modal close
$(document).on("close", "[data-reveal]", function () {
    "use strict";
    saveSettings();
});

//-------------------- Desktop Notifications ----------------------------------------------------//

var permission = false;

var havePermission = function () {
    "use strict";
    permission = true;
};

var breakEnd = new Notify("Pomodorino", {
    body: "Time to get back to work!"
});
var pomodorinoEnd = new Notify("Pomodorino", {
    body: "Take a break; you earned it!",
    permissionGranted: havePermission
});

$(document).ready(function () {
    "use strict";
    $("#notify").click(function () {
        if (pomodorinoEnd.needsPermission()) {
            pomodorinoEnd.requestPermission();
        }
    });
});

//-------------------- Pomodorino Recommendation ------------------------------------------------//

var isPom = false;
var pomCount = 0;

var recommend = function () {
    "use strict";
    if (isPom) {
        pomCount += 1;
        pomodorinoEnd.show();
    } else {
        breakEnd.show();
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

//-------------------- Progress Bar -------------------------------------------------------------//

var progress = function () {
    "use strict";
    var bar = counter / initValue;
    bar = (1 - bar) * 100;
    String(bar);
    bar = bar + "%";
    $(".meter").css("width", bar);
};

//-------------------- Timer --------------------------------------------------------------------//

var printOut = function () {
    "use strict";
    var currentTime = secToMin(counter);
    $("title").text("Pomodorino (" + currentTime + ")");
    $("#time").text(currentTime);
    progress();
};

var stopTimer = function () {
    "use strict";
    clearInterval(second);
};

var startTimer = function () {
    "use strict";
    clearInterval(second); // To ensure that there is only one timer running, cancel any previous ones.
    second = setInterval(function timer() {
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
    }, 1000);
};

//-------------------- Pomomdoro ----------------------------------------------------------------//

var pomodorino = function () {
    "use strict";
    clearRecommendation();
    counter = pomodorinoValue;
    initValue = pomodorinoValue;
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
    initValue = shortBreakValue;
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
    initValue = longBreakValue;
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
    });
    $("#lb").click(function () {
        longBreak();
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

//-------------------- Tour (Joyride) -----------------------------------------------------------//

$(document).ready(function () {
    "use strict";
    $("#tour").click(function () {
        $("#help").foundation("reveal", "close");
        $(document).foundation("joyride", "start");
    });
});