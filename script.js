    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let display_seconds = 0;
    let display_minutes = 0;
    let display_hours = 0;
    let interval = null;
    let status = "stopped";

    function startTimer(){
        seconds++;
        if (seconds / 60 === 1) {
            seconds = 0;
            minutes++;
            if (minutes / 60 === 1){
                minutes = 0;
                hours++;
            }                    
        }
        if (seconds < 10){
            display_seconds = "0" + seconds.toString();
        }
        else{
            display_seconds = seconds;
        }
        if (minutes < 10){
            display_minutes = "0" + minutes.toString();
        }
        else{
            display_minutes = minutes;
        }
        if (hours < 10){
            display_hours = "0" + hours.toString();
        }
        else{
            display_hours = hours;
        }
        document.getElementById('hours').innerHTML = display_hours;
        document.getElementById('minutes').innerHTML = display_minutes;
        document.getElementById('seconds').innerHTML = display_seconds;
    }
    function startstopcontinue() {
        if (status === "stopped"){
            interval=window.setInterval(startTimer, 1000);
            document.getElementById("start-stop-continue").innerHTML="Pause";
            status="paused";
        }
        else if (status === "paused"){
            window.clearInterval(interval);
            document.getElementById("start-stop-continue").innerHTML="Continue";
            status="continue";
        }
        else if (status === "continue"){
            interval=window.setInterval(startTimer, 1000);
            document.getElementById("start-stop-continue").innerHTML="Pause";
            status="paused";
        }
    }
    function stop(){
        window.clearInterval(interval);
        document.getElementById("start-stop-continue").innerHTML="Start";
        document.getElementById("pesan").innerHTML="Total Waktu Pengerjaan : " + hours + " Jam " + minutes + " Menit " + seconds + " Detik";
        status = "stopped";
        seconds = 0;
        minutes = 0;
        hours = 0;
        document.getElementById('hours').innerHTML = "00";
        document.getElementById('minutes').innerHTML = "00";
        document.getElementById('seconds').innerHTML = "00";
    }