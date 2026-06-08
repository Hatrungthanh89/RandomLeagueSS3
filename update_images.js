const fs = require('fs');
const content = fs.readFileSync('js/db.js', 'utf8');

const images = [
  'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/b/bb/Neymar_Jr._with_Al_Hilal%2C_3_October_2023_-_03_%28cropped%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/57/Kylian_Mbapp%C3%A9_2018_2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/0/07/Erling_Haaland_2023_%28cropped%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_201807091.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/c/c1/Mo_Salah_2022.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/47/Robert_Lewandowski_2022_%28cropped%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/6/67/Karim_Benzema_2021.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/b/ba/Luka_Modri%C4%87_2018.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e0/Vin%C3%ADcius_J%C3%BAnior_2023.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/e/eb/Son_Heung-min_2023.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/6/69/Harry_Kane_2023_%28cropped%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/7/7b/Jude_Bellingham_2023_%28cropped%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/3d/Pedri_2021.jpg'
];

let idx = 0;
const newContent = content.replace(/img: 'https:\/\/i\.pravatar\.cc\/150\?u=.*?'/g, () => {
  const imgUrl = images[idx % images.length];
  idx++;
  return `img: '${imgUrl}'`;
});

const finalContent = newContent.replace("let data = localStorage.getItem('randomleague_data');", "localStorage.removeItem('randomleague_data');\n    let data = null;");

fs.writeFileSync('js/db.js', finalContent);
console.log("Updated db.js successfully.");
