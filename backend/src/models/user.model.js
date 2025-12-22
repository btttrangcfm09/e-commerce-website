function toPublicUser(row) {
    if (!row) return null;

    return {
        id: row.id,
        username: row.username,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
        createdAt: row.created_at,
        isActive: row.is_active,
        phone: row.phone,
        address: row.address,
        image: row.image,
    };
}

module.exports = {
    toPublicUser,
};
