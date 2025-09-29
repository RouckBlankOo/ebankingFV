const fs = require('fs');
const path = require('path');

// Function to recursively find all .tsx files in screens directory
function findTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findTsxFiles(fullPath, files);
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to check if a file has language support
function hasLanguageSupport(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes('useLanguage') && content.includes('const { t }');
}

// Function to find hardcoded strings in a file
function findHardcodedStrings(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const patterns = [
    /"[A-Z][a-zA-Z\s]{2,}"/g,  // Quoted strings starting with capital letter
    /placeholder\s*=\s*"[^"]*"/g,  // Placeholder attributes
    /title\s*=\s*"[^"]*"/g,  // Title attributes
  ];
  
  const found = [];
  patterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      found.push(...matches);
    }
  });
  
  return [...new Set(found)]; // Remove duplicates
}

// Main analysis
const screensDir = path.join(__dirname, '..', 'screens');
const allTsxFiles = findTsxFiles(screensDir);

console.log('🔍 TRANSLATION ANALYSIS REPORT\n');
console.log(`Total screens found: ${allTsxFiles.length}\n`);

const untranslatedScreens = [];
const translatedScreens = [];

allTsxFiles.forEach(filePath => {
  const relativePath = path.relative(screensDir, filePath);
  const hasTranslation = hasLanguageSupport(filePath);
  
  if (hasTranslation) {
    translatedScreens.push(relativePath);
  } else {
    const hardcodedStrings = findHardcodedStrings(filePath);
    untranslatedScreens.push({
      path: relativePath,
      hardcodedStrings: hardcodedStrings.slice(0, 5) // Show first 5 examples
    });
  }
});

console.log('✅ SCREENS WITH TRANSLATION SUPPORT:');
translatedScreens.forEach(screen => {
  console.log(`  - ${screen}`);
});

console.log('\n❌ SCREENS MISSING TRANSLATION SUPPORT:');
untranslatedScreens.forEach(screen => {
  console.log(`\n  📄 ${screen.path}`);
  if (screen.hardcodedStrings.length > 0) {
    console.log('    Hardcoded strings found:');
    screen.hardcodedStrings.forEach(str => {
      console.log(`      - ${str}`);
    });
  }
});

console.log(`\n📊 SUMMARY:`);
console.log(`  - Translated: ${translatedScreens.length}/${allTsxFiles.length}`);
console.log(`  - Missing translation: ${untranslatedScreens.length}/${allTsxFiles.length}`);
console.log(`  - Completion: ${Math.round((translatedScreens.length / allTsxFiles.length) * 100)}%`);