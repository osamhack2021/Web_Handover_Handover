const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    //components: { 'User', 'Group' },
    info: {
      title: "Handover API",
      version: "1.0.0",
      description: "Handover API with express",
    },
    host: "localhost:3000",
    basePath: "/",
  },
  apis: ["./routes/*.js", "routes/api/*.js", "./swagger/*"],
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
