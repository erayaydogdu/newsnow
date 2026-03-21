import process from "node:process"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const apiKey = process.env.FINNHUB_API_KEY
  if (!apiKey) throw new Error("FINNHUB_API_KEY is not set")

  const data: any[] = await myFetch(`https://finnhub.io/api/v1/news?category=general&token=${apiKey}`)

  return data.slice(0, 30).map(item => ({
    id: item.id,
    title: item.headline,
    url: item.url,
    pubDate: item.datetime * 1000,
    extra: {
      hover: item.summary?.slice(0, 200),
      info: item.source,
    },
  } as NewsItem))
})
