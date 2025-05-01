"""
Schemas for the Itinerary module.
This module defines the data validation and serialization
schemas for the travel itinerary system.

"""


from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from ..models.models import RegionEnum, TransferTypeEnum


"""
Base class for all itinerary-related schemas.
This class provides common attributes and methods
for data validation and serialization.

"""



class ActivityBase(BaseModel):
    name: str
    description: str
    start_time: datetime
    end_time: datetime
    location: str

class ActivityCreate(ActivityBase):
    pass

"""
Activity schema for creating new activities.
This schema is used when creating new activities
and includes all necessary fields.
It inherits from ActivityBase and adds
additional validation if needed.

"""

class Activity(ActivityBase):
    id: int
    day_id: int

    class Config:
        from_attributes = True


"""
Transfer schema for creating new transfers.
This schema is used when creating new transfers 

"""

class TransferBase(BaseModel):
    from_location: str
    to_location: str
    transfer_type: TransferTypeEnum
    departure_time: datetime
    arrival_time: datetime

class TransferCreate(TransferBase):
    pass


"""
Transfer schema for creating new transfers.
This schema is used when creating new transfers

"""

class Transfer(TransferBase):
    id: int
    day_id: int

    class Config:
        from_attributes = True


"""
Accommodation schema for creating new accommodations.
This schema is used when creating new accommodations
and includes all necessary fields.
It inherits from AccommodationBase and adds
additional validation if needed.
"""
class AccommodationBase(BaseModel):
    name: str
    description: str
    check_in_time: datetime
    check_out_time: datetime

class AccommodationCreate(AccommodationBase):
    pass

"""
Accommodation schema for creating new accommodations.
This schema is used when creating new accommodations
and includes all necessary fields.
It inherits from AccommodationBase and adds
additional validation if needed.

"""

class Accommodation(AccommodationBase):
    id: int
    day_id: int

    class Config:
        from_attributes = True

class DayBase(BaseModel):
    day_number: int
    accommodations: List[AccommodationCreate] = []
    activities: List[ActivityCreate] = []
    transfers: List[TransferCreate] = []

class DayCreate(DayBase):
    pass


"""
Day schema for creating new days in an itinerary.
This schema is used when creating new days
and includes all necessary fields.
It inherits from DayBase and adds
additional validation if needed.

"""

class Day(DayBase):
    id: int
    itinerary_id: int
    accommodations: List[Accommodation] = []
    transfers: List[Transfer] = []
    activities: List[Activity] = []

    class Config:
        from_attributes = True

class ItineraryBase(BaseModel):
    title: str
    description: str
    total_nights: int
    region: RegionEnum
    price: float
    is_recommended: bool = False

class ItineraryCreate(ItineraryBase):
    days: List[DayCreate] = []

"""
Itinerary schema for creating new itineraries.
This schema is used when creating new itineraries
and includes all necessary fields.
It inherits from ItineraryBase and adds
additional validation if needed.

"""


class Itinerary(ItineraryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    days: List[Day] = []

    class Config:
        from_attributes = True