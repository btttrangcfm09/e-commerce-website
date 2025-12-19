import csv
from faker import Faker
import random

fake = Faker()

def generate_product_templates():
    categories = {
        "Electronics": {
            "Phone Accessories": {
                "types": ["Cases", "Screen Protectors", "Chargers", "Power Banks", "Holders"],
                "price_range": (9.99, 79.99)
            },
            "Laptop Accessories": {
                "types": ["Bags", "Cooling Pads", "USB Hubs", "Docking Stations", "External Drives"],
                "price_range": (19.99, 199.99)
            },
            "Gaming Accessories": {
                "types": ["Controllers", "Headsets", "Mouse Pads", "Gaming Mice", "Keyboards"],
                "price_range": (29.99, 299.99)
            },
            "Camera Gear": {
                "types": ["Tripods", "Lenses", "Bags", "Filters", "Memory Cards"],
                "price_range": (14.99, 499.99)
            },
            "Audio Equipment": {
                "types": ["Headphones", "Speakers", "Microphones", "Earbuds", "Sound Cards"],
                "price_range": (24.99, 399.99)
            }
        },
        "Clothing": {
            "Men's Fashion": {
                "types": ["T-Shirts", "Jeans", "Shirts", "Jackets", "Sweaters"],
                "price_range": (19.99, 149.99)
            },
            "Women's Fashion": {
                "types": ["Dresses", "Tops", "Skirts", "Pants", "Blouses"],
                "price_range": (24.99, 179.99)
            },
            "Kids' Fashion": {
                "types": ["T-Shirts", "Pants", "Dresses", "Shoes", "Sets"],
                "price_range": (14.99, 79.99)
            },
            "Athletic Wear": {
                "types": ["Shorts", "Leggings", "Sports Bras", "Tank Tops", "Jerseys"],
                "price_range": (19.99, 89.99)
            },
            "Fashion Accessories": {
                "types": ["Bags", "Wallets", "Belts", "Scarves", "Hats"],
                "price_range": (14.99, 129.99)
            }
        },
        "Home & Living": {
            "Living Room": {
                "types": ["Sofas", "Coffee Tables", "TV Stands", "Rugs", "Lamps"],
                "price_range": (99.99, 999.99)
            },
            "Kitchen & Dining": {
                "types": ["Cookware", "Utensils", "Appliances", "Dinnerware", "Storage"],
                "price_range": (19.99, 399.99)
            },
            "Bedroom": {
                "types": ["Bedding", "Pillows", "Storage", "Lamps", "Curtains"],
                "price_range": (29.99, 299.99)
            },
            "Bathroom": {
                "types": ["Towels", "Storage", "Accessories", "Mats", "Shower Curtains"],
                "price_range": (9.99, 149.99)
            },
            "Home Decor": {
                "types": ["Wall Art", "Vases", "Candles", "Mirrors", "Cushions"],
                "price_range": (14.99, 199.99)
            }
        }
    }

    brands = {
        "Electronics": ["Samsung", "Apple", "Anker", "Logitech", "Sony", "JBL", "Belkin"],
        "Clothing": ["Nike", "Adidas", "H&M", "Zara", "Uniqlo", "Levi's", "Under Armour"],
        "Home & Living": ["IKEA", "HomeStyle", "OXO", "SimpleHome", "ArtDeco", "LivingSpace"]
    }

    with open('data/product_templates.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Main Category', 'Sub Category', 'Name', 'Description', 'Price', 'Stock'])

        for main_cat, subcats in categories.items():
            for subcat, details in subcats.items():
                for _ in range(9):
                    product_type = random.choice(details["types"])
                    brand = random.choice(brands[main_cat])
                    
                    name = f"{brand} {product_type} {fake.word().title()}"
                    
                    features = [
                        fake.word().title(),
                        f"{random.choice(['Premium', 'Deluxe', 'Basic', 'Pro'])} Quality",
                        f"{random.choice(['New', 'Bestseller', 'Limited Edition'])}"
                    ]
                    desc = f"{', '.join(features)}"
                    
                    price = round(random.uniform(details["price_range"][0], details["price_range"][1]), 2)
                    stock = random.randint(5, 100)

                    writer.writerow([main_cat, subcat, name, desc, price, stock])

if __name__ == "__main__":
    generate_product_templates()