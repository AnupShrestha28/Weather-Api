import { Request, Response, NextFunction } from "express";
import { WeatherService } from "../services/weatherService";

export class WeatherController {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  public getRealtimeWeather = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const weatherData = await this.weatherService.fetchRealtimeWeather(
        req.query.location as string
      );
      res.json(weatherData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  };

  public getForecast = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const forecast = await this.weatherService.fetchForecast(
        req.query.location as string
      );
      res.json(forecast);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  };

  public getAirQuality = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const airQuality = await this.weatherService.fetchAirQuality(
        req.query.location as string
      );
      res.json(airQuality);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  };

  public generateMockData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.weatherService.insertMockData();
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  };

  public getLocations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const locations = await this.weatherService.fetchLocations();
      res.json(locations);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  };
}
