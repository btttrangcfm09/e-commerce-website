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
        image: row.image ?? null,
    };
}

module.exports = {
    toPublicUser,
};
