const fs = require('fs');
const files = ['index.html', 'players.html', 'results.html', 'finances.html', 'rules.html', 'news.html'];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/<script src="https:\/\/www\.gstatic\.com\/firebasejs\/8\.10\.1\/firebase-app\.js"><\/script>\n/g, '');
  c = c.replace(/  <script src="https:\/\/www\.gstatic\.com\/firebasejs\/8\.10\.1\/firebase-firestore\.js"><\/script>\n/g, '');
  fs.writeFileSync(f, c);
});
console.log('Removed Firebase scripts from HTML files.');
