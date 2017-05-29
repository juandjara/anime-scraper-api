const scraper = require('anime-scraper');
const base_url = "https://ww1.gogoanime.io";

// TODO: Control concurrency and response time with
// npm.im/bottleneck

function withSlug(elem) {
  const slugIndex = elem.url.lastIndexOf('/');
  const slug = elem.url.substring(slugIndex + 1);
  elem.slug = slug;
  return elem;
}

module.exports = {
  search(query) {
    return scraper.Anime.search(query).then(res => res.map(withSlug))
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

