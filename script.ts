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

const times = [
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

const update = () => {
    const now = new Date();
    const spans = times.filter(e => e.start <= now && now < e.end);
    if (spans.length === 0) {
        const next = times.reduce((e, s) => e.start > s && e.start < now ? e.start : s, new Date(0));
        setTimeout(update, next - now);
    }
    const remaining = times.filter(e => now < e.start).reduce((e, s) => e + s);
    const diff = spans[0] - now + remaining;
}
