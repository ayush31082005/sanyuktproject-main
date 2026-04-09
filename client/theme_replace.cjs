const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'pages', 'MyAccount.jsx');

if (!fs.existsSync(targetFile)) {
    console.error('File not found:', targetFile);
    process.exit(1);
}

let content = fs.readFileSync(targetFile, 'utf8');

// Theming Rules:
// 1. Backgrounds to Dark (#1A1A1A) / Onyx (#0D0D0D) / Gold tint
content = content.replace(/bgcolor:\s*['"](?:white|#ffffff)['"]/g, "bgcolor: '#1A1A1A'");
content = content.replace(/bgcolor:\s*['"](?:#fcfdfc)['"]/g, "bgcolor: '#0D0D0D'");
content = content.replace(/bgcolor:\s*['"](?:#fafafa)['"]/g, "bgcolor: '#0D0D0D'");
content = content.replace(/bgcolor:\s*['"](?:#f8f9f8)['"]/g, "bgcolor: '#0D0D0D'");
content = content.replace(/bgcolor:\s*['"](?:#fffbf7)['"]/g, "bgcolor: '#0D0D0D'");
content = content.replace(/bgcolor:\s*['"](?:#f0f9f1)['"]/g, "bgcolor: 'rgba(200, 169, 106, 0.05)'");
content = content.replace(/bgcolor:\s*['"](?:#fffbed)['"]/g, "bgcolor: '#0D0D0D'");
content = content.replace(/bgcolor:\s*['"](?:#fff8e1)['"]/g, "bgcolor: 'rgba(200, 169, 106, 0.05)'");
content = content.replace(/bgcolor:\s*['"](?:#f4faf5)['"]/g, "bgcolor: 'rgba(200, 169, 106, 0.05)'");
content = content.replace(/bgcolor:\s*['"](?:#fff9fb)['"]/g, "bgcolor: 'rgba(200, 169, 106, 0.05)'");
content = content.replace(/bgcolor:\s*['"](?:#f4fbf5)['"]/g, "bgcolor: 'rgba(200, 169, 106, 0.05)'");
content = content.replace(/bgcolor:\s*['"](?:#e8f5e9)['"]/g, "bgcolor: 'rgba(200, 169, 106, 0.1)'");
content = content.replace(/bgcolor:\s*['"](?:#f8fbf9)['"]/g, "bgcolor: '#0D0D0D'");

// 2. Text Colors
content = content.replace(/color:\s*['"](?:#111|#333)['"]/g, "color: '#F5E6C8'");
content = content.replace(/color:\s*['"](?:#444|#555)['"]/g, "color: '#C8A96A'");
content = content.replace(/color:\s*['"](?:#666|#777)['"]/g, "color: 'rgba(200, 169, 106, 0.8)'");
content = content.replace(/color:\s*['"](?:#888|#999)['"]/g, "color: 'rgba(200, 169, 106, 0.6)'");
content = content.replace(/color:\s*['"](?:#aaa|#ccc)['"]/g, "color: 'rgba(200, 169, 106, 0.4)'");

// 3. Border Colors
content = content.replace(/border(?:Right|Bottom|Top|Left)?:\s*['"]\d*(?:\.\d+)?px\s+solid\s+(?:#f0f0f0|#e0e6e1|#f5ebe0|#eaeaea|#eee|#e0e0e0|#e8f5e9)['"]/gi, match => {
    return match.replace(/(#f0f0f0|#e0e6e1|#f5ebe0|#eaeaea|#eee|#e0e0e0|#e8f5e9)/i, "' + 'rgba(200, 169, 106, 0.15)' + '");
});
content = content.replace(/borderColor:\s*['"](?:#f0f0f0|#eaeaea|#eee|#d0d0d0|#ddd|#e8f5e9)['"]/g, "borderColor: 'rgba(200, 169, 106, 0.2)'");
content = content.replace(/border:\s*['"]2px\s+dashed\s+#e0e0e0['"]/g, "border: '2px dashed rgba(200, 169, 106, 0.2)'");

// 4. Accent colors (Orange & Green to Gold)
content = content.replace(/color:\s*['"]#F7931E['"]/gi, "color: '#C8A96A'");
content = content.replace(/bgcolor:\s*['"]#F7931E['"]/gi, "bgcolor: '#C8A96A'");
content = content.replace(/bgcolor:\s*['"]#f3791e['"]/gi, "bgcolor: '#C8A96A'"); // Orders CTA replace
content = content.replace(/['"]#1a8c3a['"]/gi, "'#C8A96A'");
content = content.replace(/['"]#085c22['"]/gi, "'rgba(200,169,106,0.8)'");
content = content.replace(/['"]#086325['"]/gi, "'rgba(200,169,106,0.8)'");
content = content.replace(/['"]#065a22['"]/gi, "'#0D0D0D'");
content = content.replace(/['"]#e91e63['"]/gi, "'#C8A96A'"); // Donations
content = content.replace(/['"]#2196f3['"]/gi, "'#C8A96A'"); // Tickets
content = content.replace(/color:\s*['"](?:#e0681a|#f3791e)['"]/gi, "color: '#C8A96A'");

// 5. Box Shadows (Green/Orange glows to Gold)
content = content.replace(/boxShadow:\s*['"](.*?)rgba\(\s*10\s*,\s*122\s*,\s*47\s*,\s*([\d.]+)\s*\)(.*?)['"]/g, "boxShadow: '$1rgba(200, 169, 106, $2)$3'");
content = content.replace(/boxShadow:\s*['"](.*?)rgba\(\s*247\s*,\s*147\s*,\s*30\s*,\s*([\d.]+)\s*\)(.*?)['"]/g, "boxShadow: '$1rgba(200, 169, 106, $2)$3'");
content = content.replace(/boxShadow:\s*['"](.*?)rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*([\d.]+)\s*\)(.*?)['"]/g, "boxShadow: '$1rgba(0, 0, 0, 0.4)$3'");

// 6. Header Gradients and complex styles
content = content.replace(/linear-gradient\(135deg,\s*#C8A96A\s*0%,\s*#C8A96A\s*50%,\s*#0D0D0D\s*100%\)/gi, "linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)");
content = content.replace(/linear-gradient\(180deg,\s*#C8A96A\s*0%,\s*#C8A96A\s*60%,\s*#C8A96A\s*100%\)/gi, "linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)");
content = content.replace(/border-top: (['"]?)1px solid \+ rgba\(200, 169, 106, 0.15\)/g, "borderTop: $11px solid rgba(200, 169, 106, 0.15)"); // Fix malformed replace from earlier rule

// Write modified content
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated MyAccount.jsx theme using cjs loader.');
