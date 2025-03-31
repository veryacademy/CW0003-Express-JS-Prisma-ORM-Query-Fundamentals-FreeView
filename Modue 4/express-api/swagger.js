const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My API",
    description: "Auto-generated Swagger documentation",
  },
  host: "localhost:3000", // Change if using a different port or domain
  schemes: ["http"],
};

const outputFile = "./swagger-output.json"; // Where to save the documentation
const endpointsFiles = ["./routes/a_create_record.js"]; // Files containing API routes

swaggerAutogen(outputFile, endpointsFiles, doc);
