// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss';
import presetWind from '@unocss/preset-wind';

export default defineConfig({
  presets: [presetWind()], // Use Windi CSS
});
