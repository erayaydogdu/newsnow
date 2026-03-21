import process from "node:process"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const apiToken = process.env.EODHD_API_TOKEN
  if (!apiToken) throw new Error("EODHD_API_TOKEN is not set")

  const data: any[] = await myFetch(`https://eodhd.com/api/news?api_token=${apiToken}&fmt=json&limit=30`)

  return data.slice(0, 30).map(item => ({
    id: item.url || item.title,
    title: item.title,
    url: item.url,
    pubDate: new Date(item.date).getTime(),
    extra: {
      hover: item.content?.slice(0, 200),
    },
  } as NewsItem))
})
