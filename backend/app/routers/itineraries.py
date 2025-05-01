"""
Travel Itineraries Router

Handles HTTP endpoints for travel itinerary operations.
Provides routes for creating, retrieving, and recommending travel packages.

Routes:
- POST /itineraries: Create new itinerary
- GET /itineraries: List all itineraries
- GET /itineraries/{id}: Get specific itinerary
- GET /itineraries/recommendations/{nights}: Get recommended itineraries
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..schemas import schemas
from ..services import services

router = APIRouter()

@router.post("/itineraries/", response_model=schemas.Itinerary, status_code=status.HTTP_201_CREATED)
def create_itinerary(itinerary: schemas.ItineraryCreate, db: Session = Depends(get_db)):
    """
    Creates a new travel itinerary.
    
    Accepts full itinerary details including accommodation,
    activities, and transfers for each day. Validates the data
    and persists it to the database.

    Returns:
        schemas.Itinerary: Created itinerary with all relationships
    """
    return services.create_itinerary(db, itinerary)

@router.get("/itineraries/", response_model=List[schemas.Itinerary])
def get_itineraries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Lists all itineraries with pagination support.
    
    Args:
        skip: Number of records to skip (default: 0)
        limit: Maximum records to return (default: 100)
    
    Returns:
        List[schemas.Itinerary]: List of itineraries
    """
    return services.get_itineraries(db, skip, limit)

@router.get("/itineraries/{itinerary_id}", response_model=schemas.Itinerary)
def get_itinerary(itinerary_id: int, db: Session = Depends(get_db)):
    """
    Retrieves a specific itinerary by ID.
    
    Includes all related data like accommodations,
    activities, and transfers for each day.
    
    Args:
        itinerary_id: Unique identifier of the itinerary
    
    Returns:
        schemas.Itinerary: Requested itinerary details
    """
    return services.get_itinerary(db, itinerary_id)

@router.get("/itineraries/recommendations/{nights}", response_model=List[schemas.Itinerary])
def get_recommended_itineraries(nights: int, db: Session = Depends(get_db)):
    """
    Retrieves recommended itineraries for specified duration.
    
    Returns curated itineraries marked as recommended for
    the given number of nights (2-8 nights supported).
    
    Args:
        nights: Number of nights for the itinerary
    
    Returns:
        List[schemas.Itinerary]: List of recommended itineraries
    """
    return services.get_recommended_itineraries(db, nights)