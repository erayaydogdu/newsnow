import process from "node:process"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const apiKey = process.env.MEDIASTACK_API_KEY
  if (!apiKey) throw new Error("MEDIASTACK_API_KEY is not set")

  // Mediastack free tier only supports HTTP
  const res: any = await myFetch(`http://api.mediastack.com/v1/news?access_key=${apiKey}&categories=business&languages=en&limit=30`)

  return (res.data || []).map((item: any) => ({
    id: item.url,
    title: item.title,
    url: item.url,
    pubDate: new Date(item.published_at).getTime(),
    extra: {
      hover: item.description?.slice(0, 200),
      info: item.source,
    },
  } as NewsItem))
})
