import prisma from "../server";

interface WeatherResponse {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind_speed: number;
}

interface ForecastResponse {
  date: Date;
  location: string;
  min_temperature: number;
  max_temperature: number;
  condition: string;
}

interface AirQualityResponse {
  location: string;
  aqi: number;
  description: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T | null;
}

export class WeatherService {
  private async validateLocation(
    locationName: string | undefined
  ): Promise<void> {
    if (!locationName) {
      throw new Error("Location parameter is required");
    }

    const locationExists = await prisma.location.findFirst({
      where: {
        name: locationName,
      },
    });

    if (!locationExists) {
      throw new Error(`Location '${locationName}' not found`);
    }
  }

  async fetchRealtimeWeather(
    locationName: string | undefined
  ): Promise<ApiResponse<WeatherResponse>> {
    try {
      await this.validateLocation(locationName);

      const weatherData = await prisma.weatherRealTime.findFirst({
        where: {
          location: {
            name: locationName,
          },
        },
        include: {
          location: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!weatherData) {
        throw new Error(
          `Weather data not found for location '${locationName}'`
        );
      }

      return {
        status: "success",
        message: "Realtime weather data fetched successfully",
        data: {
          location: weatherData.location.name,
          temperature: Number(weatherData.temperature),
          condition: weatherData.condition,
          humidity: weatherData.humidity,
          wind_speed: Number(weatherData.windSpeed),
        },
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  }

  async fetchForecast(
    locationName: string | undefined
  ): Promise<ApiResponse<ForecastResponse[]>> {
    try {
      await this.validateLocation(locationName);

      const threeDayForecast = await prisma.weatherForecast.findMany({
        where: {
          location: {
            name: locationName,
          },
          date: {
            gte: new Date(),
          },
        },
        take: 3,
        orderBy: {
          date: "asc",
        },
        include: {
          location: true,
        },
      });

      if (!threeDayForecast.length) {
        throw new Error(
          `Forecast data not found for location '${locationName}'`
        );
      }

      const forecastData = threeDayForecast.map((forecast) => ({
        date: forecast.date,
        location: forecast.location.name,
        min_temperature: Number(forecast.minTemp),
        max_temperature: Number(forecast.maxTemp),
        condition: forecast.condition,
      }));

      return {
        status: "success",
        message: "Weather forecast fetched successfully",
        data: forecastData,
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  }

  async fetchAirQuality(
    locationName: string | undefined
  ): Promise<ApiResponse<AirQualityResponse>> {
    try {
      await this.validateLocation(locationName);

      const airQuality = await prisma.airQuality.findFirst({
        where: {
          location: {
            name: locationName,
          },
        },
        include: {
          location: true,
        },
      });

      if (!airQuality) {
        throw new Error(
          `Air quality data not found for location '${locationName}'`
        );
      }

      return {
        status: "success",
        message: "Air quality data fetched successfully",
        data: {
          location: airQuality.location.name,
          aqi: airQuality.aqi,
          description: airQuality.description,
        },
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  }

  async insertMockData(): Promise<ApiResponse<{ message: string }>> {
    try {
      const existingLocation = await prisma.location.findFirst({
        where: {
          name: "Kathmandu",
        },
      });

      if (existingLocation) {
        throw new Error("Mock data already exists for Kathmandu");
      }

      const location = await prisma.location.create({
        data: {
          name: "Kathmandu",
          latitude: 27.7172,
          longitude: 85.324,
        },
      });

      await prisma.weatherRealTime.create({
        data: {
          locationId: location.id,
          temperature: 25.5,
          condition: "Partly Cloudy",
          humidity: 65,
          windSpeed: 12.5,
        },
      });

      const today = new Date();
      for (let i = 0; i < 3; i++) {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + i);

        await prisma.weatherForecast.create({
          data: {
            locationId: location.id,
            date: forecastDate,
            minTemp: 20 + i,
            maxTemp: 30 + i,
            condition: "Sunny",
          },
        });
      }

      await prisma.airQuality.create({
        data: {
          locationId: location.id,
          aqi: 85,
          description: "Moderate",
        },
      });

      return {
        status: "success",
        message: "Mock data generated successfully",
        data: { message: "Mock data generated successfully" },
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  }

  async fetchLocations(): Promise<ApiResponse<any>> {
    try {
      const locations = await prisma.location.findMany({
        select: {
          id: true,
          name: true,
          latitude: true,
          longitude: true,
        },
      });

      if (!locations.length) {
        throw new Error("No locations found");
      }

      return {
        status: "success",
        message: "Locations fetched successfully",
        data: locations,
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  }
}
