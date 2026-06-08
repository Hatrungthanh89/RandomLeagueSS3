const fs = require('fs');
const files = ['index.html', 'players.html', 'results.html', 'finances.html', 'rules.html', 'news.html'];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.split('`n').join('\n');
  fs.writeFileSync(f, c);
});
console.log('Fixed HTML files');
