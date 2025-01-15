import { Router } from "express";
import { WeatherController } from "../controllers/weatherController";

const router = Router();
const weatherController = new WeatherController();

router.get(
  "/realtime",
  weatherController.getRealtimeWeather.bind(weatherController)
);
router.get("/forecast", weatherController.getForecast.bind(weatherController));
router.get(
  "/airquality",
  weatherController.getAirQuality.bind(weatherController)
);
router.post(
  "/generate",
  weatherController.generateMockData.bind(weatherController)
);
router.get(
  "/locations",
  weatherController.getLocations.bind(weatherController)
);

export default router;
