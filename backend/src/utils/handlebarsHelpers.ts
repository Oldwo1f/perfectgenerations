import * as Handlebars from 'handlebars';

export function registerHandlebarsHelpers(): void {
  // Enregistrer le helper 'first'
  Handlebars.registerHelper('first', function (array) {
    return array && array.length ? array[0] : '';
  });

  // Enregistrer le helper 'random'
  Handlebars.registerHelper('random', function (array) {
    if (!array || !array.length) return '';
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  });

  // Helper d'égalité simple
  Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });

  // Helper de condition générique
  Handlebars.registerHelper('ifCond', function (this: any, v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case '===':
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '!=':
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case '!==':
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case '<':
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case '<=':
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case '>':
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case '>=':
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case '&&':
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case '||':
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  // Helper pour obtenir la première image du groupe 'background'
  Handlebars.registerHelper('firstBackgroundImage', function (imageGroups) {
    if (!Array.isArray(imageGroups)) return '';
    const backgroundGroup = imageGroups.find((g) => g.groupName === 'background');
    if (
      !backgroundGroup ||
      !Array.isArray(backgroundGroup.images_url) ||
      backgroundGroup.images_url.length === 0
    )
      return '';
    return backgroundGroup.images_url[0].url || '';
  });

  // Helper pour obtenir la première image d'un tableau d'images
  Handlebars.registerHelper('firstImage', function (images) {
    if (!Array.isArray(images) || images.length === 0) return '';
    return images[0].url || '';
  });

  // Helper pour obtenir une image aléatoire d'un tableau d'images
  Handlebars.registerHelper('randomImage', function (images) {
    if (!Array.isArray(images) || images.length === 0) return '';
    const idx = Math.floor(Math.random() * images.length);
    return images[idx].url || '';
  });

  // Helper pour obtenir l'URL d'une image par son nom dans un tableau d'images
  Handlebars.registerHelper('namedImage', function (images, name) {
    if (!Array.isArray(images) || !name) return '';
    const found = images.find((img) => img.name === name);
    return found && found.url ? found.url : '';
  });

  // Helper pour formater les polices (ajoute des guillemets si nécessaire)
  Handlebars.registerHelper('fontFamily', function (fontName) {
    if (!fontName) return '';
    // Si la police contient des espaces, l'entourer de guillemets
    if (fontName.includes(' ')) {
      return `"${fontName}"`;
    }
    return fontName;
  });

  // Helper pour rendre une icône
  Handlebars.registerHelper('renderIcon', function (icon) {
    let html = '';
    if (typeof icon === 'string') {
      if (icon.startsWith('ph-')) {
        html = `<div class="icon"><i class="ph-duotone ${icon}" style="font-size: 3em; color: var(--secondaryColor);"></i></div>`;
      } else if (icon.startsWith('fa-') || icon.startsWith('fa ')) {
        const faClass = icon.startsWith('fa ') ? icon : 'fa ' + icon;
        html = `<div class="icon"><i class="${faClass}" style="font-size: 3em; color: var(--secondaryColor);"></i></div>`;
      }
    } else if (icon && icon.class) {
      html = `<div class="icon"><i class="${icon.class}" style="font-size: 3em; color: var(--secondaryColor);"></i></div>`;
    }
    return new Handlebars.SafeString(html);
  });

  // Helper pour multiplier
  Handlebars.registerHelper('multiply', function (a, b) {
    return a * b;
  });

  // Helper pour modulo
  Handlebars.registerHelper('modulo', function (a, b) {
    return a % b;
  });

  // Helper pour comparer si a > b
  Handlebars.registerHelper('gt', function (a, b) {
    return a > b;
  });

  // Helper pour obtenir la longueur d'un tableau
  Handlebars.registerHelper('length', function (array) {
    return Array.isArray(array) ? array.length : 0;
  });

  // Helper pour accéder à une propriété d'un objet par index
  Handlebars.registerHelper('lookup', function (array, index, property) {
    if (!Array.isArray(array) || !array[index]) return '';
    return array[index][property] || '';
  });

  // Helper pour JSON
  Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });

  // Helper resolveImage (existant)
  Handlebars.registerHelper('resolveImage', function (imageUrl) {
    return imageUrl;
  });

  // Helper phosphor (existant)
  Handlebars.registerHelper('phosphor', function (iconName) {
    return `<i class="ph ph-${iconName}"></i>`;
  });
}
