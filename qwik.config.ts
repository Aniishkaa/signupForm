import { defineConfig } from '@builder.io/qwik';
import { qwikCity } from '@builder.io/qwik-city';

export default defineConfig({
  plugins: [qwikCity()],
  devTools: {
    clickToSource: ['alt'],
  },
});