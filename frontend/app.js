const express      = require('express');
const path         = require('path');

require('./config/environment');

const routes          = require('./routes/index');

const assetFolder  = path.resolve(__dirname, './dist/');
const port         = process.env.PORT;
const app          = express();

app.use(express.static(assetFolder));

app.use('/', routes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
