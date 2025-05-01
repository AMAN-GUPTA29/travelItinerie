"""
Travel Itinerary Service Layer
Business logic implementation for managing travel itineraries.
Handles creation, retrieval, and recommendation of travel packages.

The service layer abstracts database operations and implements
validation logic to maintain data integrity and business rules.

Note: All database operations are wrapped in try-except blocks
to ensure proper error handling and transaction management.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List
from ..models import models
from ..schemas import schemas
from datetime import datetime

def create_itinerary(db: Session, itinerary_data: schemas.ItineraryCreate):
    """
    Creates a new travel itinerary with associated days, accommodations,
    activities, and transfers.

    Args:
        db: Database session
        itinerary_data: Validated itinerary data from request

    Returns:
        models.Itinerary: Newly created itinerary with all relationships loaded

    Raises:
        HTTPException: If creation fails or validation errors occur
    """
    try:
        db_itinerary = models.Itinerary(
            title=itinerary_data.title,
            description=itinerary_data.description,
            total_nights=itinerary_data.total_nights,
            region=itinerary_data.region,
            price=itinerary_data.price,
            is_recommended=itinerary_data.is_recommended
        )
        db.add(db_itinerary)
        db.flush()

        for day_data in itinerary_data.days:
            db_day = models.Day(
                day_number=day_data.day_number,
                itinerary_id=db_itinerary.id
            )
            db.add(db_day)
            db.flush()

            for acc_data in day_data.accommodations:
                db_accommodation = models.Accommodation(
                    name=acc_data.name,
                    description=acc_data.description,
                    check_in_time=acc_data.check_in_time,
                    check_out_time=acc_data.check_out_time,
                    day_id=db_day.id
                )
                db.add(db_accommodation)

            for activity_data in day_data.activities:
                db_activity = models.Activity(
                    name=activity_data.name,
                    description=activity_data.description,
                    start_time=activity_data.start_time,
                    end_time=activity_data.end_time,
                    location=activity_data.location,
                    day_id=db_day.id
                )
                db.add(db_activity)

            for transfer_data in day_data.transfers:
                db_transfer = models.Transfer(
                    from_location=transfer_data.from_location,
                    to_location=transfer_data.to_location,
                    transfer_type=transfer_data.transfer_type,
                    departure_time=transfer_data.departure_time,
                    arrival_time=transfer_data.arrival_time,
                    day_id=db_day.id
                )
                db.add(db_transfer)

        db.commit()
        db.refresh(db_itinerary)
        
        # Ensure all relationships are loaded
        _ = db_itinerary.days
        for day in db_itinerary.days:
            _ = day.accommodations
            _ = day.activities
            _ = day.transfers
            
        return db_itinerary
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create itinerary: {str(e)}")

def get_itineraries(db: Session, skip: int = 0, limit: int = 100) -> List[models.Itinerary]:
    """
    Retrieves a paginated list of all itineraries.

    Args:
        db: Database session
        skip: Number of records to skip (pagination offset)
        limit: Maximum number of records to return

    Returns:
        List[models.Itinerary]: List of itineraries with all relationships loaded

    Raises:
        HTTPException: If database query fails
    """
    try:
        return db.query(models.Itinerary).offset(skip).limit(limit).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch itineraries: {str(e)}")

def get_itinerary(db: Session, itinerary_id: int) -> models.Itinerary:
    """
    Retrieves a specific itinerary by ID.

    Args:
        db: Database session
        itinerary_id: ID of the itinerary to retrieve

    Returns:
        models.Itinerary: Requested itinerary with all relationships loaded

    Raises:
        HTTPException: If itinerary not found or query fails
    """
    try:
        itinerary = db.query(models.Itinerary).filter(models.Itinerary.id == itinerary_id).first()
        if itinerary is None:
            raise HTTPException(status_code=404, detail=f"Itinerary with id {itinerary_id} not found")
        return itinerary
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch itinerary: {str(e)}")

def get_recommended_itineraries(db: Session, nights: int) -> List[models.Itinerary]:
    """
    Retrieves recommended itineraries for a specific duration.

    Args:
        db: Database session
        nights: Number of nights for the itinerary

    Returns:
        List[models.Itinerary]: List of recommended itineraries matching the criteria

    Raises:
        HTTPException: If validation fails or no matching itineraries found
    """
    try:
        if not 2 <= nights <= 8:
            raise HTTPException(status_code=400, detail="Number of nights must be between 2 and 8")
        
        itineraries = db.query(models.Itinerary).filter(
            models.Itinerary.total_nights == nights,
            models.Itinerary.is_recommended == True
        ).all()
        
        if not itineraries:
            raise HTTPException(status_code=404, detail=f"No recommended itineraries found for {nights} nights")
        
        return itineraries
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recommended itineraries: {str(e)}")