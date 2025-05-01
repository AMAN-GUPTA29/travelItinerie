"""
Database Models for Travel Itinerary System

This module defines the core data models for the travel itinerary system.
Each model maps to a specific database table and includes relationships
and constraints to maintain data integrity.

Author: Travel Itineraries Team
Last Modified: April 30, 2025
"""

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum, Boolean, func, CheckConstraint, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class RegionEnum(enum.Enum):
    """Available travel regions supported by the system."""
    PHUKET = "Phuket"
    KRABI = "Krabi"

class TransferTypeEnum(enum.Enum):
    """Types of transportation available for transfers between locations."""
    FLIGHT = "flight"
    BUS = "bus"
    BOAT = "boat"
    PRIVATE = "private transfer"
    TAXI = "taxi"

class Itinerary(Base):
    """
    Core itinerary model representing a complete travel plan.
    Contains general trip information and links to daily activities.
    
    Constraints:
    - Total nights must be between 2 and 8
    - Price must be non-negative
    - Automatically tracks creation and update timestamps
    """
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    total_nights = Column(Integer, nullable=False)
    region = Column(Enum(RegionEnum), nullable=False)
    price = Column(Float, nullable=False)
    is_recommended = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    days = relationship("Day", back_populates="itinerary", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint('total_nights >= 2 AND total_nights <= 8', name='check_total_nights_range'),
        CheckConstraint('price >= 0', name='check_price_non_negative'),
        Index('idx_itinerary_region_nights', 'region', 'total_nights'),
        Index('idx_recommended_itineraries', 'is_recommended', 'total_nights'),
        Index('idx_itinerary_price', 'price')
    )

class Day(Base):
    """
    Represents a single day in an itinerary.
    Links accommodations, activities, and transfers for each day.
    
    Constraints:
    - Day number must be positive
    - Each day number must be unique within an itinerary
    """
    __tablename__ = "days"

    id = Column(Integer, primary_key=True, index=True)
    day_number = Column(Integer, nullable=False)
    itinerary_id = Column(Integer, ForeignKey("itineraries.id"), nullable=False)
    itinerary = relationship("Itinerary", back_populates="days")
    accommodations = relationship("Accommodation", back_populates="day", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="day", cascade="all, delete-orphan")
    transfers = relationship("Transfer", back_populates="day", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint('day_number >= 1', name='check_day_number'),
        UniqueConstraint('itinerary_id', 'day_number', name='unique_day_per_itinerary'),
        Index('idx_day_itinerary', 'itinerary_id', 'day_number')
    )

class Accommodation(Base):
    """
    Represents lodging details for a specific day.
    Tracks check-in/out times and accommodation details.
    
    Constraints:
    - Check-out time must be after check-in time
    """
    __tablename__ = "accommodations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    check_in_time = Column(DateTime, nullable=False)
    check_out_time = Column(DateTime, nullable=False)
    day_id = Column(Integer, ForeignKey("days.id"), nullable=False)
    day = relationship("Day", back_populates="accommodations")

    __table_args__ = (
        CheckConstraint('check_out_time > check_in_time', name='check_checkout_after_checkin'),
        Index('idx_accommodation_times', 'check_in_time', 'check_out_time')
    )

class Transfer(Base):
    """
    Models transportation between locations.
    Includes type of transport and timing details.
    
    Constraints:
    - Arrival time must be after departure time
    - Source and destination must be different locations
    """
    __tablename__ = "transfers"

    id = Column(Integer, primary_key=True, index=True)
    from_location = Column(String, nullable=False)
    to_location = Column(String, nullable=False)
    transfer_type = Column(Enum(TransferTypeEnum), nullable=False)
    departure_time = Column(DateTime, nullable=False)
    arrival_time = Column(DateTime, nullable=False)
    day_id = Column(Integer, ForeignKey("days.id"), nullable=False)
    day = relationship("Day", back_populates="transfers")

    __table_args__ = (
        CheckConstraint('arrival_time > departure_time', name='check_arrival_after_departure'),
        CheckConstraint('from_location != to_location', name='check_different_locations'),
        Index('idx_transfer_times', 'departure_time', 'arrival_time'),
        Index('idx_transfer_locations', 'from_location', 'to_location')
    )

class Activity(Base):
    """
    Represents scheduled activities or excursions.
    Tracks timing, location, and activity details.
    
    Constraints:
    - End time must be after start time
    """
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    day_id = Column(Integer, ForeignKey("days.id"), nullable=False)
    day = relationship("Day", back_populates="activities")

    __table_args__ = (
        CheckConstraint('end_time > start_time', name='check_end_after_start'),
        Index('idx_activity_times', 'start_time', 'end_time'),
        Index('idx_activity_location', 'location')
    )