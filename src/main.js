// const path = require('path');
// const fs = require(path.resolve(__dirname).replace(/\\/g, '/') + '/../node_modules/webpack/lib/util/fs.js');


// const distPath = path.resolve(__dirname, 'html');

// fs.readdir(distPath, (err, items) => {
//     items.filter(item => (/\./.test(item))).forEach(item => {
//         require(path.resolve(__dirname).replace(/\\/g, '/') + `/html/` + item + '/');
//     })
// });

import './html/index.html'
import './scss/style.scss'
//import './js/header.js'
//import './js/account.js'
import './js/admin.js'