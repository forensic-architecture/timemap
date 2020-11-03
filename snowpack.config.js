module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: ['@snowpack/plugin-babel', '@snowpack/plugin-react-refresh', '@snowpack/plugin-dotenv', '@snowpack/plugin-sass'],
  install: [
    // "@forensic-architecture/design-system/react"
  ],
  exclude: ["webpack.config.js"],
  installOptions: {
    polyfillNode: true
  },
  devOptions: {
    open: 'none'
  },
  buildOptions: {
    /* ... */
  },
  proxy: {
    /* ... */
  },
  alias: {
  },
};