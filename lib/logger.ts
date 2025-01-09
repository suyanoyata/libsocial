import chalk from "chalk";

export const LOG_LEVEL = {
  INFO: "<Info>",
  WARNING: "<Warning>",
  ERROR: "<Error>",
  VERBOSE: "<Debug>",
  REQUEST: "<Request>",
  RESPONSE: "<Response>",
};

const DEFINE_LEVEL = (level: string) => {
  if (level === LOG_LEVEL.INFO) {
    return ["00FFED", "00e5d6"];
  } else if (level === LOG_LEVEL.WARNING) {
    return ["ffe900", "e5d200"];
  } else if (level === LOG_LEVEL.ERROR) {
    return ["ff001d", "ff3236"];
  } else if (level === LOG_LEVEL.VERBOSE) {
    return ["ffffff", "e5e5e5"];
  } else if (level === LOG_LEVEL.REQUEST || level === LOG_LEVEL.RESPONSE) {
    return ["c2c2c3", "ffffff"];
  }
};

export const LOG = (level: string, message: string, data?: string) => {
  if (typeof __DEV__ === "undefined" || __DEV__ === false) return;
  const ctx = new chalk.Instance({ level: 3 });
  const color = DEFINE_LEVEL(level);
  if (!color) return;
  const date = new Date();

  const seconds =
    date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;
  const minutes =
    date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
  const month =
    date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;

  const dateString = `${day}/${month}/${date.getFullYear()} ${hours}:${minutes}:${seconds}`;

  console.log(
    `- [${ctx.gray(dateString)}] ${ctx.bold.hex(color[0])(level)}: ${ctx.hex(
      color[1]
    )(message)} ${
      data
        ? ctx.hex(color[1])(
            `${ctx.white("(")}data code: ${ctx.gray(data)}${ctx.white(")")}`
          )
        : ""
    }`
  );
};

class Logger {
  private static log(level: string, message: string, data?: any) {
    if (typeof __DEV__ === "undefined" || __DEV__ === false) return;
    const ctx = new chalk.Instance({ level: 3 });
    const color = DEFINE_LEVEL(level);
    if (!color) return;
    const date = new Date();

    const seconds =
      date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;
    const minutes =
      date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const hours =
      date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const month =
      date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;

    const dateString = `${day}/${month}/${date.getFullYear()} ${hours}:${minutes}:${seconds}`;
    const isObject = typeof data == "object";
    const out = isObject ? JSON.stringify(data, null, 2) : data;
    const display = isObject
      ? `${ctx.white("(")}${ctx.gray(out)}${ctx.white(")")}`
      : ctx.gray(out);

    console.log(
      `- [${ctx.gray(dateString)}] ${ctx.bold.hex(color[0])(level)}: ${ctx.hex(
        color[1]
      )(message)} ${data ? ctx.hex(color[1])(display) : ""}`
    );
  }

  static info(message: string, data?: any) {
    this.log(LOG_LEVEL.INFO, message, data);
  }

  static warn(message: string, data?: any) {
    this.log(LOG_LEVEL.WARNING, message, data);
  }

  static error(message: string, data?: any) {
    this.log(LOG_LEVEL.ERROR, message, data);
  }

  static verbose(message: string, data?: any) {
    this.log(LOG_LEVEL.VERBOSE, message, data);
  }
  static request(message: string, data?: any) {
    this.log(LOG_LEVEL.REQUEST, message, data);
  }
  static response(message: string, data?: any) {
    this.log(LOG_LEVEL.RESPONSE, message, data);
  }
}

export const logger = Logger;
