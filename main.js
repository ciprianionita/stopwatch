const btnToggle = document.getElementById("btn-toggle");
const btnReset = document.getElementById("btn-reset");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const laps = document.getElementById("laps");
const lsi = localStorage.getItem("stopw_last_time");
let stopwatch;

// Check local storage
if (lsi !== null) {
    const lastTime = document.createElement("li");
    lastTime.innerHTML = "Last Time: " + lsi + ' <span class="erase">x</span>';
    laps.appendChild(lastTime);

    // Delete Last Time
    document.querySelector("#laps .erase").addEventListener("click", (e) => {
        localStorage.removeItem("stopw_last_time");
        e.target.parentElement.remove();
    });
}

// Create a lap (list item)
function createLaps() {
    let s = Number(seconds.innerHTML);
    let m = Number(minutes.innerHTML);
    let h = Number(hours.innerHTML);
    const lap = document.createElement("li");

    if (h < 10) {
        h = "0" + h;
    }

    if (m < 10) {
        m = "0" + m;
    }

    if (s < 10) {
        s = "0" + s;
    }

    const timeAtPause = h + ":" + m + ":" + s;
    lap.innerHTML = timeAtPause;

    laps.appendChild(lap);
    localStorage.setItem("stopw_last_time", timeAtPause);
}

// When clicking Start button
btnToggle.addEventListener("click", () => {
    if (btnToggle.innerHTML === "Start") {
        btnToggle.innerHTML = "Pause";

        stopwatch = setInterval(() => {
            let s = Number(seconds.innerHTML);
            let m = Number(minutes.innerHTML);
            let h = Number(hours.innerHTML);

            // At 1000 ms add 1 second
            s++;
            if (s < 10) {
                seconds.innerHTML = "0" + s;
            } else if (s === 60) {
                seconds.innerHTML = "00";
            } else {
                seconds.innerHTML = s;
            }

            // At 60 seconds add 1 minute
            if (s === 60) {
                m++;
                if (m < 10) {
                    minutes.innerHTML = "0" + m;
                } else if (m === 60) {
                    minutes.innerHTML = "00";
                } else {
                    minutes.innerHTML = m;
                }
            }

            // At 60 minutes add 1 hour
            if (m === 60) {
                h++;
                if (h < 10) {
                    hours.innerHTML = "0" + h;
                } else if (m === 60) {
                    hours.innerHTML = "00";
                } else {
                    hours.innerHTML = h;
                }
            }
        }, 1000);

        return;
    }

    if (btnToggle.innerHTML === "Pause") {
        clearInterval(stopwatch);
        btnToggle.innerHTML = "Start";
        createLaps();
        return;
    }
});

// When clicking Reset button
btnReset.addEventListener("click", () => {
    clearInterval(stopwatch);
    seconds.innerHTML = "00";
    minutes.innerHTML = "00";
    hours.innerHTML = "00";

    if (btnToggle.innerHTML === "Pause") {
        btnToggle.innerHTML = "Start";
    }

    // Delete the laps, except Last Time
    laps.querySelectorAll("li").forEach((a) => {
        if (a.childNodes.length < 2) {
            a.remove();
        }
    });
});
