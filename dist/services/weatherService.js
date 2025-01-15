"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const server_1 = __importDefault(require("../server"));
class WeatherService {
    validateLocation(locationName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!locationName) {
                throw new Error("Location parameter is required");
            }
            const locationExists = yield server_1.default.location.findFirst({
                where: {
                    name: locationName,
                },
            });
            if (!locationExists) {
                throw new Error(`Location '${locationName}' not found`);
            }
        });
    }
    fetchRealtimeWeather(locationName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validateLocation(locationName);
                const weatherData = yield server_1.default.weatherRealTime.findFirst({
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
                    throw new Error(`Weather data not found for location '${locationName}'`);
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
            }
            catch (error) {
                return {
                    status: "error",
                    message: error instanceof Error ? error.message : "Unknown error",
                    data: null,
                };
            }
        });
    }
    fetchForecast(locationName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validateLocation(locationName);
                const threeDayForecast = yield server_1.default.weatherForecast.findMany({
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
                    throw new Error(`Forecast data not found for location '${locationName}'`);
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
            }
            catch (error) {
                return {
                    status: "error",
                    message: error instanceof Error ? error.message : "Unknown error",
                    data: null,
                };
            }
        });
    }
    fetchAirQuality(locationName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validateLocation(locationName);
                const airQuality = yield server_1.default.airQuality.findFirst({
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
                    throw new Error(`Air quality data not found for location '${locationName}'`);
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
            }
            catch (error) {
                return {
                    status: "error",
                    message: error instanceof Error ? error.message : "Unknown error",
                    data: null,
                };
            }
        });
    }
    insertMockData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingLocation = yield server_1.default.location.findFirst({
                    where: {
                        name: "Kathmandu",
                    },
                });
                if (existingLocation) {
                    throw new Error("Mock data already exists for Kathmandu");
                }
                const location = yield server_1.default.location.create({
                    data: {
                        name: "Kathmandu",
                        latitude: 27.7172,
                        longitude: 85.324,
                    },
                });
                yield server_1.default.weatherRealTime.create({
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
                    yield server_1.default.weatherForecast.create({
                        data: {
                            locationId: location.id,
                            date: forecastDate,
                            minTemp: 20 + i,
                            maxTemp: 30 + i,
                            condition: "Sunny",
                        },
                    });
                }
                yield server_1.default.airQuality.create({
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
            }
            catch (error) {
                return {
                    status: "error",
                    message: error instanceof Error ? error.message : "Unknown error",
                    data: null,
                };
            }
        });
    }
    fetchLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locations = yield server_1.default.location.findMany({
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
            }
            catch (error) {
                return {
                    status: "error",
                    message: error instanceof Error ? error.message : "Unknown error",
                    data: null,
                };
            }
        });
    }
}
exports.WeatherService = WeatherService;
