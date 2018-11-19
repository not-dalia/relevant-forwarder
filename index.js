require("dotenv").config();
const http = require("http");
const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer({});
const server = http.createServer().listen(3123);

const baseUrl = "api.github.com";

// const allowedOrigins = [ RegExp('^(www\.){0,}not-dalia.github.io/relevant-space/*'),  ];
const allowedOrigins = [
  RegExp("^http(?:s)?:\/\/not-dalia.github.io/*"),
  RegExp("^http(?:s)?:\/\/localhost:4000/*")
];

server.on("request", (req, res) => {
  let isOriginAllowed = checkRequestOrigin(req.headers.origin);
  if (!isOriginAllowed) {
    res.statusCode = 403;
    res.end();
    return;
  }
  req.headers.host = baseUrl;
  req.headers.Authorization = `token ${process.env.GH_PAT}`;
  proxy.web(req, res, { target: `https://${baseUrl}` });
});

server.on('error', function (e) {
  // Handle your error here
  console.log(e);
});

proxy.on('error', function (e) {
  // Handle your error here
  console.log(e);
});

proxy.on('proxyRes', function(proxyRes, req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
});

function checkRequestOrigin(origin) {
  let originAllowed = false;
  if (!origin) return originAllowed;
  for (let i in allowedOrigins) {
    if (checkAllowedOrigins(origin, allowedOrigins[i])){
      originAllowed = true;
      break;
    }
  }
  return originAllowed;
}

function checkAllowedOrigins(origin, allowedOrigin){
  if (typeof allowedOrigin === 'string' || allowedOrigin instanceof String) {
    return origin === allowedOrigin;
  } else if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  } else {
    return !!allowedOrigins;
  }
}
