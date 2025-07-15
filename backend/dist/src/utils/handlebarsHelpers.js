"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandlebarsHelpers = registerHandlebarsHelpers;
const Handlebars = require("handlebars");
function registerHandlebarsHelpers() {
    Handlebars.registerHelper('first', function (array) {
        return array && array.length ? array[0] : '';
    });
    Handlebars.registerHelper('random', function (array) {
        if (!array || !array.length)
            return '';
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    });
    Handlebars.registerHelper('eq', function (a, b) {
        return a === b;
    });
    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
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
    Handlebars.registerHelper('firstBackgroundImage', function (imageGroups) {
        if (!Array.isArray(imageGroups))
            return '';
        const backgroundGroup = imageGroups.find((g) => g.groupName === 'background');
        if (!backgroundGroup ||
            !Array.isArray(backgroundGroup.images_url) ||
            backgroundGroup.images_url.length === 0)
            return '';
        return backgroundGroup.images_url[0].url || '';
    });
    Handlebars.registerHelper('firstImage', function (images) {
        if (!Array.isArray(images) || images.length === 0)
            return '';
        return images[0].url || '';
    });
    Handlebars.registerHelper('randomImage', function (images) {
        if (!Array.isArray(images) || images.length === 0)
            return '';
        const idx = Math.floor(Math.random() * images.length);
        return images[idx].url || '';
    });
    Handlebars.registerHelper('namedImage', function (images, name) {
        if (!Array.isArray(images) || !name)
            return '';
        const found = images.find((img) => img.name === name);
        return found && found.url ? found.url : '';
    });
    Handlebars.registerHelper('fontFamily', function (fontName) {
        if (!fontName)
            return '';
        if (fontName.includes(' ')) {
            return `"${fontName}"`;
        }
        return fontName;
    });
    Handlebars.registerHelper('renderIcon', function (icon) {
        let html = '';
        if (typeof icon === 'string') {
            if (icon.startsWith('ph-')) {
                html = `<div class="icon"><i class="ph-duotone ${icon}" style="font-size: 3em; color: var(--secondaryColor);"></i></div>`;
            }
            else if (icon.startsWith('fa-') || icon.startsWith('fa ')) {
                const faClass = icon.startsWith('fa ') ? icon : 'fa ' + icon;
                html = `<div class="icon"><i class="${faClass}" style="font-size: 3em; color: var(--secondaryColor);"></i></div>`;
            }
        }
        else if (icon && icon.class) {
            html = `<div class="icon"><i class="${icon.class}" style="font-size: 3em; color: var(--secondaryColor);"></i></div>`;
        }
        return new Handlebars.SafeString(html);
    });
    Handlebars.registerHelper('multiply', function (a, b) {
        return a * b;
    });
    Handlebars.registerHelper('modulo', function (a, b) {
        return a % b;
    });
    Handlebars.registerHelper('gt', function (a, b) {
        return a > b;
    });
    Handlebars.registerHelper('length', function (array) {
        return Array.isArray(array) ? array.length : 0;
    });
    Handlebars.registerHelper('lookup', function (array, index, property) {
        if (!Array.isArray(array) || !array[index])
            return '';
        return array[index][property] || '';
    });
    Handlebars.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });
    Handlebars.registerHelper('resolveImage', function (imageUrl) {
        return imageUrl;
    });
    Handlebars.registerHelper('phosphor', function (iconName) {
        return `<i class="ph ph-${iconName}"></i>`;
    });
}
//# sourceMappingURL=handlebarsHelpers.js.map