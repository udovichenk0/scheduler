import createFuzzySearch from "@nozbe/microfuzz";
import dayjs, { Dayjs } from "dayjs";

import { validateAmPm, validateHour, validateMin } from "./validator";
import { formatDate } from "./formator";
import { baseWords, dateShortCuts, mapShortcutToDate, relativeNumbers, timeList } from "./config";
import { BaseWord, Time } from "./type";
import { hasTimePart } from "@/shared/lib/date/has-time-part";

export function parseRelativeDate(token?: string) {
  if (!token) return;
  const baseWordSearch = createFuzzySearch(baseWords);
  const foundBaseWords = baseWordSearch(token);
  if (foundBaseWords.length) {
    return foundBaseWords[0].item as BaseWord;
  }
}

export function parseRelativeNum(token: string) {
  const relativeNumber = relativeNumbers[token]
  if(relativeNumber) return relativeNumber
  const n = Number(token);
  if (!isNaN(n)) return n;
}

export function parseTokens(tokens: string[]) {
  const naturalDates = parseNaturalDates(tokens)
  if(naturalDates) return naturalDates
  const relativeDates = parseRelativeDates(tokens)
  if(relativeDates) return relativeDates
  const times = parseTime(tokens)
  if(times) return times
  const dates = parseDate(tokens)
  if(dates) return dates

  return []
}

function parseNaturalDates(tokens: string[]){
  const naturalDate = tokens[0]
  const naturalDatesSearch = createFuzzySearch(dateShortCuts);
  const naturalDatesResult = naturalDatesSearch(naturalDate);
  const time = getTime(tokens.slice(1));
  const dates = naturalDatesResult.map(({ item }) => mapShortcutToDate(item));

  if(dates.length > 1){
    return dates.map(({ date }) => ({ hint: formatDate(date), date }));
  } else if(dates.length === 1){
    const {date, hasTimePart} = dates[0]
    if(!hasTimePart){
      const dateWithTime = setTime(date, time)
      return [{ hint: formatDate(dateWithTime), date: dateWithTime }]
    }
    return [{ hint: formatDate(date), date }];
  }
}
function parseRelativeDates(tokens: string[]){
  if(tokens.length < 2) return
  const baseWordSearch = createFuzzySearch(baseWords);

  const relativeNum = parseRelativeNum(tokens[0]);
  const relativeDates = baseWordSearch(tokens[1])
  const time = getTime(tokens.slice(2))

  if (relativeDates.length && relativeNum) {
    const relativeDate = relativeDates[0].item as BaseWord
    const dateWithTime = setTime(dayjs().add(relativeNum, relativeDate), time);

    return [{
      date: dateWithTime,
      hint: formatDate(dateWithTime)
    }]
  }
}
function parseDate(tokens: string[]){
  const dateStr = tokens[0]
  if(!dayjs(dateStr).isValid()) return
  const time = getTime(tokens.slice(1))
  const dateWithTime = setTime(dayjs(dateStr), time);
  return [{ hint: formatDate(dateWithTime), date: dateWithTime }];
}

function parseTime(tokens: string[]){
  const timePart = tokens[0]
  const ampm = tokens[1] || ""
  const timeSearch = createFuzzySearch(timeList)
  const timeResult = timeSearch(`${timePart} ${ampm}`) 

  if(timeResult.length){
    return timeResult.map(({ item }) => {
      const dateWithTime = setTime(dayjs(), getTime(tokens))
      return {
        hint: item,
        date: dateWithTime,
      }
    })
  } else {
    const dateWithTime = setTime(dayjs(), getTime(tokens))
    if(!hasTimePart(dateWithTime)) return
    return [{
      hint: dateWithTime.format("h:mm a"),
      date: dateWithTime,
    }]
  }
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
  return date.set("hour", 0).set("minute", 0).set("second", 0);
}

function constructTime(inputTime: string, ampm?: string): Time {
  const [h, m] = inputTime.split(":");
  const a = validateAmPm(ampm);
  const hour = validateHour(h, a);
  const minute = validateMin(m);
  return { hour, minute };
}
