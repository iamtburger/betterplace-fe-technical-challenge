const postcss = require('postcss')

const base = {
  plugins: {
    'autoprefixer': {},
    'postcss-nesting': {},
  },
}

module.exports = base
