// AdminLayout.jsx
import React from 'react';
import { AdminHeader } from '../AdminHeader';
import { AdminSidebar } from '../AdminSidebar';
import styles from './AdminLayout.module.css';
import { ShadcnProvider } from '@/components/ui/ShadcnProvider'

const AdminLayout = ({ children }) => {
    return (
        <ShadcnProvider>
            <div className={styles.layout}>
                <AdminSidebar />
                <div className={styles.mainContent}>
                    <AdminHeader />
                    <main className={styles.contentArea}>{children}</main>
                </div>
            </div>
        </ShadcnProvider>
    );
};

export default AdminLayout;
