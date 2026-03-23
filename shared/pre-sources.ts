import process from "node:process"
import { Interval } from "./consts"
import { typeSafeObjectFromEntries } from "./type.util"
import type { OriginSource, Source, SourceID } from "./types"

const Time = {
  Test: 1,
  Realtime: 2 * 60 * 1000,
  Fast: 5 * 60 * 1000,
  Default: Interval, // 10min
  Common: 30 * 60 * 1000,
  Slow: 60 * 60 * 1000,
}

export const originSources = {
  mktnews: {
    name: "MKTNews",
    column: "finance",
    home: "https://mktnews.net",
    color: "indigo",
    interval: Time.Realtime,
    sub: {
      flash: {
        title: "News",
      },
    },
  },
  hackernews: {
    name: "Hacker News",
    color: "orange",
    column: "tech",
    type: "hottest",
    home: "https://news.ycombinator.com/",
  },
  producthunt: {
    name: "Product Hunt",
    color: "red",
    column: "tech",
    type: "hottest",
    home: "https://www.producthunt.com/",
  },
  finnhub: {
    name: "Finnhub",
    column: "finance",
    color: "blue",
    type: "hottest",
    interval: Time.Fast,
    home: "https://finnhub.io",
  },
  marketaux: {
    name: "Marketaux",
    type: "hottest",
    column: "finance",
    color: "emerald",
    interval: Time.Common,
    home: "https://www.marketaux.com",
  },
  stockdata: {
    name: "Stockdata",
    type: "hottest",
    column: "finance",
    color: "violet",
    interval: Time.Common,
    home: "https://www.stockdata.org",
  },
  alphavantage: {
    name: "Alpha Vantage",
    type: "hottest",
    column: "finance",
    color: "green",
    interval: Time.Slow,
    home: "https://www.alphavantage.co",
  },
  polygon: {
    name: "Polygon.io",
    type: "hottest",
    column: "finance",
    color: "purple",
    interval: Time.Common,
    home: "https://polygon.io",
  },
  newsapi: {
    name: "NewsAPI",
    type: "hottest",
    column: "finance",
    color: "sky",
    interval: Time.Common,
    home: "https://newsapi.org",
  },
  gnews: {
    name: "GNews",
    type: "hottest",
    column: "finance",
    color: "cyan",
    interval: Time.Common,
    home: "https://gnews.io",
  },
  eodhd: {
    name: "EODHD",
    type: "hottest",
    column: "finance",
    color: "amber",
    interval: Time.Slow,
    home: "https://eodhd.com",
  },
  currentsapi: {
    name: "Currents API",
    type: "hottest",
    column: "finance",
    color: "rose",
    interval: Time.Common,
    home: "https://currentsapi.services",
  },
  mediastack: {
    name: "Mediastack",
    type: "hottest",
    column: "finance",
    color: "orange",
    interval: Time.Slow,
    home: "https://mediastack.com",
  },
  bbc: {
    name: "BBC",
    color: "red",
    home: "https://www.bbc.com",
    sub: {
      business: {
        title: "Business",
        type: "hottest",
        column: "finance",
        interval: Time.Common,
      },
    },
  },
  yahoo: {
    name: "Yahoo",
    color: "indigo",
    home: "https://finance.yahoo.com",
    sub: {
      finance: {
        title: "Finance",
        type: "hottest",
        column: "finance",
        interval: Time.Common,
      },
    },
  },
  reuters: {
    name: "Reuters",
    color: "orange",
    home: "https://www.reuters.com",
    sub: {
      business: {
        title: "Business",
        type: "hottest",
        column: "finance",
        interval: Time.Common,
      },
    },
  },
} as const satisfies Record<string, OriginSource>

export function genSources() {
  const _: [SourceID, Source][] = []

  Object.entries(originSources).forEach(([id, source]: [any, OriginSource]) => {
    const parent = {
      name: source.name,
      type: source.type,
      disable: source.disable,
      desc: source.desc,
      column: source.column,
      home: source.home,
      color: source.color ?? "primary",
      interval: source.interval ?? Time.Default,
    }
    if (source.sub && Object.keys(source.sub).length) {
      Object.entries(source.sub).forEach(([subId, subSource], i) => {
        if (i === 0) {
          _.push([
            id,
            {
              redirect: `${id}-${subId}`,
              ...parent,
              ...subSource,
            },
          ] as [any, Source])
        }
        _.push([`${id}-${subId}`, { ...parent, ...subSource }] as [
          any,
          Source,
        ])
      })
    } else {
      _.push([
        id,
        {
          title: source.title,
          ...parent,
        },
      ])
    }
  })

  return typeSafeObjectFromEntries(
    _.filter(([_, v]) => {
      if (v.disable === "cf" && process.env.CF_PAGES) {
        return false
      } else {
        return v.disable !== true
      }
    }),
  )
}
