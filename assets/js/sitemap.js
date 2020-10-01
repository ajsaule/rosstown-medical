const SitemapGenerator = require('sitemap-generator');

// create generator
const generator = SitemapGenerator('http://www.rosstownfamilymedical.com.au/', {
  stripQuerystring: false
});

// register event listeners
generator.on('done', () => {
  console.log('registering')
});

// start the crawler
generator.start();