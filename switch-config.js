const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isBuild = args.includes('build');
const configFile = isBuild ? '.posthtmlrc.build' : '.posthtmlrc.serve';

console.log(path.join(__dirname, configFile));
console.log(path.join(__dirname, '.posthtmlrc'));

fs.copyFileSync(path.join(__dirname, configFile), path.join(__dirname, '.posthtmlrc'));
