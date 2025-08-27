enum LogType {
    Error = "ERR",
    Warning = "WRN",
    Log = "LOG",
    Success = "SCS",
    Debug = "DBG",
}

enum ConsoleColors {
    Default = "0",
    BlackText = "30",
    RedText = "31",
    GreenText = "32",
    YellowText = "33",
    CyanText = "36",
    WhiteText = "37",
    BlackBackground = "40",
    RedBackground = "41",
    GreenBackground = "42",
    YellowBackground = "43",
    CyanBackground = "46",
    WhiteBackground = "47",
}

const timestamp = (): string => {
    const now = new Date();

    const twoDigit = (number: number): string => {
        return number.toString().length >= 2
            ? number.toString()
            : `0${number.toString()}`;
    };

    return `${twoDigit(now.getDate())}.${twoDigit(
        now.getMonth() + 1
    )}.${now.getFullYear()} ${twoDigit(now.getHours())}:${twoDigit(
        now.getMinutes()
    )}:${twoDigit(now.getSeconds())}`;
};

const paint = (
    message: string,
    color: ConsoleColors = ConsoleColors.Default
): string => {
    return `\x1b[${color}m${message}\x1b[${ConsoleColors.Default}m`;
};

const createMesssage = (type: LogType, message: string): string => {
    let labelColor: ConsoleColors = ConsoleColors.Default;
    let textColor: ConsoleColors = ConsoleColors.Default;

    switch (type) {
        case LogType.Log:
            labelColor = ConsoleColors.WhiteBackground;
            textColor = ConsoleColors.Default;
            break;

        case LogType.Debug:
            labelColor = ConsoleColors.CyanBackground;
            textColor = ConsoleColors.CyanText;
            break;

        case LogType.Success:
            labelColor = ConsoleColors.GreenBackground;
            textColor = ConsoleColors.GreenText;
            break;

        case LogType.Warning:
            labelColor = ConsoleColors.YellowBackground;
            textColor = ConsoleColors.YellowText;
            break;

        case LogType.Error:
            labelColor = ConsoleColors.RedBackground;
            textColor = ConsoleColors.RedText;
            break;

        default:
            break;
    }

    return `${timestamp()} ${paint(`[${type}]`, labelColor)} ${paint(
        message,
        textColor
    )}`;
};

export const logger = {
    log: (message: string) => console.log(createMesssage(LogType.Log, message)),
    error: (message: string) =>
        console.log(createMesssage(LogType.Error, message)),
    warning: (message: string) =>
        console.log(createMesssage(LogType.Warning, message)),
    success: (message: string) =>
        console.log(createMesssage(LogType.Success, message)),
    debug: (message: string) =>
        console.log(createMesssage(LogType.Debug, message)),
};
