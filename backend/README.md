# Travel Itineraries API

A FastAPI-based backend system for managing travel itineraries, specifically focused on Phuket and Krabi regions in Thailand.

## Features

- Database architecture for trip itineraries using SQLAlchemy
- RESTful API endpoints for creating and viewing itineraries
- MCP server that provides recommended itineraries based on duration
- Support for day-wise hotel accommodations, transfers, and activities

## Project Structure

```
app/
├── database/
│   ├── database.py
│   └── seed_data.py
├── models/
│   └── models.py
├── schemas/
│   └── schemas.py
├── routers/
│   └── itineraries.py
└── main.py
```

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
.\venv\Scripts\activate
# Unix/MacOS
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

- `POST /api/v1/itineraries/` - Create a new itinerary
- `GET /api/v1/itineraries/` - List all itineraries
- `GET /api/v1/itineraries/{itinerary_id}` - Get a specific itinerary
- `GET /api/v1/itineraries/recommendations/{nights}` - Get recommended itineraries for a specific number of nights

## Database Schema

The system includes the following models:
- Itinerary
- Day
- Accommodation
- Transfer
- Activity

## Technologies Used

- FastAPI
- SQLAlchemy
- Pydantic
- SQLite (for development)
- Python 3.8+ 