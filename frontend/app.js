const express      = require('express');
const path         = require('path');

require('./config/environment');

const assetFolder  = path.resolve(__dirname, './dist/');
const port         = process.env.PORT;
const app          = express();

app.use(express.static(assetFolder));

app.listen(port, () => console.log(`React server is listening on port ${port}`));
