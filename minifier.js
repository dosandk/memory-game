const fs = require('fs');
const UglifyJS = require('uglify-js');
const sourceCode = fs.readFileSync('./src/js/scripts.js', 'utf8');

const result = UglifyJS.minify(sourceCode);

console.error('result', result);
