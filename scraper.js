const scraper = require('anime-scraper');
const base_url = "https://ww1.gogoanime.io";

// TODO: Control concurrency and response time with
// npm.im/bottleneck

module.exports = {
  search(query) {
    return scraper.Anime.fromName(query)
  },
  getShow(slug) {
    return scraper.Anime.fromUrl(`${base_url}/category/${slug}`)
  },
  getEpisode(slug) {
    return new scraper.Episode({
      name: slug,
      url: `${base_url}/${slug}`,
      videoLinks: null
    }).fetch();
  }
}

