import express from "express";
import weatherRoutes from "./routes/weatherRoutes";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Weather API! Use /weather for weather data.");
});

app.use("/weather", weatherRoutes);

export default app;
