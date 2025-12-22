from faker import Faker
from UserManager import UserManager
from CategoryManager import CategoryManager
import ProductData
import random
from dotenv import load_dotenv
import os

fake = Faker()
load_dotenv()

# 

db_config = {
    "dbname": os.getenv("DB_NAME", "ecommerce"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "postgres"),
    "host": os.getenv("DB_HOST", "127.0.0.1"),
    "port": int(os.getenv("DB_PORT", "15432")),
}

categories = {
    "Electronics": ["Phone Accessories", "Laptop Accessories", "Gaming Accessories", "Camera Gear", "Audio Equipment"],
    "Clothing": ["Men's Fashion", "Women's Fashion", "Kids' Fashion", "Athletic Wear", "Fashion Accessories"],
    "Home & Living": ["Living Room", "Kitchen & Dining", "Bedroom", "Bathroom", "Home Decor"],
    "Books": ["Fiction Books", "Non-Fiction Books", "Education Books", "Children's Books", "Manga & Comics"],
    "Sports": ["Sports Equipment", "Training Gear", "Sports Fashion", "Fitness Tools", "Sports Nutrition"]
}

user_manager = UserManager(db_config)
category_manager = CategoryManager(db_config)

try:
    for _ in range(20):
        first_name = fake.first_name()
        last_name = fake.last_name()
        username = f"{first_name.lower()}{last_name.lower()}{random.randint(1, 99)}"
        
        user = user_manager.create_user(
            username=username,
            password="admin",
            email=fake.email(),
            first_name=first_name,
            last_name=last_name,
            phone=f"0{random.randint(100000000, 999999999)}",  # Format: 0XXXXXXXXX
            address=fake.address().replace('\n', ', '),
            image=f"https://randomuser.me/api/portraits/{'men' if random.random() > 0.5 else 'women'}/{random.randint(1, 99)}.jpg"
        )
        # print(f"Created user: {user['username']} ({user['email']})")
finally:
    user_manager.close()

try:
    for main_cat, sub_cats in categories.items():
        result = category_manager.create_category(main_cat)
        print(f"Created main category: {main_cat}")
        
        if result['success']:
            parent_id = result['category_id']
            for sub_cat in sub_cats:
                sub_result = category_manager.create_category(sub_cat, parent_id)
                print(f"  Created sub-category: {sub_cat}")
finally:
    category_manager.close()

# Generate products
ProductData.generate_product_templates()