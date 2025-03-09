import express, { Express } from "express";
import morgan from "morgan";
import { Server } from "http";
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

const PORT: string | number = process.env.PORT || 3000;
const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(errorHandler);

export default server;
