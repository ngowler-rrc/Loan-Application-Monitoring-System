import { Server } from "http";
import app from "./app";

const PORT: string | number = process.env.PORT || 3000;

const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default server;
