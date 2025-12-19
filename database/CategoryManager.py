import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, List, Optional

class CategoryManager:
    def __init__(self, db_config: Dict):
        self.conn = psycopg2.connect(**db_config)
    
    def create_category(self, name: str, parent_id: Optional[int] = None) -> Dict:
        with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT * FROM create_category(%s, %s)",
                (name, parent_id)
            )
            result = cur.fetchone()
            self.conn.commit()
            return result
    
    def close(self):
        self.conn.close()