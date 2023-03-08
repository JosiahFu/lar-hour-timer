enum TimeType {
    Meeting = "MEETING",
    Class = "CLASS",
    Lab = "LAB"
}

class WorkTime {
    start: Date;
    end: Date;
    timeType: TimeType;

    constructor(start: string, end: string, timeType: TimeType) {
        this.start = new Date(start);
        this.end = new Date(end);
        this.timeType = timeType;
    }
}

let intervalId: number;

const times = [
    new WorkTime('2023-03-07 16:00:00', '2023-03-07 20:00:00', TimeType.Meeting),
    new WorkTime('2023-03-10 16:00:00', '2023-03-10 19:00:00', TimeType.Meeting),
    new WorkTime('2023-03-11 10:00:00', '2023-03-11 18:00:00', TimeType.Meeting),
    new WorkTime('2023-03-12 14:00:00', '2023-03-12 19:00:00', TimeType.Meeting),
    new WorkTime('2023-03-14 16:00:00', '2023-03-14 20:00:00', TimeType.Meeting),
    new WorkTime('2023-03-08 08:50:00', '2023-03-08 10:30:00', TimeType.Class),
    new WorkTime('2023-03-10 08:50:00', '2023-03-10 10:05:00', TimeType.Class),
    new WorkTime('2023-03-13 09:45:00', '2023-03-13 10:35:00', TimeType.Class),
    new WorkTime('2023-03-15 08:50:00', '2023-03-15 10:30:00', TimeType.Class),
    new WorkTime('2023-03-12 11:00:00', '2023-03-12 14:00:00', TimeType.Lab),
    new WorkTime('2023-03-13 16:00:00', '2023-03-13 21:00:00', TimeType.Lab),
    new WorkTime('2023-03-15 16:00:00', '2023-03-15 21:00:00', TimeType.Lab)
];

function getNextSpan(now: Date) {
    const diffs = times.map(e => e.start.getTime() - now.getTime());
    const least = diffs.reduce((e, s) => e > 0 && e < s ? e : s, Infinity);
    return times[diffs.indexOf(least)];
}

function updateTime() {
    const now = new Date();
    // Calculate sum of times after this span
    const sumAfter = times
        .filter(e => e.start.getTime() > now.getTime()) // Get all spans after this one
        .map(e => e.end.getTime() - e.start.getTime()) // Find length of each
        .reduce((e, s) => e + s, 0); // Find sum

    let total = sumAfter;

    // Calculate time left in this span
    const currentSpans = times.filter(e => e.start <= now && now < e.end);
    if (currentSpans.length > 0) {
        const currentSpan = currentSpans[0];
        const remaining = currentSpan.end.getTime() - now.getTime();
        total += remaining;
        if (now > currentSpan.end) {
            clearInterval(intervalId);
            waitForUpdating();
        }
    }


    // Calculate numbers
    const totalSeconds = total / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds % 60);

    // Update divs
    document.getElementById('hours')!.innerHTML = hours.toString().padStart(2, '0');
    document.getElementById('minutes')!.innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById('seconds')!.innerHTML = seconds.toString().padStart(2, '0');

}

function waitForUpdating() {
    setTimeout(updatePerSecond, getNextSpan(new Date()).start.getTime() - Date.now());
}

function updatePerSecond() {
    intervalId = setInterval(updateTime, 1000);
}

const now = new Date();
if (times.filter(e => e.start <= now && now < e.end).length == 0) {
    waitForUpdating();
} else {
    updatePerSecond();
}

updateTime();

// If within a time:
// Set interval to 
//   count up
//   if exited interval:
//     stop interval
//     set timeout to interval
// else:
// set timeout to interval
