const express = require('express')
const app = express();
const cors = require('cors');
const scraper = require('./scraper')

app.use(cors());
app.set('json spaces', 2);

app.get('/', (req, res) => {
  res.json({
    name: 'anime-scraper-api',
    endpoints: [
      '/',
      '/search?q=',
      '/show/:slug',
      '/episode/:slug'
    ]
  })
})

app.get('/search', (req, res) => {
  const query = req.query.q;
  scraper.search(query).then(search_res => res.json(search_res));
})

app.get('/show/:slug', (req, res) => {
  const slug = req.params.slug;
  scraper.getShow(slug).then(show => res.json(show));
})

app.get('/episode/:slug', (req, res) => {
  const slug = req.params.slug;
  scraper.getEpisode(slug).then(ep => res.json(ep));
})

app.listen(process.env.PORT || 4000, () => {
  console.log('App is listening at port 4000')
})
