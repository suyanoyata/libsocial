import chalk from "chalk";

export const LOG_LEVEL = {
  INFO: "<Info>",
  WARNING: "<Warning>",
  ERROR: "<Error>",
  VERBOSE: "<Debug>",
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
  }
};

export const LOG = (level: string, message: string, error?: string) => {
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
      color[1],
    )(message)} ${
      error
        ? ctx.hex(color[1])(
            `${ctx.white("(")}error code: ${ctx.gray(error)}${ctx.white(")")}`,
          )
        : ""
    }`,
  );
};
