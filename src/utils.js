import moment from "moment-timezone";

export const seasonStr = "2020-11-20 17:00";

export const timezones = {
  pst: "America/Los_Angeles",
  kst: "Asia/Seoul",
  cet: "Europe/Brussels"
};

export const pluralize = (word, n) => {
  if (n > 1) {
    return `${addZero(n)} ${word}s`;
  }
  return `${addZero(n)} ${word}`;
};

export const addZero = (n) => {
  if (n < 10) {
    return `0${n}`;
  }
  return n;
};

export const diff = (season, now) => {
  return Object.fromEntries(
    Object.entries(timezones).map(([key, value]) => {
      const duration = moment.duration(
        season.value[key].toDate().getTime() -
          now.value[key].toDate().getTime(),
        "milliseconds"
      );

      return [
        key,
        {
          days: duration.days() > 0 ? duration.days() : 0,
          hours: duration.hours() > 0 ? duration.hours() : 0,
          minutes: duration.minutes() > 0 ? duration.minutes() : 0,
          seconds: duration.seconds() > 0 ? duration.seconds() : 0
        }
      ];
    })
  );
};
