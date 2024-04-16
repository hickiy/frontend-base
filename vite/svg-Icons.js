import path from 'path';
import fs from 'fs';
import svgSprite from 'svg-sprite';

const SVG_DOM_ID = '__svg__icons__dom__'

const config = {
  mode: {
    symbol: true,
  },
  shape: {
    id: {
      generator: function (file) {
        const baseName = path.basename(file, '.svg');
        return `icon-${baseName}`;
      }
    },
    transform: [{
      custom: function (shape, sprite, callback) {
        shape.resetNamespace();
        callback(null)
      }
    }],
  },
  svg: {
    namespaceIDPrefix: '',
    rootAttributes: {
      id: SVG_DOM_ID,
      style: 'position: absolute; width: 0; height: 0;',
    }
  }
};

export default function () {
  const sprite = new svgSprite(config);
  const svgFolder = path.join(__dirname, '../src/assets/svg'); // the directory of your SVG files
  fs.readdirSync(svgFolder).forEach(file => {
    const filePath = path.join(svgFolder, file);
    const svgContent = fs.readFileSync(filePath, 'utf-8');
    sprite.add(filePath, file, svgContent);
  });

  return {
    name: 'svg-icons',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/icons.svg') {
          res.setHeader('Content-Type', 'image/svg+xml');
          sprite.compile((error, result) => {
            if (error) {
              console.error(error);
            } else {
              res.end(result.symbol.sprite.contents);
            }
          });
        } else {
          next();
        }
      });
    }
  }
}





