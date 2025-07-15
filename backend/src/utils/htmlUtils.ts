import * as fs from 'fs';
import * as path from 'path';

export function addGoogleFontsAndStyles(html: string, googleFontsLinks: string): string {
  const showIconRandomlyScript =
    'function showIconRandomly(icons, containerSelector, numberToShow) {' +
    '    const container = document.querySelector(containerSelector);' +
    '    if (!container) {' +
    '        console.error("Container " + containerSelector + " not found");' +
    '        return;' +
    '    }' +
    '    const zones = Array.from(container.children);' +
    '    if (zones.length === 0) {' +
    '        console.error("No child zones found in " + containerSelector);' +
    '        return;' +
    '    }' +
    '    const count = Math.min(numberToShow, zones.length, icons.length);' +
    '    const shuffledZones = zones.sort(() => 0.5 - Math.random()).slice(0, count);' +
    '    const shuffledIcons = icons.sort(() => 0.5 - Math.random()).slice(0, count);' +
    '    zones.forEach(zone => zone.innerHTML = "");' +
    '    for (let i = 0; i < count; i++) {' +
    '        const icon = shuffledIcons[i];' +
    '        const iconElement = document.createElement("i");' +
    '        iconElement.className = icon.class;' +
    '        const offsetX = Math.random() * 80;' +
    '        const offsetY = Math.random() * 80;' +
    '        const rotation = Math.random() * 60 - 30;' +
    '        const size = (Math.random() * 1.5 + 2).toFixed(2);' +
    '        const opacity = (Math.random() * 0.15 + 0.05).toFixed(2);' +
    '        iconElement.style.position = "absolute";' +
    '        iconElement.style.left = offsetX + "%";' +
    '        iconElement.style.top = offsetY + "%";' +
    '        iconElement.style.transform = "rotate(" + rotation + "deg)";' +
    '        iconElement.style.transformOrigin = "center center";' +
    '        iconElement.style.fontSize = size + "em";' +
    '        iconElement.style.opacity = opacity;' +
    '        const zone = shuffledZones[i];' +
    '        zone.appendChild(iconElement);' +
    '    }' +
    '}';

  // Le chemin des assets doit pointer vers la racine du projet, pas vers le dossier `src` ou `dist`
  const assetsPath = path.join(process.cwd(), 'assets', 'icons');
  let phosphorCss = '';
  let fontawesomeCss = '';

  try {
    // Lire le CSS Phosphor
    phosphorCss = fs.readFileSync(path.join(assetsPath, 'phosphor-duotone.css'), 'utf8');

    // Corriger les URLs des polices pour pointer vers le backend
    phosphorCss = phosphorCss.replace(
      /url\((['"]?)\.\/Phosphor-Duotone\.woff2\1\)/g,
      'url("http://localhost:3001/assets/icons/Phosphor-Duotone.woff2")',
    );

    // Lire le CSS FontAwesome
    fontawesomeCss = fs.readFileSync(path.join(assetsPath, 'fontawesome.css'), 'utf8');

    // Corriger les URLs des polices FontAwesome
    fontawesomeCss = fontawesomeCss.replace(
      /url\((['"]?)\.\/webfonts\//g,
      'url("http://localhost:3001/assets/icons/webfonts/',
    );
  } catch (error) {
    console.error('Error reading CSS files:', error);
  }

  // Créer le HTML de base
  let finalHtml =
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<meta charset="UTF-8">' +
    (googleFontsLinks ? '<link rel="stylesheet" href="' + googleFontsLinks + '">' : '') +
    '<style>.icon{display:inline-block;color:rgba(255,255,255,0.1);}</style>' +
    '<script>' +
    showIconRandomlyScript +
    '</script>' +
    '</head>' +
    '<body>' +
    html +
    '</body>' +
    '</html>';

  // Injecter le CSS des icônes inline dans le <head>
  if (phosphorCss || fontawesomeCss) {
    const cssInjection =
      (phosphorCss ? '<style>' + phosphorCss + '</style>' : '') +
      (fontawesomeCss ? '<style>' + fontawesomeCss + '</style>' : '');

    finalHtml = finalHtml.replace(/<\/head>/i, cssInjection + '\n</head>');
  }

  return finalHtml;
}
