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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherController = void 0;
const weatherService_1 = require("../services/weatherService");
class WeatherController {
    constructor() {
        this.getRealtimeWeather = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const weatherData = yield this.weatherService.fetchRealtimeWeather(req.query.location);
                res.json(weatherData);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    next(error);
                }
            }
        });
        this.getForecast = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const forecast = yield this.weatherService.fetchForecast(req.query.location);
                res.json(forecast);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    next(error);
                }
            }
        });
        this.getAirQuality = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const airQuality = yield this.weatherService.fetchAirQuality(req.query.location);
                res.json(airQuality);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    next(error);
                }
            }
        });
        this.generateMockData = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.weatherService.insertMockData();
                res.json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    next(error);
                }
            }
        });
        this.getLocations = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locations = yield this.weatherService.fetchLocations();
                res.json(locations);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    next(error);
                }
            }
        });
        this.weatherService = new weatherService_1.WeatherService();
    }
}
exports.WeatherController = WeatherController;
