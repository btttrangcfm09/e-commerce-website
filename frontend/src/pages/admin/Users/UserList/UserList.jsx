import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTable } from '@/components/admin/users/UserTable';
import styles from './UserList.module.css';
import axiosInstance from '@/services/api';

const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const getPaginatedData = () => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return users.slice(startIndex, endIndex);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/admin/users/list`);
            const data = response.data?.users || response.data || [];
            setUsers(data);
            setTotal(data.length);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });

        const sortedUsers = [...users].sort((a, b) => {
            const valueA = a[key]?.toString().toLowerCase();
            const valueB = b[key]?.toString().toLowerCase();

            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setUsers(sortedUsers);
    };

    const handleSelectUser = (userId, checked) => {
        setSelectedUsers((current) => (checked ? [...current, userId] : current.filter((id) => id !== userId)));
    };

    const handleSelectAll = (checked) => {
        setSelectedUsers(checked ? users.map((user) => user.id) : []);
    };

    const handleRowClick = (user) => {
        navigate(`/admin/users/${user.id}`);
    };

    if (error) {
        return (
            <div className="flex items-center justify-center p-6">
                <div className="text-destructive">{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Users</h2>
            </div>

            <div className={styles.content}>
                <UserTable
                    users={getPaginatedData()}
                    loading={loading}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    selectedUsers={selectedUsers}
                    onSelectUser={handleSelectUser}
                    onSelectAll={handleSelectAll}
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(Number(size));
                        setPage(1);
                    }}
                    onRowClick={handleRowClick}
                />
            </div>
        </div>
    );
};

export default UserList;
