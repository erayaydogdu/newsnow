import { describe, expect, it } from "vitest"
import MockDate from "mockdate"

describe("parseRelativeDate", () => {
  Object.assign(process.env, { TZ: "UTC" })
  const second = 1000
  const minute = 60 * second
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day
  const date = new Date()

  const weekday = (d: number) => +new Date(date.getFullYear(), date.getMonth(), date.getDate() + d - (date.getDay() > d ? date.getDay() : date.getDay() + 7))

  // Fix time for tests
  MockDate.set(date)

  it("10 seconds ago", () => {
    expect(+new Date(parseRelativeDate("10 seconds ago"))).toBe(+date - 10 * second)
  })

  it("10 minutes ago", () => {
    expect(+new Date(parseRelativeDate("10 minutes ago"))).toBe(+date - 10 * minute)
  })

  it("10 mins ago", () => {
    expect(+new Date(parseRelativeDate("10 mins ago"))).toBe(+date - 10 * minute)
  })

  it("in 10 minutes", () => {
    expect(+new Date(parseRelativeDate("in 10 minutes"))).toBe(+date + 10 * minute)
  })

  it("a minute ago", () => {
    expect(+new Date(parseRelativeDate("a minute ago"))).toBe(+date - 1 * minute)
  })

  it("in an hour", () => {
    expect(+new Date(parseRelativeDate("in an hour"))).toBe(+date + 1 * hour)
  })

  it("10 hours ago", () => {
    expect(+new Date(parseRelativeDate("10 hours ago"))).toBe(+date - 10 * hour)
  })

  it("10 days ago", () => {
    expect(+new Date(parseRelativeDate("10 days ago"))).toBe(+date - 10 * day)
  })

  it("10 weeks ago", () => {
    expect(+new Date(parseRelativeDate("10 weeks ago"))).toBe(+date - 10 * week)
  })

  it("1 month ago", () => {
    expect(+new Date(parseRelativeDate("1 month ago"))).toBe(+date - 1 * month)
  })

  it("1 year ago", () => {
    expect(+new Date(parseRelativeDate("1 year ago"))).toBe(+date - 1 * year)
  })

  it("1 year 1 month ago", () => {
    expect(+new Date(parseRelativeDate("1 year 1 month ago"))).toBe(+date - 1 * year - 1 * month)
  })

  it("1d 1h ago", () => {
    expect(+new Date(parseRelativeDate("1d 1h ago"))).toBe(+date - 1 * day - 1 * hour)
  })

  it("1h 1m 1s ago", () => {
    expect(+new Date(parseRelativeDate("1h 1m 1s ago"))).toBe(+date - 1 * hour - 1 * minute - 1 * second)
  })

  it("1d 1h 1m 1s ago", () => {
    expect(+new Date(parseRelativeDate("1d 1h 1m 1s ago"))).toBe(+date - 1 * day - 1 * hour - 1 * minute - 1 * second)
  })

  it("in 1h 1m 1s", () => {
    expect(+new Date(parseRelativeDate("in 1h 1m 1s"))).toBe(+date + 1 * hour + 1 * minute + 1 * second)
  })

  it("today", () => {
    expect(+new Date(parseRelativeDate("today"))).toBe(+date.setHours(0, 0, 0, 0))
  })

  it("today H:m", () => {
    expect(+new Date(parseRelativeDate("Today 08:00"))).toBe(+date + 8 * hour)
  })

  it("today, h:m a", () => {
    expect(+new Date(parseRelativeDate("Today, 8:00 pm"))).toBe(+date + 20 * hour)
  })

  it("tDA H:m:s", () => {
    expect(+new Date(parseRelativeDate("TDA 08:00:00"))).toBe(+date + 8 * hour)
  })

  it("yesterday H:m", () => {
    expect(+new Date(parseRelativeDate("yesterday 20:00"))).toBe(+date - 4 * hour)
  })

  it("day before yesterday H:m", () => {
    expect(+new Date(parseRelativeDate("dby 20:00"))).toBe(+date - 1 * day - 4 * hour)
  })

  it("tomorrow H:m", () => {
    expect(+new Date(parseRelativeDate("tomorrow 20:00"))).toBe(+date + 1 * day + 20 * hour)
  })

  it("monday h:m", () => {
    expect(+new Date(parseRelativeDate("monday 8:00"))).toBe(weekday(1) + 8 * hour)
  })

  it("tue h:m", () => {
    expect(+new Date(parseRelativeDate("tue 8:00"))).toBe(weekday(2) + 8 * hour)
  })

  it("sunday h:m", () => {
    expect(+new Date(parseRelativeDate("sunday 8:00"))).toBe(weekday(7) + 8 * hour)
  })

  it("invalid", () => {
    expect(parseRelativeDate("RSSHub")).toBe("RSSHub")
  })
})

describe("transform Beijing time to UTC in different timezone", () => {
  const a = "2024/10/3 12:26:16"
  const b = 1727929576000
  it("in UTC", () => {
    Object.assign(process.env, { TZ: "UTC" })
    const date = tranformToUTC(a)
    expect(date).toBe(b)
  })

  it("in Beijing", () => {
    Object.assign(process.env, { TZ: "Asia/Shanghai" })
    const date = tranformToUTC(a)
    expect(date).toBe(b)
  })

  it("in New York", () => {
    Object.assign(process.env, { TZ: "America/New_York" })
    const date = tranformToUTC(a)
    expect(date).toBe(b)
  })
})
