export NODE_ENV=production

webpack --mode=production --config ./config/webpack.prd.config.js

unset NODE_ENV
