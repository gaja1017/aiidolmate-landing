const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

async function build() {
  console.log('Building landing page...');

  const srcPath = path.join(__dirname, '../src/index.html');
  const srcAssetsDir = path.join(__dirname, '../src/assets');
  const publicDir = path.join(__dirname, '../public');
  const publicAssetsDir = path.join(publicDir, 'assets');
  const outPath = path.join(publicDir, 'index.html');

  // Create public directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Create public/assets directory and copy assets (recursively)
  function copyDirRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    let count = 0;
    entries.forEach(entry => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        count += copyDirRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        count++;
      }
    });
    return count;
  }

  if (fs.existsSync(srcAssetsDir)) {
    const assetCount = copyDirRecursive(srcAssetsDir, publicAssetsDir);
    console.log(`📦 Copied ${assetCount} assets to public/assets/`);
  }

  // Copy favicon files
  const faviconFiles = ['favicon.ico', 'favicon.png', 'apple-touch-icon.png'];
  faviconFiles.forEach(file => {
    const srcFile = path.join(__dirname, '../src', file);
    const destFile = path.join(publicDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
    }
  });
  console.log(`🎨 Copied favicon files`);

  if (!fs.existsSync(srcPath)) {
    console.error('Source file not found: src/index.html');
    process.exit(1);
  }

  let html = fs.readFileSync(srcPath, 'utf8');

  // Minify HTML (skip JS obfuscation due to size issues)
  const minified = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true,
  });

  // Add anti-debugging and content protection
  const protectionScript = `
<style>
/* Disable text selection */
body,html{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}
/* Disable image dragging */
img{-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;-o-user-drag:none;user-drag:none;pointer-events:none;}
/* Disable printing */
@media print{body{display:none !important;}}
</style>
<script>
(function(){
  // Disable right-click
  document.addEventListener('contextmenu',function(e){e.preventDefault();return false;});
  // Disable text selection
  document.addEventListener('selectstart',function(e){e.preventDefault();return false;});
  // Disable copy
  document.addEventListener('copy',function(e){e.preventDefault();return false;});
  // Disable cut
  document.addEventListener('cut',function(e){e.preventDefault();return false;});
  // Disable drag
  document.addEventListener('dragstart',function(e){e.preventDefault();return false;});
  // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+A
  document.addEventListener('keydown',function(e){
    if(e.key==='F12'||
       (e.ctrlKey&&e.shiftKey&&(e.key==='I'||e.key==='J'||e.key==='C'))||
       (e.ctrlKey&&(e.key==='u'||e.key==='U'||e.key==='s'||e.key==='S'||e.key==='p'||e.key==='P'||e.key==='c'||e.key==='C'||e.key==='a'||e.key==='A'))){
      e.preventDefault();
      return false;
    }
  });
  // Disable image context menu and drag
  document.querySelectorAll('img').forEach(function(img){
    img.setAttribute('draggable','false');
    img.addEventListener('contextmenu',function(e){e.preventDefault();});
    img.addEventListener('dragstart',function(e){e.preventDefault();});
  });
  // Detect DevTools - only on desktop
  var isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if(!isMobile){
    var devtools={open:false};
    // Method: debugger timing (desktop only)
    setInterval(function(){
      var start=performance.now();
      debugger;
      if(performance.now()-start>100){
        if(!devtools.open){
          devtools.open=true;
          document.body.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0b0b13;color:#fff;font-family:sans-serif;text-align:center;"><div><h1>Access Denied</h1><p>Developer tools are not allowed.</p></div></div>';
        }
      }
    },1000);
  }
  // Disable view-source protocol
  if(window.location.protocol==='view-source:'){
    window.location.href='about:blank';
  }
})();
</script>`;

  const finalHtml = minified.replace('</head>', protectionScript + '</head>');

  fs.writeFileSync(outPath, finalHtml);

  const originalSize = fs.statSync(srcPath).size;
  const finalSize = fs.statSync(outPath).size;

  console.log(`✅ Build complete!`);
  console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`);
  console.log(`   Output: ${(finalSize / 1024).toFixed(1)} KB`);
  console.log(`   Reduction: ${((1 - finalSize/originalSize) * 100).toFixed(1)}%`);
}

build().catch(console.error);
