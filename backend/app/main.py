"""
    main.py
    This file serves as the entry point for the FastAPI application.
    It initializes the application, sets up middleware, and includes routers.

"""


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.database import engine, Base
from .models import models

models.Base.metadata.create_all(bind=engine)
"""
    Initialize the FastAPI application with CORS middleware and include routers.
    The application is configured to allow all origins, methods, and headers.
    The routers are included under the prefix "/api/v1" and tagged with "itineraries".
    The database models are created at startup.
    The application is set up to handle requests related to travel itineraries.

"""

app = FastAPI(
    title="Travel Itineraries API",
    description="API for managing travel itineraries",
    version="1.0.0"
)


"""
    Middleware configuration for CORS (Cross-Origin Resource Sharing).
    This allows the API to be accessed from different origins, which is useful
    for frontend applications hosted on different domains.
"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .routers import itineraries
app.include_router(itineraries.router, prefix="/api/v1", tags=["itineraries"])