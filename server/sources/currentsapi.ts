import process from "node:process"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const apiKey = process.env.CURRENTSAPI_API_KEY
  if (!apiKey) throw new Error("CURRENTSAPI_API_KEY is not set")

  const res: any = await myFetch(`https://api.currentsapi.services/v1/latest-news?category=business&language=en&apiKey=${apiKey}`)

  return (res.news || []).slice(0, 30).map((item: any) => ({
    id: item.id || item.url,
    title: item.title,
    url: item.url,
    pubDate: new Date(item.published).getTime(),
    extra: {
      hover: item.description?.slice(0, 200),
    },
  } as NewsItem))
})
