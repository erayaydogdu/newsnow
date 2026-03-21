import process from "node:process"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const apiKey = process.env.POLYGON_API_KEY
  if (!apiKey) throw new Error("POLYGON_API_KEY is not set")

  const res: any = await myFetch(`https://api.polygon.io/v2/reference/news?apiKey=${apiKey}&limit=30&order=desc&sort=published_utc`)

  return (res.results || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    url: item.article_url,
    pubDate: new Date(item.published_utc).getTime(),
    extra: {
      hover: item.description?.slice(0, 200),
      info: item.publisher?.name,
    },
  } as NewsItem))
})
