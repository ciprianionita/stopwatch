const btnToggle = document.getElementById("btn-toggle");
const btnReset = document.getElementById("btn-reset");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const laps = document.getElementById("laps");
const lsi = localStorage.getItem("stopw_last_time");
let stopwatch;
let elapsed = 0; // ms accumulated before the current run
let startTime = 0; // timestamp of the current run

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

// Add a leading zero
function pad(n) {
    return String(n).padStart(2, "0");
}

// Total elapsed ms, including the current run
function currentElapsed() {
    if (btnToggle.innerHTML === "Pause") {
        return elapsed + (Date.now() - startTime);
    }
    return elapsed;
}

// Show the time on the page
function render(ms) {
    hours.innerHTML = pad(Math.floor(ms / 3600000));
    minutes.innerHTML = pad(Math.floor(ms / 60000) % 60);
    seconds.innerHTML = pad(Math.floor(ms / 1000) % 60);
}

// Create a lap (list item)
function createLaps() {
    const lap = document.createElement("li");
    const timeAtPause = hours.innerHTML + ":" + minutes.innerHTML + ":" + seconds.innerHTML;
    lap.innerHTML = timeAtPause;

    laps.appendChild(lap);
    localStorage.setItem("stopw_last_time", timeAtPause);
}

// When clicking Start button
btnToggle.addEventListener("click", () => {
    if (btnToggle.innerHTML === "Start") {
        btnToggle.innerHTML = "Pause";
        startTime = Date.now();

        // Only redraws; the time itself comes from Date.now(),
        // so delayed or throttled ticks don't cause drift
        stopwatch = setInterval(() => {
            render(currentElapsed());
        }, 200);

        return;
    }

    if (btnToggle.innerHTML === "Pause") {
        elapsed = currentElapsed();
        clearInterval(stopwatch);
        btnToggle.innerHTML = "Start";
        render(elapsed);
        createLaps();
        return;
    }
});

// When clicking Reset button
btnReset.addEventListener("click", () => {
    clearInterval(stopwatch);
    elapsed = 0;
    render(0);

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
