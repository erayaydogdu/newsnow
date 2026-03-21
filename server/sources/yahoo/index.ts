const finance = defineRSSSource("https://finance.yahoo.com/news/rssindex")

export default defineSource({
  "yahoo-finance": finance,
})
