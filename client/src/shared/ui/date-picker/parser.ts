import createFuzzySearch from "@nozbe/microfuzz";
import dayjs, { Dayjs, UnitType } from "dayjs";
import { validateAmPm, validateHour, validateMin } from "./validator";
import { formatDate } from "./formator";
import { dateShortCuts, mapKeyWordToDate, timeList } from "./config";
import { BaseWord, Time } from "./type";
const baseWords = [
  "day",
  "week",
  "month",
  "year",
]


export function parseRelativeDate(token?: string) {
  if (!token) return;
  const baseWordSearch = createFuzzySearch(baseWords);
  const foundBaseWords = baseWordSearch(token);
  if (foundBaseWords.length) {
    return foundBaseWords[0].item as BaseWord;
  }
}

export function parseRelativeNum(token: string) {
  if (token === "next") return 1;
  const n = Number(token);
  if (!isNaN(n)) return n;
}

export function parseTokens(tokens: string[]) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    console.log(tokens)
    if (i === 0) {
      const relativeNum = parseRelativeNum(token);
      if (relativeNum) {
        const relativeDate = parseRelativeDate(tokens[++i]);
        if (relativeDate) {
          const time = getTime(tokens.slice(++i));
          let date = setTime(dayjs().set(relativeDate as UnitType, relativeNum), time);
          const hint = formatDate(date);
          return [{ hint, date }];
        }
      }
      const times = findTimes(token);
      if(times){
        return times
      }
      if (dayjs(token).isValid()) {
        const time = getTime(tokens.slice(++i));
        let date = setTime(dayjs(token), time);
        const hint = formatDate(date);
        return [{ hint, date }];
      }
      const keyWords = findKeyWords(token);
      if (keyWords) {
        console.log(keyWords)
        const keyWordsWithHints = keyWords.map(({ item }) => mapKeyWordToDate(item));
        if (keyWordsWithHints.length > 1) {
          return keyWordsWithHints.map(({ date }) => ({ hint: formatDate(date), date }));
        }
        if (keyWordsWithHints.length === 1) {
          const time = getTime(tokens.slice(++i));
          const date = setKeyWordTime(keyWordsWithHints[0], time);
          return [{ hint: formatDate(date), date }];
        }
      }
    }
  }
}

function findKeyWords(token: string) {
  const commonWordSearch = createFuzzySearch(dateShortCuts);
  const commonWordResult = commonWordSearch(token);
  if(commonWordResult.length){
    return commonWordResult
  }
}

function findTimes(token: string){
  const timeSearch = createFuzzySearch(timeList)
  const timeResult = timeSearch(token)
  if(timeResult.length){
    return timeResult.map(({ item }) => {
      const date = dayjs().format("MM/DD/YY")
      const timedate = dayjs(`${date} ${item}`)
      return {
        hint: item,
        date: timedate,
      }
    })
  }
}

function setKeyWordTime(keyword: {date: Dayjs, hasTimePart: boolean}, time: Nullable<Time>) {
  if (!keyword.hasTimePart) {
    return setTime(keyword.date, time);
  }
  return keyword.date;
}

function getTime(tokens: string[]): Nullable<Time> {
  if (!tokens.length) return null;
  const timeOrAt = tokens[0];
  if (timeOrAt === "at" && tokens.length >= 2) {
    const time = tokens[1];
    const ampm = tokens[2];
    return constructTime(time, ampm);
  } else {
    const ampm = tokens[1];
    return constructTime(timeOrAt, ampm);
  }
}

function setTime(date: Dayjs, time: Nullable<Time>) {
  if (time) {
    return date.set("hour", time.hour).set("minute", time.minute);
  }
  return date;
}

function constructTime(inputTime: string, ampm?: string): Time {
  const [h, m] = inputTime.split(":");
  const a = validateAmPm(ampm);
  const hour = validateHour(h, a);
  const minute = validateMin(m);
  return { hour, minute };
}
