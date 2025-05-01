from app.database.database import SessionLocal, engine
from app.database.seed_data import seed_database
from app.models import models

def main():
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding database...")
        seed_database(db)
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()