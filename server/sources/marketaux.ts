import process from "node:process"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const apiToken = process.env.MARKETAUX_API_TOKEN
  if (!apiToken) throw new Error("MARKETAUX_API_TOKEN is not set")

  const res: any = await myFetch(`https://api.marketaux.com/v1/news/all?api_token=${apiToken}&language=en&filter_entities=true&limit=30`)

  return (res.data || []).map((item: any) => ({
    id: item.uuid,
    title: item.title,
    url: item.url,
    pubDate: new Date(item.published_at).getTime(),
    extra: {
      hover: item.description?.slice(0, 200),
      info: item.source,
    },
  } as NewsItem))
})
