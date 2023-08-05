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
    const { user = "", repo = "", open = "open", per_page = 30, page = 1 } = req.query
    const baseUrl = "https://api.github.com/search/issues";
    const  q= `repo:${user}/${repo}+type:issue+state:${open}`;

    const fullUrl = `${baseUrl}?q=${q}&per_page=${per_page}&page=${page}`;
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
        res.send({});
    }
}); 