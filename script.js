let seconds = 0;
let minutes = 0;
let hours = 0;
let display_seconds = 0;
let display_minutes = 0;
let display_hours = 0;
let interval = null;
let status = "stopped";

window.addEventListener('beforeunload', function(e) {

    e.preventDefault()

    localStorage.setItem('closed-time', new Date());
    localStorage.setItem('Time', JSON.stringify({ hours, minutes, seconds }));
    localStorage.setItem('stat', status);
});

window.addEventListener('load', function(e) {

    let close_time = localStorage.getItem('closed-time');
    let elapsed_time = (new Date().getTime() - new Date(close_time).getTime()) / 1000;
    let duration = JSON.parse(localStorage.getItem('Time'));
    let time_to_sec = calculateDuration(duration.hours, duration.minutes, duration.seconds);

    // timer still running when the tab closed or refreshed
    if (localStorage.getItem('stat') === "paused") {
        seconds = Math.floor(elapsed_time + time_to_sec);

        // get multiple return value
        // from https://stackoverflow.com/questions/2917175/return-multiple-values-in-javascript
        let valueTime = secondToTime(seconds)
        hours = valueTime[0]
        minutes = valueTime[1]
        seconds = valueTime[2] - 1 // -1 because startTimer() starting with seconds++
        startTimer() // set time when first load
        startstopcontinue(); // rev for timer auto play when refresh
    }

    // timer paused when the tab closed or refreshed
    if (localStorage.getItem('stat') === "continue") {
        hours = duration.hours
        minutes = duration.minutes
        seconds = duration.seconds - 1 // -1 because startTimer() starting with seconds++
        status = "paused"
        startTimer()
        startstopcontinue()
    }

});

function startTimer() {
    seconds++;
    if (seconds / 60 === 1) {
        seconds = 0;
        minutes++;
        if (minutes / 60 === 1) {
            minutes = 0;
            hours++;
        }
    }
    if (seconds < 10) {
        display_seconds = "0" + seconds.toString();
    } else {
        display_seconds = seconds;
    }
    if (minutes < 10) {
        display_minutes = "0" + minutes.toString();
    } else {
        display_minutes = minutes;
    }
    if (hours < 10) {
        display_hours = "0" + hours.toString();
    } else {
        display_hours = hours;
    }
    document.getElementById('hours').innerHTML = display_hours;
    document.getElementById('minutes').innerHTML = display_minutes;
    document.getElementById('seconds').innerHTML = display_seconds;
}

function startstopcontinue() {
    if (status === "stopped") {
        interval = window.setInterval(startTimer, 1000);
        document.getElementById("start-stop-continue").innerHTML = "Pause";
        status = "paused";
    } else if (status === "paused") {
        window.clearInterval(interval);
        document.getElementById("start-stop-continue").innerHTML = "Continue";
        status = "continue";
    } else if (status === "continue") {
        interval = window.setInterval(startTimer, 1000);
        document.getElementById("start-stop-continue").innerHTML = "Pause";
        status = "paused";
    }
}

function stop() {
    window.clearInterval(interval);
    document.getElementById("start-stop-continue").innerHTML = "Start";
    document.getElementById("pesan").innerHTML = "Total Waktu Pengerjaan : " + hours + " Jam " + minutes + " Menit " + seconds + " Detik";
    status = "stopped";
    seconds = 0;
    minutes = 0;
    hours = 0;
    document.getElementById('hours').innerHTML = "00";
    document.getElementById('minutes').innerHTML = "00";
    document.getElementById('seconds').innerHTML = "00";
    localStorage.clear();
}

function calculateDuration(hour, minute, second) {
    let duration = 0;
    duration += hour * 3600;
    duration += minute * 60;
    duration += second;

    return duration;
}

// convert from second to hours:minutes:second
// from https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
function secondToTime(second) {
    var sec_num = parseInt(second, 10);
    var sec2hours = Math.floor(sec_num / 3600);
    var sec2minutes = Math.floor((sec_num - (sec2hours * 3600)) / 60);
    var sec2seconds = sec_num - (sec2hours * 3600) - (sec2minutes * 60);
    return [sec2hours, sec2minutes, sec2seconds];
}