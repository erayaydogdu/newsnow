import process from "node:process"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const apiToken = process.env.GNEWS_API_TOKEN
  if (!apiToken) throw new Error("GNEWS_API_TOKEN is not set")

  const res: any = await myFetch(`https://gnews.io/api/v4/top-headlines?category=business&lang=en&max=30&token=${apiToken}`)

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
