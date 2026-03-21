const business = defineRSSSource("https://feeds.bbci.co.uk/news/business/rss.xml")

export default defineSource({
  "bbc-business": business,
})
