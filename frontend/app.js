const express = require("express");
const path = require("path");

require("./config/environment");

const assetFolder = path.resolve(__dirname, "./dist/");
const port = process.env.PORT;
const app = express();

// serve static assets normally
app.use(express.static(assetFolder));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("*", function (request, response) {
  response.sendFile(path.join(assetFolder, "index.html"));
});

app.listen(port, () =>
  console.log(`React server is listening on port ${port}`)
);
