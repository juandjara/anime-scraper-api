const scraper = require('anime-scraper');
const axios = require('axios');
const cheerio = require('cheerio');
const base_url = "https://ww1.gogoanime.io";

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
    const link = $(`a[href^="/cover/${elem.slug}"]`).attr("href");
    elem.image = link;
    return elem;
  })
}

module.exports = {
  search(query) {
    return scraper.Anime.search(query)
    .then(res => Promise.all(res.map(withSlug).map(withImage)))
  },
  getShow(slug) {
    return scraper.Anime.fromUrl(`${base_url}/category/${slug}`)
    .then(withSlug).then(withImage)
  },
  getEpisode(slug) {
    return new scraper.Episode({
      name: slug,
      url: `${base_url}/${slug}`,
      videoLinks: null
    }).fetch();
  }
}
