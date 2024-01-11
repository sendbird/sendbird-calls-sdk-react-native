const fs = require('fs');

fs.writeFileSync('./lib/package.json', JSON.stringify({ version: require('../package.json').version }, null, 2));
