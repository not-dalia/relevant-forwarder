require('dotenv').config();
const http = require("http"),
  server = http.createServer().listen(3000);


const baseUrl = "https://api.github.com";

server.on("request", (req, res) => {
  var connector = http.request(
    {
      host: baseUrl,
      path: req.url,
      method: req.method,
      headers: {...req.headers, Authorization: `token ${process.env.GH_PAT}`}
    },
    resp => {
      resp.pipe(res);
    }
  );

  req.pipe(connector);
});
