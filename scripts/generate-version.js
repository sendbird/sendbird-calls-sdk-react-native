const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');

const fullPath = path.join(__dirname, '../', './src/version.ts');
console.log(chalk.blue('📝 Generate @sendbird/calls-react-native version'));
console.log(chalk.blue(`📝 ${pkg.version} generate to ${fullPath}`));

const content = `const VERSION = '${pkg.version}';
export default VERSION;
`;
fs.writeFileSync(fullPath, content, 'utf-8');
