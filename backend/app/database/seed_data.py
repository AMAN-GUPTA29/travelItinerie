"""
    Seeding data for the database.
    This module contains functions to create and seed itineraries,
    accommodations, activities, and transfers in the database.
    It uses SQLAlchemy ORM to interact with the database.

"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models import models
from ..models.models import RegionEnum, TransferTypeEnum

def create_day(db, itinerary_id, day_number, accommodation_name, accommodation_desc, 
               activity_name, activity_desc, activity_location, activity_start_hour, 
               activity_end_hour, transfer_from=None, transfer_to=None, 
               transfer_type=None, transfer_departure_hour=None, transfer_arrival_hour=None):
    day = models.Day(
        day_number=day_number,
        itinerary_id=itinerary_id
    )
    db.add(day)
    db.commit()
    
    accommodation = models.Accommodation(
        name=accommodation_name,
        description=accommodation_desc,
        check_in_time=datetime.now() + timedelta(days=day_number-1, hours=14),
        check_out_time=datetime.now() + timedelta(days=day_number, hours=12),
        day_id=day.id
    )
    db.add(accommodation)
    
    activity = models.Activity(
        name=activity_name,
        description=activity_desc,
        start_time=datetime.now() + timedelta(days=day_number-1, hours=activity_start_hour),
        end_time=datetime.now() + timedelta(days=day_number-1, hours=activity_end_hour),
        location=activity_location,
        day_id=day.id
    )
    db.add(activity)
    
    if transfer_from and transfer_to and transfer_type:
        transfer = models.Transfer(
            from_location=transfer_from,
            to_location=transfer_to,
            transfer_type=transfer_type,
            departure_time=datetime.now() + timedelta(days=day_number-1, hours=transfer_departure_hour),
            arrival_time=datetime.now() + timedelta(days=day_number-1, hours=transfer_arrival_hour),
            day_id=day.id
        )
        db.add(transfer)
    
    db.commit()
    return day

def seed_database(db: Session):
    db.query(models.Activity).delete()
    db.query(models.Transfer).delete()
    db.query(models.Accommodation).delete()
    db.query(models.Day).delete()
    db.query(models.Itinerary).delete()
    db.commit()
    
    phuket_2night = models.Itinerary(
        title="Phuket Weekend Getaway",
        description="Experience the perfect weekend escape in Phuket! Start with the vibrant atmosphere of Patong Beach, where you'll enjoy pristine white sand and crystal-clear waters. The next day, visit the iconic Big Buddha statue, one of Phuket's most important landmarks, offering panoramic views of the island. This itinerary combines beach relaxation with cultural exploration, making it ideal for a short but fulfilling getaway.",
        total_nights=2,
        region=RegionEnum.PHUKET,
        price=299.99,
        is_recommended=True
    )
    db.add(phuket_2night)
    db.commit()
    
    create_day(
        db, phuket_2night.id, 1,
        "Patong Beach Resort", "Luxury 4-star beachfront resort featuring direct access to Patong Beach. Enjoy modern rooms with ocean views, a stunning infinity pool, full-service spa, and multiple dining options including a beachfront restaurant. The resort offers complimentary beach equipment, yoga classes, and a kids' club.",
        "Patong Beach Relaxation", "Spend your day at the famous Patong Beach, known for its soft white sand and crystal clear waters. Perfect for swimming, sunbathing, and water sports. The beach is lined with restaurants and bars, offering a perfect blend of relaxation and entertainment. Don't miss the stunning sunset views and the vibrant beach atmosphere.", "Patong Beach",
        10, 17
    )
    
    create_day(
        db, phuket_2night.id, 2,
        "Patong Beach Resort", "Luxury 4-star beachfront resort featuring direct access to Patong Beach. Enjoy modern rooms with ocean views, a stunning infinity pool, full-service spa, and multiple dining options including a beachfront restaurant. The resort offers complimentary beach equipment, yoga classes, and a kids' club.",
        "Big Buddha Temple", "Visit the iconic Big Buddha statue, one of Phuket's most important landmarks. The 45-meter tall white marble statue offers breathtaking panoramic views of the island. Explore the surrounding temple complex, learn about Buddhist culture, and enjoy the peaceful atmosphere. The site also features smaller Buddha statues and meditation areas.", "Chalong",
        9, 15,
        "Patong", "Chalong", TransferTypeEnum.TAXI, 8, 9
    )
    
    phuket_3night = models.Itinerary(
        title="Phuket Paradise 3 Nights",
        description="Discover the best of Phuket in this comprehensive 3-night itinerary. Start with a full-day adventure to the stunning Phi Phi Islands, where you'll experience pristine beaches and crystal-clear waters. Explore the historic Old Town with its Sino-Portuguese architecture and vibrant street art. Finally, visit an ethical elephant sanctuary for a meaningful wildlife encounter. This itinerary perfectly balances adventure, culture, and responsible tourism.",
        total_nights=3,
        region=RegionEnum.PHUKET,
        price=449.99,
        is_recommended=True
    )
    db.add(phuket_3night)
    db.commit()
    
    create_day(
        db, phuket_3night.id, 1,
        "Luxury Beach Resort", "5-star beachfront resort offering the ultimate in luxury and comfort. Features include private beach access, infinity pools with ocean views, a world-class spa, and multiple award-winning restaurants. Each room has a private balcony with stunning sea views, and the resort offers exclusive amenities like butler service and private dining experiences.",
        "Phi Phi Islands Tour", "Embark on a full-day adventure to the stunning Phi Phi Islands. Visit Maya Bay, made famous by 'The Beach', and snorkel in its crystal-clear waters. Explore hidden lagoons, limestone caves, and pristine beaches. Enjoy a delicious beachside lunch with stunning views. The tour includes professional guides, snorkeling equipment, and refreshments.", "Phi Phi Islands",
        9, 17
    )
    
    create_day(
        db, phuket_3night.id, 2,
        "Luxury Beach Resort", "5-star beachfront resort offering the ultimate in luxury and comfort. Features include private beach access, infinity pools with ocean views, a world-class spa, and multiple award-winning restaurants. Each room has a private balcony with stunning sea views, and the resort offers exclusive amenities like butler service and private dining experiences.",
        "Old Phuket Town", "Explore the historic heart of Phuket, known for its unique Sino-Portuguese architecture. Visit colorful shophouses, street art installations, and local markets. The Thai Hua Museum offers insights into Phuket's rich history. Don't miss the Sunday Walking Street Market for local food and souvenirs. The area is also home to beautiful temples and traditional Chinese shrines.", "Phuket Town",
        10, 16,
        "Beach", "Phuket Town", TransferTypeEnum.TAXI, 9, 10
    )
    
    create_day(
        db, phuket_3night.id, 3,
        "Luxury Beach Resort", "5-star beachfront resort offering the ultimate in luxury and comfort. Features include private beach access, infinity pools with ocean views, a world-class spa, and multiple award-winning restaurants. Each room has a private balcony with stunning sea views, and the resort offers exclusive amenities like butler service and private dining experiences.",
        "Elephant Sanctuary", "Visit an ethical elephant sanctuary dedicated to the rehabilitation and care of rescued elephants. Learn about these gentle giants through educational programs, observe their natural behaviors, and participate in feeding sessions. The sanctuary focuses on conservation and responsible tourism, providing a meaningful and unforgettable experience.", "Phang Nga",
        9, 15,
        "Beach", "Phang Nga", TransferTypeEnum.PRIVATE, 8, 9
    )
    
    phuket_4night = models.Itinerary(
        title="Phuket Explorer 4 Nights",
        description="Experience the diverse beauty of Phuket over 4 nights. Start with the peaceful Kamala Beach, known for its family-friendly atmosphere. Explore the stunning limestone karsts of Phang Nga Bay, including the famous James Bond Island. Immerse yourself in local culture at Phuket's vibrant night markets. Finally, discover the underwater world at Coral Island. This itinerary offers a perfect blend of relaxation, adventure, and cultural experiences.",
        total_nights=4,
        region=RegionEnum.PHUKET,
        price=599.99,
        is_recommended=False
    )
    db.add(phuket_4night)
    db.commit()
    
    create_day(
        db, phuket_4night.id, 1,
        "Kamala Beach Resort", "Luxury resort nestled on the peaceful Kamala Beach. Features include beachfront access, multiple swimming pools, a full-service spa, and world-class dining options. The resort offers spacious rooms with modern amenities, a kids' club, and various water sports activities. Perfect for families and couples seeking a tranquil beach experience.",
        "Kamala Beach Relaxation", "Enjoy the peaceful atmosphere of Kamala Beach, known for its calm waters and family-friendly environment. The beach offers perfect conditions for swimming, building sandcastles, and beach games. Watch local fishermen at work, and don't miss the stunning sunset views. The beach is lined with restaurants and beach bars offering fresh seafood and refreshing drinks.", "Kamala Beach",
        10, 17
    )
    
    create_day(
        db, phuket_4night.id, 2,
        "Kamala Beach Resort", "Luxury resort nestled on the peaceful Kamala Beach. Features include beachfront access, multiple swimming pools, a full-service spa, and world-class dining options. The resort offers spacious rooms with modern amenities, a kids' club, and various water sports activities. Perfect for families and couples seeking a tranquil beach experience.",
        "James Bond Island Tour", "Visit the famous limestone karsts of Phang Nga Bay, including James Bond Island (featured in 'The Man with the Golden Gun'). Explore hidden lagoons and caves by kayak, and discover the unique ecosystem of the bay. The tour includes professional guides, kayaking equipment, and a delicious lunch. Don't miss the opportunity to swim in the crystal-clear waters and take stunning photos of the iconic limestone formations.", "Phang Nga Bay",
        8, 16,
        "Kamala", "Phang Nga Bay", TransferTypeEnum.BOAT, 7, 8
    )
    
    create_day(
        db, phuket_4night.id, 3,
        "Kamala Beach Resort", "Luxury resort nestled on the peaceful Kamala Beach. Features include beachfront access, multiple swimming pools, a full-service spa, and world-class dining options. The resort offers spacious rooms with modern amenities, a kids' club, and various water sports activities. Perfect for families and couples seeking a tranquil beach experience.",
        "Phuket Night Markets", "Experience the vibrant atmosphere of Phuket's night markets. Sample authentic Thai street food, shop for local souvenirs, and watch traditional performances. The markets offer a wide variety of local dishes, fresh seafood, and tropical fruits. Don't miss the opportunity to try local specialties and interact with friendly vendors. The markets also feature live music and cultural shows.", "Phuket Town",
        17, 22,
        "Kamala", "Phuket Town", TransferTypeEnum.TAXI, 16, 17
    )
    
    create_day(
        db, phuket_4night.id, 4,
        "Kamala Beach Resort", "Luxury resort nestled on the peaceful Kamala Beach. Features include beachfront access, multiple swimming pools, a full-service spa, and world-class dining options. The resort offers spacious rooms with modern amenities, a kids' club, and various water sports activities. Perfect for families and couples seeking a tranquil beach experience.",
        "Snorkeling Adventure", "Explore the vibrant coral reefs and marine life at Coral Island. The island is known for its crystal-clear waters and diverse marine ecosystem. Snorkel among tropical fish, colorful coral formations, and other marine creatures. The tour includes professional guides, snorkeling equipment, and refreshments. Enjoy the pristine beaches and take in the stunning views of the surrounding islands.", "Coral Island",
        9, 15,
        "Kamala", "Coral Island", TransferTypeEnum.BOAT, 8, 9
    )
    
    phuket_5night = models.Itinerary(
        title="Phuket Luxury Escape 5 Nights",
        description="Indulge in the ultimate luxury experience in Phuket over 5 nights. Stay in a private pool villa at the prestigious Banyan Tree Phuket, where every detail is crafted for perfection. Enjoy exclusive experiences including private boat tours, gourmet dining, and world-class spa treatments. This itinerary combines luxury accommodation with unique experiences, creating an unforgettable escape in paradise.",
        total_nights=5,
        region=RegionEnum.PHUKET,
        price=1299.99,
        is_recommended=False
    )
    db.add(phuket_5night)
    db.commit()
    
    create_day(
        db, phuket_5night.id, 1,
        "Banyan Tree Phuket", "Ultimate luxury resort featuring private pool villas with butler service. Each villa offers complete privacy, a private pool, and stunning views. The resort includes a private beach, multiple award-winning restaurants, a world-class spa, and exclusive amenities. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Resort Relaxation", "Spend your first day enjoying the resort's world-class facilities. Relax in your private pool villa, indulge in a spa treatment, or take a dip in the resort's main pool. The resort offers various activities including yoga classes, cooking demonstrations, and water sports. Enjoy gourmet dining at one of the resort's award-winning restaurants.", "Banyan Tree Phuket",
        10, 17
    )
    
    create_day(
        db, phuket_5night.id, 2,
        "Banyan Tree Phuket", "Ultimate luxury resort featuring private pool villas with butler service. Each villa offers complete privacy, a private pool, and stunning views. The resort includes a private beach, multiple award-winning restaurants, a world-class spa, and exclusive amenities. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Spa Treatment", "Experience the ultimate in relaxation with a comprehensive spa treatment. The resort's award-winning spa offers traditional Thai massage, body scrubs, and facial treatments. Each treatment is performed in a private villa surrounded by beautiful gardens. The spa uses premium organic products and employs highly trained therapists.", "Banyan Tree Phuket",
        14, 16
    )
    
    create_day(
        db, phuket_5night.id, 3,
        "Banyan Tree Phuket", "Ultimate luxury resort featuring private pool villas with butler service. Each villa offers complete privacy, a private pool, and stunning views. The resort includes a private beach, multiple award-winning restaurants, a world-class spa, and exclusive amenities. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Phi Phi Islands Private Tour", "Embark on an exclusive private boat tour to the Phi Phi Islands. Your dedicated crew will take you to hidden beaches and secluded spots. Snorkel in pristine waters, enjoy a gourmet lunch on a private beach, and take in the stunning scenery. The tour includes premium equipment, refreshments, and personalized service.", "Phi Phi Islands",
        9, 17
    )
    
    create_day(
        db, phuket_5night.id, 4,
        "Banyan Tree Phuket", "Ultimate luxury resort featuring private pool villas with butler service. Each villa offers complete privacy, a private pool, and stunning views. The resort includes a private beach, multiple award-winning restaurants, a world-class spa, and exclusive amenities. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Cooking Class", "Learn to cook authentic Thai cuisine with the resort's executive chef. Visit a local market to select fresh ingredients, then prepare and enjoy a multi-course Thai feast. The class includes hands-on instruction, recipe cards, and a certificate of completion. Enjoy your creations with wine pairing in a beautiful setting.", "Banyan Tree Phuket",
        10, 14
    )
    
    create_day(
        db, phuket_5night.id, 5,
        "Banyan Tree Phuket", "Ultimate luxury resort featuring private pool villas with butler service. Each villa offers complete privacy, a private pool, and stunning views. The resort includes a private beach, multiple award-winning restaurants, a world-class spa, and exclusive amenities. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Sunset Cruise", "End your stay with a private yacht sunset cruise. Enjoy champagne and canapés while watching the sun set over the Andaman Sea. The yacht features comfortable seating, a professional crew, and premium amenities. Take in the stunning views of Phuket's coastline and nearby islands.", "Andaman Sea",
        17, 20
    )
    
    phuket_6night = models.Itinerary(
        title="Phuket Complete Experience 6 Nights",
        description="Experience the best of Phuket over 6 nights with this comprehensive itinerary. From beach relaxation at Nai Harn Beach to cultural exploration in Old Phuket Town, adventure activities at Phi Phi Islands, and spiritual experiences at the Big Buddha and Wat Chalong. This itinerary offers a perfect balance of relaxation, adventure, culture, and spirituality, ensuring a complete Phuket experience.",
        total_nights=6,
        region=RegionEnum.PHUKET,
        price=1499.99,
        is_recommended=False
    )
    db.add(phuket_6night)
    db.commit()
    
    create_day(
        db, phuket_6night.id, 1,
        "Nai Harn Beach Resort", "Luxury beachfront resort on the pristine Nai Harn Beach. Features include direct beach access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Nai Harn Beach Relaxation", "Spend your first day at the beautiful Nai Harn Beach, one of Phuket's most pristine beaches. Enjoy swimming in the crystal-clear waters, sunbathing on the soft white sand, and watching the stunning sunset. The beach is less crowded than other popular beaches, offering a more peaceful experience. Don't miss the opportunity to try local beach food and drinks.", "Nai Harn Beach",
        10, 17
    )
    
    create_day(
        db, phuket_6night.id, 2,
        "Nai Harn Beach Resort", "Luxury beachfront resort on the pristine Nai Harn Beach. Features include direct beach access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Phi Phi Islands Tour", "Embark on a full-day adventure to the stunning Phi Phi Islands. Visit Maya Bay, made famous by 'The Beach', and snorkel in its crystal-clear waters. Explore hidden lagoons, limestone caves, and pristine beaches. The tour includes professional guides, snorkeling equipment, and a delicious lunch. Don't miss the opportunity to take stunning photos of the iconic limestone formations.", "Phi Phi Islands",
        9, 17
    )
    
    create_day(
        db, phuket_6night.id, 3,
        "Nai Harn Beach Resort", "Luxury beachfront resort on the pristine Nai Harn Beach. Features include direct beach access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Old Phuket Town", "Explore the historic heart of Phuket, known for its unique Sino-Portuguese architecture. Visit colorful shophouses, street art installations, and local markets. The Thai Hua Museum offers insights into Phuket's rich history. Don't miss the Sunday Walking Street Market for local food and souvenirs. The area is also home to beautiful temples and traditional Chinese shrines.", "Phuket Town",
        10, 16,
        "Nai Harn", "Phuket Town", TransferTypeEnum.TAXI, 9, 10
    )
    
    create_day(
        db, phuket_6night.id, 4,
        "Nai Harn Beach Resort", "Luxury beachfront resort on the pristine Nai Harn Beach. Features include direct beach access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Elephant Sanctuary", "Visit an ethical elephant sanctuary dedicated to the rehabilitation and care of rescued elephants. Learn about these gentle giants through educational programs, observe their natural behaviors, and participate in feeding sessions. The sanctuary focuses on conservation and responsible tourism, providing a meaningful and unforgettable experience.", "Phang Nga",
        9, 15,
        "Nai Harn", "Phang Nga", TransferTypeEnum.PRIVATE, 8, 9
    )
    
    create_day(
        db, phuket_6night.id, 5,
        "Nai Harn Beach Resort", "Luxury beachfront resort on the pristine Nai Harn Beach. Features include direct beach access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Snorkeling Adventure", "Explore the vibrant coral reefs and marine life at Coral Island. The island is known for its crystal-clear waters and diverse marine ecosystem. Snorkel among tropical fish, colorful coral formations, and other marine creatures. The tour includes professional guides, snorkeling equipment, and refreshments. Enjoy the pristine beaches and take in the stunning views of the surrounding islands.", "Coral Island",
        9, 15,
        "Nai Harn", "Coral Island", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, phuket_6night.id, 6,
        "Nai Harn Beach Resort", "Luxury beachfront resort on the pristine Nai Harn Beach. Features include direct beach access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Big Buddha & Chalong Temple", "Visit two of Phuket's most important religious sites. The Big Buddha statue, standing 45 meters tall, offers breathtaking panoramic views of the island. Wat Chalong, the largest Buddhist temple in Phuket, features beautiful architecture and important religious artifacts. Learn about Buddhist culture and enjoy the peaceful atmosphere of these spiritual sites.", "Chalong",
        9, 15,
        "Nai Harn", "Chalong", TransferTypeEnum.TAXI, 8, 9
    )
    
    krabi_2night = models.Itinerary(
        title="Krabi Weekend Escape",
        description="Experience the perfect weekend in Krabi's stunning landscapes. Start with a visit to the famous Railay Beach, accessible only by boat, where you'll find pristine beaches and hidden lagoons. The next day, climb the 1,260 steps to the Tiger Cave Temple for breathtaking panoramic views of Krabi's limestone karsts. This itinerary combines beach relaxation with adventure, making it ideal for a short but fulfilling getaway.",
        total_nights=2,
        region=RegionEnum.KRABI,
        price=279.99,
        is_recommended=True
    )
    db.add(krabi_2night)
    db.commit()
    
    create_day(
        db, krabi_2night.id, 1,
        "Ao Nang Beach Resort", "Comfortable 4-star resort in the heart of Ao Nang. Features include direct beach access, a swimming pool, spa services, and multiple dining options. The resort offers modern rooms with mountain or sea views, a fitness center, and various water sports activities. Perfect for those seeking convenience and comfort in a prime location.",
        "Railay Beach Day Trip", "Visit the famous Railay Beach, accessible only by boat. This stunning peninsula is surrounded by limestone cliffs and offers pristine beaches, hidden lagoons, and caves. Enjoy swimming, sunbathing, and exploring the area's natural beauty. Don't miss the opportunity to visit the Diamond Cave with its impressive stalactites and stalagmites.", "Railay Beach",
        9, 17,
        "Ao Nang", "Railay Beach", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_2night.id, 2,
        "Ao Nang Beach Resort", "Comfortable 4-star resort in the heart of Ao Nang. Features include direct beach access, a swimming pool, spa services, and multiple dining options. The resort offers modern rooms with mountain or sea views, a fitness center, and various water sports activities. Perfect for those seeking convenience and comfort in a prime location.",
        "Tiger Cave Temple", "Climb the 1,260 steps to the Tiger Cave Temple viewpoint. The challenging climb is rewarded with breathtaking panoramic views of Krabi's limestone karsts. The temple complex features beautiful architecture, Buddhist artifacts, and meditation areas. Learn about the temple's history and enjoy the peaceful atmosphere. Don't forget to bring water and wear comfortable shoes for the climb.", "Krabi Town",
        9, 15,
        "Ao Nang", "Krabi Town", TransferTypeEnum.TAXI, 8, 9
    )
    
    krabi_3night = models.Itinerary(
        title="Krabi Adventure 3 Nights",
        description="Discover the natural beauty of Krabi over 3 nights. Start with the stunning Railay Beach, accessible only by boat, where you'll find pristine beaches and hidden lagoons. Visit the Hong Islands, known for their crystal-clear lagoons and pristine beaches. Finally, climb the Tiger Cave Temple for breathtaking panoramic views. This itinerary offers a perfect blend of beach relaxation, island exploration, and adventure.",
        total_nights=3,
        region=RegionEnum.KRABI,
        price=399.99,
        is_recommended=True
    )
    db.add(krabi_3night)
    db.commit()
    
    create_day(
        db, krabi_3night.id, 1,
        "Krabi Resort & Spa", "Luxury resort with stunning mountain views. Features include multiple swimming pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, a fitness center, and various activities. Perfect for those seeking comfort and luxury in a beautiful setting.",
        "Railay Beach Exploration", "Visit the famous Railay Beach, accessible only by boat. This stunning peninsula is surrounded by limestone cliffs and offers pristine beaches, hidden lagoons, and caves. Enjoy swimming, sunbathing, and exploring the area's natural beauty. Don't miss the opportunity to visit the Diamond Cave with its impressive stalactites and stalagmites.", "Railay Beach",
        10, 16,
        "Krabi Town", "Railay Beach", TransferTypeEnum.BOAT, 9, 10
    )
    
    create_day(
        db, krabi_3night.id, 2,
        "Krabi Resort & Spa", "Luxury resort with stunning mountain views. Features include multiple swimming pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, a fitness center, and various activities. Perfect for those seeking comfort and luxury in a beautiful setting.",
        "Hong Islands Tour", "Visit the stunning Hong Islands, known for their crystal-clear lagoons and pristine beaches. The islands offer excellent snorkeling opportunities in turquoise waters. Explore hidden caves and enjoy the peaceful atmosphere. The tour includes professional guides, snorkeling equipment, and refreshments. Don't miss the opportunity to take stunning photos of the limestone formations.", "Hong Islands",
        9, 17,
        "Krabi Town", "Hong Islands", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_3night.id, 3,
        "Krabi Resort & Spa", "Luxury resort with stunning mountain views. Features include multiple swimming pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, a fitness center, and various activities. Perfect for those seeking comfort and luxury in a beautiful setting.",
        "Tiger Cave Temple", "Climb the 1,260 steps to the Tiger Cave Temple viewpoint. The challenging climb is rewarded with breathtaking panoramic views of Krabi's limestone karsts. The temple complex features beautiful architecture, Buddhist artifacts, and meditation areas. Learn about the temple's history and enjoy the peaceful atmosphere. Don't forget to bring water and wear comfortable shoes for the climb.", "Krabi Town",
        9, 15
    )
    
    krabi_4night = models.Itinerary(
        title="Krabi Explorer 4 Nights",
        description="Experience the diverse beauty of Krabi over 4 nights. Start with the peaceful Tubkaak Beach, known for its stunning views of the limestone karsts. Visit Railay Beach and explore its caves, then discover the Hong Islands' crystal-clear lagoons. Finally, climb the Tiger Cave Temple for breathtaking panoramic views. This itinerary offers a perfect blend of relaxation, adventure, and natural beauty.",
        total_nights=4,
        region=RegionEnum.KRABI,
        price=549.99,
        is_recommended=False
    )
    db.add(krabi_4night)
    db.commit()
    
    create_day(
        db, krabi_4night.id, 1,
        "Tubkaak Beach Resort", "Luxury resort on the quiet Tubkaak Beach. Features include direct beach access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with stunning views of the limestone karsts, a fitness center, and various water sports activities. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Tubkaak Beach Relaxation", "Spend your first day at the peaceful Tubkaak Beach, known for its stunning views of the limestone karsts. Enjoy swimming in the crystal-clear waters, sunbathing on the soft white sand, and watching the stunning sunset. The beach is less crowded than other popular beaches, offering a more peaceful experience. Don't miss the opportunity to try local beach food and drinks.", "Tubkaak Beach",
        10, 17
    )
    
    create_day(
        db, krabi_4night.id, 2,
        "Tubkaak Beach Resort", "Luxury resort on the quiet Tubkaak Beach. Features include direct beach access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with stunning views of the limestone karsts, a fitness center, and various water sports activities. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Railay Beach & Caves", "Visit the famous Railay Beach and explore its caves. The Diamond Cave features impressive stalactites and stalagmites. Enjoy swimming and sunbathing on the pristine beach, surrounded by limestone cliffs. The area offers various activities including rock climbing, kayaking, and hiking. Don't miss the opportunity to take stunning photos of the natural beauty.", "Railay Beach",
        9, 17,
        "Tubkaak", "Railay Beach", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_4night.id, 3,
        "Tubkaak Beach Resort", "Luxury resort on the quiet Tubkaak Beach. Features include direct beach access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with stunning views of the limestone karsts, a fitness center, and various water sports activities. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Hong Islands Tour", "Visit the stunning Hong Islands, known for their crystal-clear lagoons and pristine beaches. The islands offer excellent snorkeling opportunities in turquoise waters. Explore hidden caves and enjoy the peaceful atmosphere. The tour includes professional guides, snorkeling equipment, and refreshments. Don't miss the opportunity to take stunning photos of the limestone formations.", "Hong Islands",
        9, 17,
        "Tubkaak", "Hong Islands", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_4night.id, 4,
        "Tubkaak Beach Resort", "Luxury resort on the quiet Tubkaak Beach. Features include direct beach access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with stunning views of the limestone karsts, a fitness center, and various water sports activities. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Tiger Cave Temple", "Climb the 1,260 steps to the Tiger Cave Temple viewpoint. The challenging climb is rewarded with breathtaking panoramic views of Krabi's limestone karsts. The temple complex features beautiful architecture, Buddhist artifacts, and meditation areas. Learn about the temple's history and enjoy the peaceful atmosphere. Don't forget to bring water and wear comfortable shoes for the climb.", "Krabi Town",
        9, 15,
        "Tubkaak", "Krabi Town", TransferTypeEnum.TAXI, 8, 9
    )
    
    krabi_5night = models.Itinerary(
        title="Krabi Luxury Escape 5 Nights",
        description="Indulge in the ultimate luxury experience in Krabi over 5 nights. Stay at the prestigious Rayavadee, surrounded by limestone cliffs and offering private beach access. Enjoy exclusive experiences including spa treatments, private island tours, and gourmet dining. This itinerary combines luxury accommodation with unique experiences, creating an unforgettable escape in paradise.",
        total_nights=5,
        region=RegionEnum.KRABI,
        price=1199.99,
        is_recommended=False
    )
    db.add(krabi_5night)
    db.commit()
    
    create_day(
        db, krabi_5night.id, 1,
        "Rayavadee", "Ultimate luxury resort surrounded by limestone cliffs. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Resort Relaxation", "Spend your first day enjoying the resort's world-class facilities. Relax on the private beach, indulge in a spa treatment, or take a dip in one of the resort's pools. The resort offers various activities including yoga classes, cooking demonstrations, and water sports. Enjoy gourmet dining at one of the resort's award-winning restaurants.", "Rayavadee",
        10, 17
    )
    
    create_day(
        db, krabi_5night.id, 2,
        "Rayavadee", "Ultimate luxury resort surrounded by limestone cliffs. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Spa Treatment", "Experience the ultimate in relaxation with a comprehensive spa treatment. The resort's award-winning spa offers traditional Thai massage, body scrubs, and facial treatments. Each treatment is performed in a private villa surrounded by beautiful gardens. The spa uses premium organic products and employs highly trained therapists.", "Rayavadee",
        14, 16
    )
    
    create_day(
        db, krabi_5night.id, 3,
        "Rayavadee", "Ultimate luxury resort surrounded by limestone cliffs. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Private Island Tour", "Embark on an exclusive private boat tour to nearby islands. Your dedicated crew will take you to hidden beaches and secluded spots. Snorkel in pristine waters, enjoy a gourmet lunch on a private beach, and take in the stunning scenery. The tour includes premium equipment, refreshments, and personalized service.", "Phi Phi Islands",
        9, 17
    )
    
    create_day(
        db, krabi_5night.id, 4,
        "Rayavadee", "Ultimate luxury resort surrounded by limestone cliffs. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Cooking Class", "Learn to cook authentic Thai cuisine with the resort's executive chef. Visit a local market to select fresh ingredients, then prepare and enjoy a multi-course Thai feast. The class includes hands-on instruction, recipe cards, and a certificate of completion. Enjoy your creations with wine pairing in a beautiful setting.", "Rayavadee",
        10, 14
    )
    
    create_day(
        db, krabi_5night.id, 5,
        "Rayavadee", "Ultimate luxury resort surrounded by limestone cliffs. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Sunset Cruise", "End your stay with a private yacht sunset cruise. Enjoy champagne and canapés while watching the sun set over the Andaman Sea. The yacht features comfortable seating, a professional crew, and premium amenities. Take in the stunning views of Krabi's coastline and nearby islands.", "Andaman Sea",
        17, 20
    )
    
    krabi_6night = models.Itinerary(
        title="Krabi Complete Experience 6 Nights",
        description="Experience the best of Krabi over 6 nights with this comprehensive itinerary. From beach relaxation at Koh Lanta to island exploration at Koh Rok and Koh Haa, adventure activities like snorkeling and kayaking, and cultural experiences at the elephant sanctuary. This itinerary offers a perfect balance of relaxation, adventure, and cultural experiences, ensuring a complete Krabi experience.",
        total_nights=6,
        region=RegionEnum.KRABI,
        price=1399.99,
        is_recommended=False
    )
    db.add(krabi_6night)
    db.commit()
    
    create_day(
        db, krabi_6night.id, 1,
        "Pimalai Resort", "Luxury resort on Koh Lanta. Features include beachfront access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Koh Lanta Beach Relaxation", "Spend your first day at the beautiful beaches of Koh Lanta. Enjoy swimming in the crystal-clear waters, sunbathing on the soft white sand, and watching the stunning sunset. The island offers a more peaceful experience compared to other popular destinations. Don't miss the opportunity to try local beach food and drinks.", "Koh Lanta",
        10, 17
    )
    
    create_day(
        db, krabi_6night.id, 2,
        "Pimalai Resort", "Luxury resort on Koh Lanta. Features include beachfront access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Koh Lanta National Park", "Visit the national park and lighthouse at the southern tip of Koh Lanta. Hike through the jungle, spot wildlife, and enjoy panoramic views of the Andaman Sea. The park is home to various species of birds and monkeys. Don't miss the opportunity to take stunning photos of the coastline and nearby islands.", "Koh Lanta",
        9, 15
    )
    
    create_day(
        db, krabi_6night.id, 3,
        "Pimalai Resort", "Luxury resort on Koh Lanta. Features include beachfront access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Snorkeling Adventure", "Explore the vibrant coral reefs and marine life at Koh Rok. The island is known for its crystal-clear waters and diverse marine ecosystem. Snorkel among tropical fish, colorful coral formations, and other marine creatures. The tour includes professional guides, snorkeling equipment, and refreshments. Enjoy the pristine beaches and take in the stunning views of the surrounding islands.", "Koh Rok",
        9, 17,
        "Koh Lanta", "Koh Rok", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_6night.id, 4,
        "Pimalai Resort", "Luxury resort on Koh Lanta. Features include beachfront access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Mangrove Kayaking", "Kayak through the mangrove forests of Koh Lanta. Spot wildlife, explore hidden channels, and learn about the importance of mangroves to the ecosystem. The area is home to various species of birds, monkeys, and other wildlife. Don't miss the opportunity to take stunning photos of the natural beauty.", "Koh Lanta",
        10, 15
    )
    
    create_day(
        db, krabi_6night.id, 5,
        "Pimalai Resort", "Luxury resort on Koh Lanta. Features include beachfront access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Island Hopping", "Visit nearby islands including Koh Haa, known for its stunning coral reefs and marine life. Snorkel in crystal-clear waters and relax on pristine beaches. The tour includes professional guides, snorkeling equipment, and refreshments. Don't miss the opportunity to take stunning photos of the limestone formations.", "Koh Haa",
        9, 17,
        "Koh Lanta", "Koh Haa", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_6night.id, 6,
        "Pimalai Resort", "Luxury resort on Koh Lanta. Features include beachfront access, multiple pools, a full-service spa, and world-class dining. The resort offers spacious rooms with modern amenities, water sports activities, and a kids' club. Perfect for those seeking a peaceful beach experience with all the comforts of a luxury resort.",
        "Elephant Sanctuary", "Visit an ethical elephant sanctuary on Koh Lanta. Learn about these gentle giants, feed them, and observe their natural behaviors in a responsible environment. The sanctuary focuses on conservation and responsible tourism, providing a meaningful and unforgettable experience.", "Koh Lanta",
        9, 15
    )
    
    krabi_7night = models.Itinerary(
        title="Krabi Extended Adventure 7 Nights",
        description="Experience the diverse beauty of Krabi over 7 nights with this comprehensive itinerary. From luxury resort relaxation at the Ritz-Carlton to island exploration at Railay Beach and Hong Islands, cultural experiences at the Tiger Cave Temple, and adventure activities at Phi Phi Islands. This itinerary offers a perfect balance of relaxation, adventure, and cultural experiences, ensuring a complete Krabi experience.",
        total_nights=7,
        region=RegionEnum.KRABI,
        price=1599.99,
        is_recommended=False
    )
    db.add(krabi_7night)
    db.commit()
    
    create_day(
        db, krabi_7night.id, 1,
        "Ritz-Carlton Krabi", "Ultimate luxury resort in Krabi. Features include beachfront access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Resort Relaxation", "Spend your first day enjoying the resort's world-class facilities. Relax on the private beach, indulge in a spa treatment, or take a dip in one of the resort's pools. The resort offers various activities including yoga classes, cooking demonstrations, and water sports. Enjoy gourmet dining at one of the resort's award-winning restaurants.", "Ritz-Carlton Krabi",
        10, 17
    )
    
    create_day(
        db, krabi_7night.id, 2,
        "Ritz-Carlton Krabi", "Ultimate luxury resort in Krabi. Features include beachfront access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Railay Beach & Caves", "Visit the famous Railay Beach and explore its caves. The Diamond Cave features impressive stalactites and stalagmites. Enjoy swimming and sunbathing on the pristine beach, surrounded by limestone cliffs. The area offers various activities including rock climbing, kayaking, and hiking. Don't miss the opportunity to take stunning photos of the natural beauty.", "Railay Beach",
        9, 17,
        "Krabi", "Railay Beach", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_7night.id, 3,
        "Ritz-Carlton Krabi", "Ultimate luxury resort in Krabi. Features include beachfront access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Hong Islands Tour", "Visit the stunning Hong Islands, known for their crystal-clear lagoons and pristine beaches. The islands offer excellent snorkeling opportunities in turquoise waters. Explore hidden caves and enjoy the peaceful atmosphere. The tour includes professional guides, snorkeling equipment, and refreshments. Don't miss the opportunity to take stunning photos of the limestone formations.", "Hong Islands",
        9, 17,
        "Krabi", "Hong Islands", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_7night.id, 4,
        "Ritz-Carlton Krabi", "Ultimate luxury resort in Krabi. Features include beachfront access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Spa Treatment", "Experience the ultimate in relaxation with a comprehensive spa treatment. The resort's award-winning spa offers traditional Thai massage, body scrubs, and facial treatments. Each treatment is performed in a private villa surrounded by beautiful gardens. The spa uses premium organic products and employs highly trained therapists.", "Ritz-Carlton Krabi",
        14, 16
    )
    
    create_day(
        db, krabi_7night.id, 5,
        "Ritz-Carlton Krabi", "Ultimate luxury resort in Krabi. Features include beachfront access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Tiger Cave Temple", "Climb the 1,260 steps to the Tiger Cave Temple viewpoint. The challenging climb is rewarded with breathtaking panoramic views of Krabi's limestone karsts. The temple complex features beautiful architecture, Buddhist artifacts, and meditation areas. Learn about the temple's history and enjoy the peaceful atmosphere. Don't forget to bring water and wear comfortable shoes for the climb.", "Krabi Town",
        9, 15,
        "Krabi", "Krabi Town", TransferTypeEnum.TAXI, 8, 9
    )
    
    create_day(
        db, krabi_7night.id, 6,
        "Ritz-Carlton Krabi", "Ultimate luxury resort in Krabi. Features include beachfront access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Phi Phi Islands Tour", "Visit the famous Phi Phi Islands. Explore Maya Bay, made famous by 'The Beach', and snorkel in its crystal-clear waters. The islands offer excellent snorkeling opportunities and stunning beaches. The tour includes professional guides, snorkeling equipment, and refreshments. Don't miss the opportunity to take stunning photos of the limestone formations.", "Phi Phi Islands",
        9, 17,
        "Krabi", "Phi Phi Islands", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_7night.id, 7,
        "Ritz-Carlton Krabi", "Ultimate luxury resort in Krabi. Features include beachfront access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious rooms and villas with modern amenities, private terraces, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Sunset Cruise", "End your stay with a private yacht sunset cruise. Enjoy champagne and canapés while watching the sun set over the Andaman Sea. The yacht features comfortable seating, a professional crew, and premium amenities. Take in the stunning views of Krabi's coastline and nearby islands.", "Andaman Sea",
        17, 20
    )
    
    krabi_8night = models.Itinerary(
        title="Krabi Ultimate Experience 8 Nights",
        description="Experience the ultimate in luxury and adventure in Krabi over 8 nights. Stay at the prestigious Six Senses Yao Noi, surrounded by limestone cliffs and offering private beach access. Enjoy exclusive experiences including spa treatments, private island tours, and gourmet dining. This itinerary combines luxury accommodation with unique experiences, creating an unforgettable escape in paradise.",
        total_nights=8,
        region=RegionEnum.KRABI,
        price=1799.99,
        is_recommended=False
    )
    db.add(krabi_8night)
    db.commit()
    
    create_day(
        db, krabi_8night.id, 1,
        "Six Senses Yao Noi", "Ultimate luxury resort on Koh Yao Noi. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious villas with private pools, modern amenities, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Resort Relaxation", "Spend your first day enjoying the resort's world-class facilities. Relax in your private pool villa, indulge in a spa treatment, or take a dip in one of the resort's pools. The resort offers various activities including yoga classes, cooking demonstrations, and water sports. Enjoy gourmet dining at one of the resort's award-winning restaurants.", "Six Senses Yao Noi",
        10, 17
    )
    
    create_day(
        db, krabi_8night.id, 2,
        "Six Senses Yao Noi", "Ultimate luxury resort on Koh Yao Noi. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious villas with private pools, modern amenities, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Island Exploration", "Explore the beautiful Koh Yao Noi, known for its pristine beaches and laid-back atmosphere. Visit local villages, learn about the island's culture, and enjoy the natural beauty. The island offers various activities including cycling, kayaking, and hiking. Don't miss the opportunity to take stunning photos of the limestone formations.", "Koh Yao Noi",
        9, 15
    )
    
    create_day(
        db, krabi_8night.id, 3,
        "Six Senses Yao Noi", "Ultimate luxury resort on Koh Yao Noi. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious villas with private pools, modern amenities, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Phi Phi Islands Tour", "Visit the famous Phi Phi Islands. Explore Maya Bay, made famous by 'The Beach', and snorkel in its crystal-clear waters. The islands offer excellent snorkeling opportunities and stunning beaches. The tour includes professional guides, snorkeling equipment, and refreshments. Don't miss the opportunity to take stunning photos of the limestone formations.", "Phi Phi Islands",
        9, 17,
        "Koh Yao Noi", "Phi Phi Islands", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_8night.id, 4,
        "Six Senses Yao Noi", "Ultimate luxury resort on Koh Yao Noi. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious villas with private pools, modern amenities, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Spa Treatment", "Experience the ultimate in relaxation with a comprehensive spa treatment. The resort's award-winning spa offers traditional Thai massage, body scrubs, and facial treatments. Each treatment is performed in a private villa surrounded by beautiful gardens. The spa uses premium organic products and employs highly trained therapists.", "Six Senses Yao Noi",
        14, 16
    )
    
    create_day(
        db, krabi_8night.id, 5,
        "Six Senses Yao Noi", "Ultimate luxury resort on Koh Yao Noi. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious villas with private pools, modern amenities, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Hong Islands Tour", "Visit the stunning Hong Islands, known for their crystal-clear lagoons and pristine beaches. The islands offer excellent snorkeling opportunities in turquoise waters. Explore hidden caves and enjoy the peaceful atmosphere. The tour includes professional guides, snorkeling equipment, and refreshments. Don't miss the opportunity to take stunning photos of the limestone formations.", "Hong Islands",
        9, 17,
        "Koh Yao Noi", "Hong Islands", TransferTypeEnum.BOAT, 8, 9
    )
    
    create_day(
        db, krabi_8night.id, 6,
        "Six Senses Yao Noi", "Ultimate luxury resort on Koh Yao Noi. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious villas with private pools, modern amenities, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Cooking Class", "Learn to cook authentic Thai cuisine with the resort's executive chef. Visit a local market to select fresh ingredients, then prepare and enjoy a multi-course Thai feast. The class includes hands-on instruction, recipe cards, and a certificate of completion. Enjoy your creations with wine pairing in a beautiful setting.", "Six Senses Yao Noi",
        10, 14
    )
    
    create_day(
        db, krabi_8night.id, 7,
        "Six Senses Yao Noi", "Ultimate luxury resort on Koh Yao Noi. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious villas with private pools, modern amenities, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Tiger Cave Temple", "Climb the 1,260 steps to the Tiger Cave Temple viewpoint. The challenging climb is rewarded with breathtaking panoramic views of Krabi's limestone karsts. The temple complex features beautiful architecture, Buddhist artifacts, and meditation areas. Learn about the temple's history and enjoy the peaceful atmosphere. Don't forget to bring water and wear comfortable shoes for the climb.", "Krabi Town",
        9, 15,
        "Koh Yao Noi", "Krabi Town", TransferTypeEnum.PRIVATE, 8, 9
    )
    
    create_day(
        db, krabi_8night.id, 8,
        "Six Senses Yao Noi", "Ultimate luxury resort on Koh Yao Noi. Features include private beach access, multiple pools, a world-class spa, and award-winning dining. The resort offers spacious villas with private pools, modern amenities, and stunning views. Experience unparalleled service and attention to detail in this prestigious setting.",
        "Sunset Cruise", "End your stay with a private yacht sunset cruise. Enjoy champagne and canapés while watching the sun set over the Andaman Sea. The yacht features comfortable seating, a professional crew, and premium amenities. Take in the stunning views of Krabi's coastline and nearby islands.", "Andaman Sea",
        17, 20
    )
    
    db.commit()