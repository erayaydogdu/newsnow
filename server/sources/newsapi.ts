import process from "node:process"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const apiKey = process.env.NEWSAPI_API_KEY
  if (!apiKey) throw new Error("NEWSAPI_API_KEY is not set")

  const res: any = await myFetch(`https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=30&apiKey=${apiKey}`)

  return (res.articles || []).map((item: any) => ({
    id: item.url,
    title: item.title,
    url: item.url,
    pubDate: new Date(item.publishedAt).getTime(),
    extra: {
      hover: item.description?.slice(0, 200),
      info: item.source?.name,
    },
  } as NewsItem))
})
