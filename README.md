# Weather API

This API allows you to access real-time weather data, weather forecasts, air quality data, and locations. The data is fetched from the corresponding tables in the database.

## Database Design

Below is the database design diagram:

![Database Design](./dbdiagram.png)

## Installation  

### Prerequisites  

- Node.js (v14 or later)  
- PostgreSQL  

### Steps  

1. **Clone the repository**:  
   ```bash  
   git clone git@github.com:AnupShrestha28/Weather-Api.git
   cd Weather-Api
   
2. Install dependencies:
   ```bash
   npm install

3. Set up environment variables:
   Create a .env file in the root directory with the following:
   ```bash
   DATABASE_URL=postgresql://username:<password>@localhost:5432/your_db_name?schema=public 
   PORT=your_port

4. Migrate the database:
   ```bash
   npx prisma generate

5. Run database migrations:
   ```bash
   npx prisma migrate dev

6. Auto-recompiles TypeScript files on changes:
   ```bash
   tsc --watch

7. Start the server:
   ```bash
   npm run dev


## API Endpoints

#### GET /weather/realtime?location=Kathmandu
- Fetch real-time weather data from the weather_realtime table for a specified location

#### GET /weather/forecast?location=Kathmandu
- Fetch a 3-day weather forecast from the weather_forecast table for a specified location

#### GET /weather/airquality?location=Kathmandu
- Fetch air quality data from the air_quality table for a specified location.

#### POST /weather/generate
- Insert new mock data into the database tables: weather_realtime, weather_forecast, and air_quality.

#### GET /weather/locations
- Fetch all available locations from the locations table.

