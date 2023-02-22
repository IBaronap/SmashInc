import express from "express";
const PORT = 5050;
const app = express();
app.use(express.json());
app.listen(PORT, () => {
    console.log(`server live on https://localhost:${PORT}/public`);
});