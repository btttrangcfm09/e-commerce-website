const db = require('../config/database');

class User {
    static async signIn(username, password) {
        try {
            const query = 'SELECT signIn($1, $2)';
            return await db.query(query, [username, password]);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async createAccount(data) {
        try {
            const query = 'SELECT create_account($1::varchar, $2::varchar, $3::varchar, $4::varchar, $5::varchar) as user';            
            const values = [data.username, data.password, data.email, data.firstName, data.lastName];
            await db.query(query, values);
            return true;
        } catch (err) {
            console.error("Error creating account:", err.message);
            throw new Error(`Failed to create account: ${err.message}`); 
        }
    }
    
    static async updateProfile(userId, updateData) {
        const query = 'SELECT update_profile($1, $2, $3, $4, $5, $6, $7)'; 
        const values = [
            userId,
            updateData.email,
            updateData.firstName,
            updateData.lastName,
            updateData.phone,
            updateData.address,
            updateData.image,
        ];
        await db.query(query, values);
    }

    static async updatePassword(userId, oldPassword, newPassword) {
        const query = 'SELECT update_password($1, $2, $3)'; // Changed select to SELECT
        const values = [userId, oldPassword, newPassword];
        
        await db.query(query, values);
    }
    
    static async getUserDetailByID(id) {
        const result = await db.query('SELECT * FROM view_profile($1)', [id]);            
        return result[0]; 
    }

    static async getAllUser() {
       return await db.query('SELECT * FROM view_all_profiles()');
    }
}

module.exports = User;
