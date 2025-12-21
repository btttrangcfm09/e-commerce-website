require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'ecommerce',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    // Chỉ bật SSL khi DB_HOST không phải là container (postgres) hoặc localhost
    ssl: process.env.DB_HOST !== 'postgres' && 
         process.env.DB_HOST !== 'localhost' && 
         process.env.DB_HOST !== '127.0.0.1' ? {
        rejectUnauthorized: false
    } : false,
    max: 20, // Số connection tối đa
    idleTimeoutMillis: 30000, // Timeout cho idle connection
    connectionTimeoutMillis: 2000, // Timeout khi connect
});

// Handle pool errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
    } else {
        console.log('✅ Database connected successfully');
        release();
    }
});
        
const query = async (text, params) => {
    try {
        const result = await pool.query(text, params);
        return result.rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

module.exports = {
    query,
    pool,
};
