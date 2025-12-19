import psycopg2
from psycopg2.extras import RealDictCursor
import csv
from typing import Dict, Optional
import os
from dotenv import load_dotenv
load_dotenv()

class ProductImporter:
    def __init__(self, db_config: Dict):
        self.conn = psycopg2.connect(**db_config)
    
    def get_category_id(self, main_cat: str, sub_cat: str) -> Optional[int]:
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT c2.id 
                FROM categories c1 
                JOIN categories c2 ON c2.parent_category_id = c1.id
                WHERE c1.name = %s AND c2.name = %s
            """, (main_cat, sub_cat))
            result = cur.fetchone()
            return result[0] if result else None

    def import_products(self, csv_path: str):
        with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    category_id = self.get_category_id(row['Main Category'], row['Sub Category'])
                    if not category_id:
                        print(f"Category not found: {row['Main Category']} - {row['Sub Category']}")
                        continue

                    try:
                        cur.execute("""
                            SELECT * FROM create_product(
                                %s, %s, %s::decimal, %s::integer, %s::integer, NULL
                            )
                        """, (
                            row['Name'],
                            row['Description'],
                            float(row['Price']),
                            int(row['Stock']),
                            category_id
                        ))
                        self.conn.commit()
                        print(f"Created product: {row['Name']}")

                    except Exception as e:
                        self.conn.rollback()
                        print(f"Error creating product {row['Name']}: {str(e)}")

    def close(self):
        self.conn.close()

if __name__ == "__main__":
    db_config = {
        "dbname": os.getenv("DB_NAME"),
        "user": os.getenv("DB_USER"), 
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT")
    }

    importer = ProductImporter(db_config)
    try:
        importer.import_products('data/product_templates.csv')
    finally:
        importer.close()