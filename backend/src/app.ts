import helmet from "helmet";
import express, { Application, Request, Response } from "express"
import categorize from "./categorize"

const PORT = 8000;

const app: Application = express();
app.use(helmet());
app.use(express.json({ limit: "5MB" }));

app.get("/test", function (req: Request, res: Response) {
    return res.json({
        message: "Test succeeded!",
    });
});

app.use("/categorize", categorize);

const server = app.listen(PORT, () => {
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`⚡️[server]: running on port ${PORT}`);
});
