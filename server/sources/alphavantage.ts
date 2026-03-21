import process from "node:process"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const apiKey = process.env.ALPHAVANTAGE_API_KEY
  if (!apiKey) throw new Error("ALPHAVANTAGE_API_KEY is not set")

  const res: any = await myFetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${apiKey}&limit=30`)

  return (res.feed || []).slice(0, 30).map((item: any) => ({
    id: item.url,
    title: item.title,
    url: item.url,
    pubDate: parseAlphaVantageDate(item.time_published),
    extra: {
      hover: item.summary?.slice(0, 200),
      info: item.source,
    },
  } as NewsItem))
})

function parseAlphaVantageDate(dateStr: string): number {
  // Format: "20231215T120000"
  if (!dateStr) return Date.now()
  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)
  const hour = dateStr.slice(9, 11)
  const min = dateStr.slice(11, 13)
  const sec = dateStr.slice(13, 15)
  return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`).getTime()
}
