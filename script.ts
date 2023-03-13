
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
    new WorkTime('2023-03-14 08:50:00', '2023-03-14 10:20:00', TimeType.Class),
    new WorkTime('2023-03-16 08:50:00', '2023-03-16 10:20:00', TimeType.Class),
    new WorkTime('2023-03-08 16:00:00', '2023-03-08 21:00:00', TimeType.Lab),
    new WorkTime('2023-03-09 17:00:00', '2023-03-09 21:00:00', TimeType.Lab),
    new WorkTime('2023-03-12 11:00:00', '2023-03-12 14:00:00', TimeType.Lab),
    new WorkTime('2023-03-13 16:00:00', '2023-03-13 21:00:00', TimeType.Lab),
    new WorkTime('2023-03-15 16:00:00', '2023-03-15 21:00:00', TimeType.Lab)
];

const categorizedTimes = {
    total: times,
    meeting: times.filter(e => e.timeType == TimeType.Meeting),
    class: times.filter(e => e.timeType == TimeType.Class),
    lab: times.filter(e => e.timeType == TimeType.Lab)
}

function getNextSpan(timeset: WorkTime[], now: Date) {
    const diffs = timeset.map(e => e.start.getTime() - now.getTime());
    const least = diffs.reduce((e, s) => e > 0 && e < s ? e : s, Infinity);
    return timeset[diffs.indexOf(least)];
}

function updateTime(timeset: WorkTime[], section: string) {
    const now = new Date();
    // Calculate sum of timeset after this span
    const sumAfter = timeset
        .filter(e => e.start.getTime() > now.getTime()) // Get all spans after this one
        .map(e => e.end.getTime() - e.start.getTime()) // Find length of each
        .reduce((e, s) => e + s, 0); // Find sum

    let total = sumAfter;

    let finished = false;

    // Calculate time left in this span
    const currentSpans = timeset.filter(e => e.start <= now && now < e.end);
    if (currentSpans.length > 0) {
        const currentSpan = currentSpans[0];
        const remaining = currentSpan.end.getTime() - now.getTime();
        total += remaining;
        if (now > currentSpan.end) {
            finished = true;
        }
    }

    // Calculate numbers
    const totalSeconds = total / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds % 60);

    // Update divs
    document.getElementById(section + '-hours')!.innerHTML = hours.toString().padStart(2, '0').replaceAll('0', 'O');
    document.getElementById(section + '-minutes')!.innerHTML = minutes.toString().padStart(2, '0').replaceAll('0', 'O');
    document.getElementById(section + '-seconds')!.innerHTML = seconds.toString().padStart(2, '0').replaceAll('0', 'O');

}

function waitForUpdating() {
    setTimeout(updatePerSecond, getNextSpan(times, new Date()).start.getTime() - Date.now());
}

function updatePerSecond() {
    intervalId = setInterval(() => {
        const results = Object.entries(categorizedTimes).map(([section, timeset]) => updateTime(timeset, section));
        if (results.some(e => e)) {
            clearInterval(intervalId);
            waitForUpdating();
        }
    }, 1000);
}

const now = new Date();
if (times.filter(e => e.start <= now && now < e.end).length == 0) {
    waitForUpdating();
} else {
    updatePerSecond();
}

for (let i in categorizedTimes) {
    updateTime(categorizedTimes[<keyof typeof categorizedTimes>i], i);
}

// If within a time:
// Set interval to 
//   count up
//   if exited interval:
//     stop interval
//     set timeout to interval
// else:
// set timeout to interval
