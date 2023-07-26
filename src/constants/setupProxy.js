const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://yogacentermanagement.azurewebsites.net",
      changeOrigin: true,
      //secure: false,
    })
  );
};
