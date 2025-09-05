type Enumerate<
    N extends number,
    Acc extends number[] = []
> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

type Range<F extends number, T extends number> = Exclude<
    Enumerate<T>,
    Enumerate<F>
>;

export type Time = {
    hours: Range<0, 24>;
    minutes: Range<0, 60>;
};

export const isTime = (data: any): data is Time => {
    return (
        "hours" in data &&
        typeof data.hours === "number" &&
        data.hours >= 0 &&
        data.hours <= 23 &&
        "minutes" in data &&
        typeof data.minutes === "number" &&
        data.minutes >= 0 &&
        data.minutes <= 59
    );
};

export type TimeString = `${`${0 | 1}${Range<0, 10>}` | `2${Range<0, 4>}`}:${
    | `0${Range<0, 9>}`
    | Range<10, 60>}`;

const isTimeString = (data: any): data is TimeString => {
    return (
        typeof data === "string" &&
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/gm.test(data)
    );
};

const stringToTime = (str: TimeString): Time => {
    const hoursMinutes = str.split(":");
    return {
        hours: Number(hoursMinutes[0]) as Range<0, 24>,
        minutes: Number(hoursMinutes[1]) as Range<0, 60>,
    };
};

export type TimeRange = { from: Time; to: Time };

export const isTimeRange = (data: any): data is TimeRange => {
    return (
        "from" in data && isTime(data.from) && "to" in data && isTime(data.to)
    );
};

export const stringToTimeRange = (str: string): TimeRange | null => {
    const timestamps = str.split("-");
    if (
        timestamps.length !== 2 ||
        !isTimeString(timestamps[0]) ||
        !isTimeString(timestamps[1])
    ) {
        return null;
    }
    return {
        from: stringToTime(timestamps[0]),
        to: stringToTime(timestamps[1]),
    };
};

const timeToString = (time: Time): string => {
    const hours = time.hours < 10 ? `0${time.hours}` : time.hours;
    const minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes;

    return `${hours}:${minutes}`;
};

export const timeRangeToString = (timeRange: TimeRange): string => {
    return `${timeToString(timeRange.from)} - ${timeToString(timeRange.to)}`;
};
