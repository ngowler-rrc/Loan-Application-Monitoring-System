import express, { Express } from "express";
import morgan from "morgan";
import loanRoutes from "./api/v1/routes/loanRoutes";
import userRoutes from "./api/v1/routes/userRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import errorHandler from "./api/v1/middleware/errorHandler";

const app: Express = express();

app.use(morgan("combined"));
app.use(express.json());

app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

export default app;
