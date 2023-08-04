require('dotenv').config();
const express = require('express');
var cors = require('cors');
axios = require("axios");
const app = express();
const port = process.env.PORT || 5000;

var allowlist = ['https://olenaageyeva.github.io/git-issue-viewer/', 'https://olenaageyeva.github.io']
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/api/express_backend',cors(corsOptionsDelegate), async (req, res) => {
    const user = req.query.user || "";
    const repo = req.query.repo || "";
    const open = req.query.open || "open";
    const baseUrl = "https://api.github.com/search/issues";
    const fullUrl = `${baseUrl}?q=repo:${user}/${repo}+type:issue+state:${open}`;
    const headers = {
        Authorization: process.env.GIT_TOKEN,
        Accept: "application/json",
    };


    if (!user || !repo) {
        res.send({});
        return;
    };

    try {
        const response = await axios.get(fullUrl, { headers })
        res.send(response.data);
    } catch (err) {
        console.log(err)
    }
}); 