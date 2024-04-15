import path from 'path';
import fs from 'fs';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import svgSprite from 'svg-sprite';
import File from 'vinyl';


const config = {
  mode: {
    symbol: true // symbol mode to build the SVG
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

  sprite.compile((error, result) => {
    console.log(result);
    if (error) {
      console.error(error);
    } else {
      fs.writeFileSync(path.resolve(__dirname, '../dist_/icons.svg'), result.symbol.sprite.contents);
    }
  });

  return createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
    symbolId: 'icon-[name]',
    inject: 'body-first',
  })
}

