let initial1;
let inid = $("#initial");
let index = 0;
let initial = '';
let timer = 0;
let quotes = [];
let started = false;
let wordCount = 0;
let visibleStartIndex = 0;
const maxVisibleLines = 3;
const charsPerLine = 58;
let errors = 0;
let quote;


$(document).ready(function () {
    fetchQuotes();
});

$(window).keydown(function (evt) {
    evt = evt || window.event;
    let charCode = evt.which || evt.keyCode;
    if (started) {
        if (charCode === 8) {
            if (index > 0) {
                index--;
                inid.text(initial.substring(index, visibleStartIndex + maxVisibleLines * charsPerLine))
                if ($("#box span:nth-last-child(3)").text() === ' ') {
                    wordCount--;
                }
                if ($("#box span:nth-last-child(3)").hasClass("wrong")) {
                    errors--;
                }
                $("#box span:nth-last-child(3)").remove();
                adjustVisibleText();
                cursorManage();
            }
            evt.preventDefault();
        }
    }
});

$(window).keypress(function (evt) {
    if (started) {
        evt = evt || window.event;
        let charCode = evt.which || evt.keyCode;
        let charTyped = String.fromCharCode(charCode);
        startTimer();
        if (index >= initial.length - 1) {
            finishTest(timer);
        }
        if (charTyped === initial.charAt(index)) {
            if (initial.charAt(index) === ' ') {
                wordCount++;
            }
            right(initial.charAt(index));
            index++;
        } else if (initial.charAt(index) === ' ' && charTyped !== initial.charAt(index)) {
            wrongS(initial.charAt(index))
            errors++;
            index++;
        } else {
            wrong(initial.charAt(index));
            errors++;
            index++;
        }
        inid.text(initial.substring(index, visibleStartIndex + maxVisibleLines * charsPerLine))
        adjustVisibleText();
    }
});

function right(val) {
    $("#cursor").before("<span class='correct'>" + val + "</span>");
}

function wrong(val) {
    $("#cursor").before("<span class='wrong'>" + val + "</span>");
}

function wrongS(val) {
    $("#cursor").before("<span class='wrongSpace'>" + val + "</span>");
}

function startTimer() {
    if (!started) {
        started = true;
        interval_timer = setInterval(function () {
            timer++;
            const remainingTime = 30 - timer;
            $("#timer").text(remainingTime);

            if (remainingTime < 0) {
                finishTest(30);
            }
        }, 1000);
    }
}

function stopTimer() {
    started = false;
    clearInterval(interval_timer);
    timer = 0;
    $("#timer").text(30);
}

function finishTest(time) {
    stopTimer();
    $("#result").removeClass("hidden");
    let accuracy = 100 - Math.round(errors / index * 100)
    if (accuracy <= 0) accuracy = 0;
    let wpm = Math.round(index / (5 * time) * 60) - errors;
    if (wpm < 0) wpm = 0;
    $("#wpm").text(wpm)
    $("#accu").text(accuracy + "%")
    reset();
}

function adjustVisibleText() {
    if (index >= visibleStartIndex + (maxVisibleLines - 1) * charsPerLine) {
        delSpan();
        visibleStartIndex += charsPerLine;
    }

    changeVisText();
}

function changeVisText() {
    const endIndex = Math.min(
        visibleStartIndex + maxVisibleLines * charsPerLine,
        initial.length
    );
    const visibleText = initial.substring(index, endIndex);
    $("#initial").text(visibleText);
}

function delSpan() {
    let charCount = 0;

    $("#box span").each(function () {
        const text = $(this).text();
        charCount += text.length;

        if (charCount <= charsPerLine) {
            $(this).remove();
        } else {
            return false;
        }
    });
}

function reset() {
    $("#box span").each(function () {
        const text = $(this).text();

        if (text.length === 1) {
            $(this).remove();
        } else {
            return false;
        }
    });
    index = 0;
    wordCount = 0;
    timer = 0;
    errors = 0;
    visibleStartIndex = 0;
    stopTimer();
    $("#focus").removeClass("hidden");
    changeVisText();
    cursorManage();
}

async function fetchQuotes() {
    const numberOfQuotes = 1;

    let promises = Array.from({ length: numberOfQuotes }, () =>
        fetch("https://quotes-api-self.vercel.app/quote")
            .then(response => response.json())
            .then(data => {
                const fetchedQuote = data.quote.toString().trim();
                quotes.push(fetchedQuote);
            })
            .catch(error => console.error('Error fetching quote:', error))
    );

    await Promise.all(promises);

    initial = quotes.join(' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '').trim();
    const txt = initial.replace(/\s+/g, ' ').trim();
    inid.text(txt);
    changeVisText();
    cursorManage();
}

function cursorManage() {
    const lastSpan = $("#box span:last");
    lastSpan.before($("#cursor"));
}

$("#close").click(function () {
    location.reload();
    $("#result").addClass("hidden");
});

$("#focus").click(function () {
    if ($("#result").hasClass("hidden")) {
        startTimer();
        $("#result").addClass("hidden");
        $("#focus").addClass("hidden");
    }
});

$("#restart").click(function () {
    reset();
    fetchQuotes()
});

$("#back").click(function () {
    window.location.pathname = './index.html';
});