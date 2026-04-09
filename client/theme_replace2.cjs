const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'pages', 'MyAccount.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

content = content.replace(/\?\s*['"]#fcfdfc['"]\s*:\s*['"]white['"]/g, "? '#1A1A1A' : '#0D0D0D'");

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed ternary table row colors.');
