const express = require("express");
const router = express.Router();

const Group = require("../models/Group.js");
const User = require("../models/User.js");
const Item = require("../models/Item.js");

function syntaxHighlight(json) {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

const CSS = `
div { width: 100%; }
div>span { display: block; font-weight: bold; font-size: 18px;}
pre { outline: 1px solid #ccc; padding: 5px; margin: 5px; font-family: consolas; font-size: 12px;}
.string { color: green; }
.number { color: darkorange; }
.boolean { color: blue; }
.null { color: magenta; }
.key { color: red; }
`;

router.get("", async (req, res) => {
  try {
    let data = {};

    data.groups = await Group.find({});
    data.users = await User.find({});
    data.items = await Item.find({});

    data.groups = syntaxHighlight(data.groups);
    data.users = syntaxHighlight(data.users);
    data.items = syntaxHighlight(data.items);

    let result = `
        <html>
        <head>
            <style>${CSS}</style>
        </head>
        <body>
<div style="display: flex;">
<div>
<span>Users</span>
<pre>
${data.users}
</pre>
</div>
<div>
<span>Groups</span>
<pre>
${data.groups}
</pre>
</div>
<div>
<span>Items</span>
<pre>
${data.items}
</pre>
</div>
</div>
        </body>
        </html>
        `;

    res.send(result);
  } catch (e) {
    res.status(e.status || 444).send(e);
  }
});

module.exports = router;
