import express, { Express } from "express";
import morgan from "morgan";
import { Server } from "http";

import userRoutes from "./api/v1/routes/userRoutes";

const app: Express = express();

app.use(morgan("combined"));
app.use(express.json());

app.use("/api/v1/loans", userRoutes);

const PORT: string | number = process.env.PORT || 3000;
const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default server;