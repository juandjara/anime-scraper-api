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
      '/episode/:slug',
      '/episode/latest'
    ]
  })
})

function errorHandler(err, res) {
  console.error(err);
  res.status(500).end();
}

app.get('/search', (req, res) => {
  const query = req.query.q;
  scraper.search(query)
  .then(search_res => res.json(search_res))
  .catch(err => errorHandler(err, res))
})

app.get('/show/:slug', (req, res) => {
  const slug = req.params.slug;
  scraper.getShow(slug)
  .then(show => res.json(show))
  .catch(err => errorHandler(err, res))
})

app.get('/episode/latest', (req, res) => {
  scraper.latestEpisodes()
  .then(eps => res.json(eps))
  .catch(err => errorHandler(err, res))
})

app.get('/episode/:slug', (req, res) => {
  const slug = req.params.slug;
  scraper.getEpisode(slug)
  .then(ep => res.json(ep))
  .catch(err => errorHandler(err, res))
})

app.listen(process.env.PORT || 4000, () => {
  console.log('App is listening at port 4000')
})
