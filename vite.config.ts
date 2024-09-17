import { defineConfig, UserConfig } from "vite";
import { roadrollerPlugin } from "./vite-plugins/roadroller-plugin";
import { advzipPlugin } from "./vite-plugins/advzip-plugin";
import { ectPlugin } from "./vite-plugins/ect-plugin";

export default defineConfig(({ mode }) => {
  let config: UserConfig = {
    base: "",
    plugins: [roadrollerPlugin, ectPlugin(), advzipPlugin()],
  };

  if (mode === "production") {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        littlejsengine: "littlejsengine/dist/littlejs.esm.min.js",
      },
    };

    config.build = {
      minify: "terser",
      modulePreload: false,
      rollupOptions: {
        output: {
          entryFileNames: '[name].[hash].js',
          chunkFileNames: '[name].[hash].js',
          assetFileNames: '[name].[hash].[ext]',
        }
      },
      terserOptions: {
        ...config.build?.terserOptions,
        compress: {
          ...(config.build?.terserOptions?.compress as any),
          drop_console: true,
          drop_debugger: true,
          passes: 4,
          toplevel: true,
          unsafe: true,
          ecma: 2020,
          unsafe_methods: true,
        },
      },
    };
  }
  return config;
});
