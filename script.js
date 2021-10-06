//
// ---- Update Log ----
// ./ change "status" to "timer_status", because var "status" is reserved by other methods
// ./ many global variable turned to array in need of additional timer
// 
// ---- Need To Be Fix ----
// ./ Refactor local storage things
// ./ Multiple timer can't running at the same time
// ./ Window Interval
// ./ UI
//

let seconds = [6];
let minutes = [6];
let hours = [6];
let display_seconds = [6];
let display_minutes = [6];
let display_hours = [6];
let timer_status = [6];

// initiate array var value to 0
for (i=0; i<6; i++) {
    seconds[i] = 0;
    minutes[i] = 0;
    hours[i] = 0;
    display_seconds[i] = 0;
    display_minutes[i] = 0;
    display_hours[i] = 0;
    timer_status[i] = "stopped";
}

let interval = null;
let total_timer = 0

window.addEventListener("beforeunload", function (e) {

    e.preventDefault()

    localStorage.setItem("closed-time", new Date());
    localStorage.setItem("Time", JSON.stringify({hours, minutes, seconds}));
    // localStorage.setItem("Time", JSON.stringify({0, minutes, seconds}));
    localStorage.setItem("stat", timer_status);
});

window.addEventListener("load", function (e) {

    let close_time = localStorage.getItem("closed-time");
    let elapsed_time = (new Date().getTime() - new Date(close_time).getTime()) / 1000;
    let duration = JSON.parse(localStorage.getItem("Time"));
    let time_to_sec = calculateDuration(duration.hours, duration.minutes, duration.seconds);

    // timer still running when the tab closed or refreshed
    if (localStorage.getItem("stat") === "paused") {
        seconds = Math.floor(elapsed_time + time_to_sec);

        // get multiple return value
        // from https://stackoverflow.com/questions/2917175/return-multiple-values-in-javascript
        let valueTime = secondToTime(seconds)
        hours[0] = valueTime[0]
        minutes[0] = valueTime[1]
        seconds[0] = valueTime[2] - 1 // -1 because startTimer() starting with seconds++
        startTimer() // set time when first load
        startstopcontinue(); // revision for timer auto play when refresh
    }

    // timer paused when the tab closed or refreshed
    if (localStorage.getItem("stat") === "continue") {
        hours[0] = duration.hours[0]
        minutes[0] = duration.minutes[0]
        seconds[0] = duration.seconds[0] - 1 // -1 because startTimer() starting with seconds++
        timer_status = "paused"
        startTimer()
        startstopcontinue()
    }

});

function startTimer(element){
    let selectedElement = 0;
    let i = 0;
    while(i < 6) {
        if(element == "start-stop-continue"+i) {
            selectedElement = i;
            i = 0;
            break;
        } 
        i++;
    }

    seconds[selectedElement]++;
    console.log(seconds[selectedElement])
    if (seconds[selectedElement] / 60 === 1) {
        seconds[selectedElement] = 0;
        minutes[selectedElement]++;
        if (minutes[selectedElement] / 60 === 1){
            minutes[selectedElement] = 0;
            hours[selectedElement]++;
        }
    }
    if (seconds[selectedElement] < 10){
        display_seconds[selectedElement] = "0" + seconds[selectedElement].toString();
    }
    else{
        display_seconds[selectedElement] = seconds[selectedElement];
    }
    if (minutes[selectedElement] < 10){
        display_minutes[selectedElement] = "0" + minutes[selectedElement].toString();
    }
    else{
        display_minutes[selectedElement] = minutes[selectedElement];
    }
    if (hours[selectedElement] < 10){
        display_hours[selectedElement] = "0" + hours[selectedElement].toString();
    }
    else{
        display_hours[selectedElement] = hours[selectedElement];
    }
    
    document.getElementById("hours" + selectedElement).innerHTML = display_hours[selectedElement];
    document.getElementById("minutes" + selectedElement).innerHTML = display_minutes[selectedElement];
    document.getElementById("seconds" + selectedElement).innerHTML = display_seconds[selectedElement];
}

function startstopcontinue(element) {
    let selectedElement = 0;
    let i = 0;
    while(i < 6) {
        if(element == "start-stop-continue"+i) {
            selectedElement = i;
            i = 0;
            break;
        } 
        i++;
    }

    if (timer_status[selectedElement] === "stopped"){
        // pass argument inside parameter 
        // https://stackoverflow.com/questions/1300242/passing-a-function-with-parameters-as-a-parameter
        interval=window.setInterval(function(){ return startTimer(element); }, 1000); 
        document.getElementById(element).innerHTML="Pause";
        timer_status[selectedElement]="paused";
    }
    else if (timer_status[selectedElement] === "paused"){
        window.clearInterval(interval);
        document.getElementById(element).innerHTML="Continue";
        timer_status[selectedElement]="continue";
    }
    else if (timer_status[selectedElement] === "continue"){
        interval=window.setInterval(function(){ return startTimer(element); }, 1000);
        document.getElementById(element).innerHTML="Pause";
        timer_status[selectedElement]="paused"; 
    }
}

function stop(element){
    let selectedElement = 0

    let i = 0;
    while(i < 6) {
        if(element == "button-stop"+i) {
            selectedElement = i;
            i = 0;
            break;
        } 
        i++;
    }

    window.clearInterval(interval);
    document.getElementById("start-stop-continue" + selectedElement).innerHTML="Start";
    document.getElementById("pesan" + selectedElement).innerHTML="Total Waktu Pengerjaan : " + hours[selectedElement] + " Jam " + minutes[selectedElement] + " Menit " + seconds[selectedElement] + " Detik";
    timer_status[selectedElement] = "stopped";
    seconds[selectedElement] = 0;
    minutes[selectedElement] = 0;
    hours[selectedElement] = 0;
    console.log("SELECTED ELEMENT: " + selectedElement)
    document.getElementById("hours" + selectedElement).innerHTML = "00";
    document.getElementById("minutes" + selectedElement).innerHTML = "00";
    document.getElementById("seconds" + selectedElement).innerHTML = "00";
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
    var sec2hours   = Math.floor(sec_num / 3600);
    var sec2minutes = Math.floor((sec_num - (sec2hours * 3600)) / 60);
    var sec2seconds = sec_num - (sec2hours * 3600) - (sec2minutes * 60);
    return [sec2hours, sec2minutes, sec2seconds];
}

function addTimer() {
    // max timer = 5
    if (total_timer < 6) {
        total_timer += 1;
        const div = document.createElement("div");
        div.innerHTML = `
        <div id="count` + total_timer + `" class="count">
            <div class="time">
                <h2 id="hours` + total_timer + `">00</h2>
                <small>Hours</small>
            </div>
            <div class="time">
                <h2 id="minutes` + total_timer + `">00</h2>
                <small>Minutes</small>
            </div>
            <div class="time">
                <h2 id="seconds` + total_timer + `">00</h2>
                <small>Seconds</small>
            </div>
        </div>
        <div class="wrap">
            <div class="item">
                <button class="btn1" onclick="startstopcontinue(this.id)" id="start-stop-continue` + total_timer + `">Start</button>
            </div>
            <div class="item">
                <button class="btn2" onclick="stop(this.id)" id="button-stop` + total_timer + `">Stop</button>
            </div>
        </div>
        <h2 id="pesan` + total_timer + `">Waktu Pengerjaan Anda : 0 Jam 0 Menit 0 Detik</h2>
        `;
        document.getElementById("additional-timer").appendChild(div);
    }
}