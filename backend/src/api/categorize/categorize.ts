import express, { Request, Response } from "express";
import { categorize,CategorizeInput } from "../../utils/categorizeutils";
const app = express.Router();


app.post("/", async (req: Request, res: Response) =>{
    try {
        const input = req.body as CategorizeInput;
        const result = await categorize(input);
        return res.json({
            result
        });
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
});



export default app;