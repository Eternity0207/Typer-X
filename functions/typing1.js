let time_setting = 100;
let random_setting = 20;
let input_text = "How fast can you type?";
let target_setting = $("#output");

function type(input, target, current, time, random, isDeleting = false) {
    if (!isDeleting && current > input.length) {
        setTimeout(function () {
            type(input, target, current, time, random, true);
        }, 1000);
    }
    else if (isDeleting && current === 0) {
        setTimeout(function () {
            type(input, target, current, time, random, false);
        }, 500);
    }
    else {
        current = isDeleting ? current - 1 : current + 1;

        target.text(input.substring(0, current));

        setTimeout(function () {
            type(input, target, current, time, random, isDeleting);
        }, time + Math.random() * random);
    }
}

let letters = '';
fetch("https://baconipsum.com/api/?type=all-meat&sentences=5&format=json")
    .then(response => response.json())
    .then(data => {
        const sentence = data.join(' ');
        $("#input_text").text(sentence);
        letters = sentence;
        console.log(sentence);
        startTypingTest(); 
        type(input_text, target_setting, 0, time_setting, random_setting);
    })
    .catch(error => {
        console.error("Error fetching random sentences:", error);
    });

const popup = $("#popup");
const closePopupButton = $("#closePopup");

function closePopup() {
    popup.addClass("hidden");
    location.reload(true);
}

closePopupButton.on("click", closePopup);

function startTypingTest() {
    let character_length = 51;
    let index = 0;
    let started = false;
    let current_string = letters.substring(index, index + character_length);
    let wordcount = 0;

    $("#target").text(current_string);

    $(window).keypress(function (evt) {
        if (!started) {
            startTimer();
            started = true;
        }

        evt = evt || window.event;
        let charCode = evt.which || evt.keyCode;
        let charTyped = String.fromCharCode(charCode);

        if (started && !paused) {
            if (charTyped === letters.charAt(index)) {
                if (charTyped === " ") {
                    wordcount++;
                    $("#wordcount").text(wordcount);
                }
                index++;
                current_string = letters.substring(index, index + character_length);
                $("#target").text(current_string);
                $("#your-attempt").append(charTyped);

                let wpm = Math.round((wordcount / timer) * 60);
                if (!wpm || wpm === NaN) wpm = 0;
                $("#wpm").text(wpm);

                if (index === letters.length) {
                    wordcount++;
                    $("#wordcount").text(wordcount);
                    stopTimer();
                    let accuracy = 100 - Math.round((errors / letters.length) * 100)
                    if (accuracy < 0) accuracy = 0;
                    showPopup("Words per minute : " + `${wpm} ` + " Wordcount : " + `${wordcount} ` + " Accuracy : " + accuracy + "%");
                }
            } else {
                $("#your-attempt").append("<span class='wrong'>" + charTyped + "</span>");
                errors++;
                $("#errors").text(errors);
            }
        }
    });
}

function showPopup(message) {
    popup.removeClass("hidden");
    $("#popupMessage").text(message);
}

var timer = 0;
var wpm = 0;
var errors = 0;
var interval_timer;
var paused = false;

$("#reset").click(function () {
    resetTest();
});

$("#pause").click(function () {
    togglePause();
});

$("#change").click(function () {
    window.location.pathname = './index.html';
});

function startTimer() {
    if (!paused) {
        interval_timer = setInterval(function () {
            timer++;
            $("#timer").text(timer);
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(interval_timer);
}

function togglePause() {
    if (paused) {
        paused = false;
        startTimer();
        $("#pause").text("Pause II");
    } else {
        paused = true;
        stopTimer();
        $("#pause").text("Resume ▶️");
    }
}

function resetTest() {
    startTypingTest();
    $("#your-attempt").text(" ");
    wpm = 0;
    index = 0;
    errors = 0;
    timer = 0;
    $("#wpm").text('0')
    $("#wordcount").text('0')
    $("#timer").text('0')
    $("#errors").text('0')
    stopTimer()
}
