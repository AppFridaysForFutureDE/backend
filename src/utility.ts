//parses a string of this scheme: "13:00 Uhr" to a date with the next friday
export function getDate(s: string): Date {
  const d = nextWeekdayDate(5);
  d.setSeconds(0);
  d.setMilliseconds(0);
  const re = /[0-9]{2}/g;
  const m = s.match(re);
  if (m) {
    d.setHours(+m[0], +m[1]);
    return d;
  }
  return new Date();
}

//returns date of next weekday (1: Mon, 7: Sun)
export function nextWeekdayDate(dayInWeek: number): Date {
  const ret = new Date();
  ret.setDate(ret.getDate() + ((dayInWeek - 1 - ret.getDay() + 7) % 7) + 1);
  return ret;
}

//converts date to unix timestamp
export function toUnixTimestamp(d: Date): number {
  var x: number = d.getTime();
  x = x / 1000;
  return x;
}

//creates shortened sha256 hash
export function hash(s: String): String {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(s).digest("hex").substring(0,13);
}
