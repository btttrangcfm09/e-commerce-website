import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import axiosInstance from '@/services/api';
import styles from './UserDetails.module.css';

const UserDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, [id]);

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get(`/admin/users/${id}`);
            setUser(response.data.user);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (!user) return null;

    return (
        <div className={styles.container}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/users')}
                className={styles.backButton}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
            </Button>

            <Card className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.avatarSection}>
                        <Avatar className={styles.avatar}>
                            <AvatarImage src={user.image} />
                            <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                        </Avatar>
                        <div className={styles.userMeta}>
                            <h1 className={styles.userName}>{`${user.first_name} ${user.last_name}`}</h1>
                            <span className={styles.userRole}>{user.role}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.field}>
                        <dt>Username</dt>
                        <dd>{user.username}</dd>
                    </div>
                    <div className={styles.field}>
                        <dt>Email</dt>
                        <dd>{user.email}</dd>
                    </div>
                    <div className={styles.field}>
                        <dt>Phone</dt>
                        <dd>{user.phone || 'Not provided'}</dd>
                    </div>
                    <div className={styles.field}>
                        <dt>Joined</dt>
                        <dd>{new Date(user.created_at).toLocaleDateString()}</dd>
                    </div>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                        <dt>Address</dt>
                        <dd>{user.address || 'Not provided'}</dd>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserDetails;