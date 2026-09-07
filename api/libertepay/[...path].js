import express from "express";
import libertePayRoutes from "../../backend/routes/libertepay.js";

const app = express();
app.use(express.json());
app.use("/", libertePayRoutes);

export default app;
