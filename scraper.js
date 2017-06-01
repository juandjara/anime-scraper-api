const axios = require('axios');
const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');
const scraper = require('anime-scraper');
const bottleneck = require('bottleneck');
const base_url = "https://ww1.gogoanime.io";

// maxConcurrentCalls, minTimeBetweenRequests, maxTimeForOneRequest
const limiter = new bottleneck(5, 0, 5000);

// TODO: Control concurrency and response time with npm.im/bottleneck
// this is needed because when the search does not find anything
// is stuck in timeout

function withSlug(elem) {
  const slugIndex = elem.url.lastIndexOf('/');
  const slug = elem.url.substring(slugIndex + 1);
  elem.slug = slug;
  return elem;
}
function withImage(elem) {
  const images_base = "https://images.gogoanime.tv/cover/";
  return axios.get(images_base).then(res => {
    const $ = cheerio.load(res.data);
    const jpg_link = $(`a[href="/cover/${elem.slug}.jpg"]`).attr("href");
    const png_link = $(`a[href="/cover/${elem.slug}.png"]`).attr("href");
    elem.image = images_base.replace('/cover/', '')+(jpg_link || png_link);
    return elem;
  })
}

module.exports = {
  search(query) {
    return limiter.schedule(scraper.Anime.search, query)
    .then(res => Promise.all(res.map(withSlug).map(withImage)))
  },
  latestEpisodes() {
    return new Promise((resolve, reject) => {
      cloudscraper.get('https://ww1.gogoanime.io/', (err, res, body) => {
        const $ = cheerio.load(body);
        const episodes = $(".last_episodes li .img a");
        const data = episodes.map(function() {
          const $episode = $(this);
          return {
            name: $episode.attr("title"),
            slug: $episode.attr("href").substring(1),
            image: $episode.find('img').attr('src')
          }
        }).get();
        resolve(data);
      })
    })
  },
  getShow(slug) {
    return limiter.schedule(
      scraper.Anime.fromUrl,
      `${base_url}/category/${slug}`
    )
    .then(withSlug).then(withImage)
  },
  getEpisode(slug) {
    return new scraper.Episode({
      name: slug,
      url: `${base_url}/${slug}`,
      slug,
      videoLinks: null
    }).fetch();
  }
}
