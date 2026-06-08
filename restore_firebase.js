const fs = require('fs');
const path = require('path');
const dir = 'c:\\Users\\ULTRA 9\\Desktop\\Football';
const files = ['index.html', 'players.html', 'results.html', 'finances.html', 'rules.html', 'news.html'];
files.forEach(f => {
  const filepath = path.join(dir, f);
  let c = fs.readFileSync(filepath, 'utf8');
  if (!c.includes('firebase-app.js')) {
    c = c.replace('<script src="js/db.js"></script>', 
      '<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>\n  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>\n  <script src="js/db.js"></script>');
    fs.writeFileSync(filepath, c);
  }
});
console.log('Firebase scripts injected.');
