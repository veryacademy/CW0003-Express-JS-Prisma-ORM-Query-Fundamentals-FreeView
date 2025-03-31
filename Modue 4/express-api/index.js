const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const indexRouter = require("./routes/a_create_record");
const swaggerFile = require("./swagger-output.json");

// Middleware (optional, but common)
app.use(express.json()); // For parsing JSON bodies

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/", indexRouter);

app.listen(3000, () => console.log("Server running on port 3000"));
