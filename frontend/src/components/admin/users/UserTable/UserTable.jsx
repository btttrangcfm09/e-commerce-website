import React from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import styles from './UserTable.module.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const UserTable = ({
    users,
    loading,
    sortConfig,
    onSort,
    selectedUsers,
    onSelectUser,
    onSelectAll,
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    onRowClick,
}) => {
    const totalPages = Math.ceil(total / pageSize);

    const getSortIcon = (columnKey) => {
        if (sortConfig.key === columnKey) {
            return (
                <ChevronDown
                    className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`}
                />
            );
        }
        return <ChevronDown className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100" />;
    };

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <div className={styles.tableContainer}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-14"></TableHead>
                        <TableHead className={styles.sortableHeader} onClick={() => onSort('username')}>
                            <span className="group flex items-center">
                                Username
                                {getSortIcon('username')}
                            </span>
                        </TableHead>
                        <TableHead className={styles.sortableHeader} onClick={() => onSort('email')}>
                            <span className="group flex items-center">
                                Email
                                {getSortIcon('email')}
                            </span>
                        </TableHead>
                        <TableHead className={styles.sortableHeader} onClick={() => onSort('first_name')}>
                            <span className="group flex items-center">
                                Name
                                {getSortIcon('first_name')}
                            </span>
                        </TableHead>
                        <TableHead className={styles.sortableHeader} onClick={() => onSort('role')}>
                            <span className="group flex items-center">
                                Role
                                {getSortIcon('role')}
                            </span>
                        </TableHead>

                        <TableHead className={styles.sortableHeader} onClick={() => onSort('created_at')}>
                            <span className="group flex items-center">
                                Joined
                                {getSortIcon('created_at')}
                            </span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => onRowClick(user)}
                        >
                            <TableCell>
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.image} alt={user.username} />
                                    <AvatarFallback>
                                        {user.first_name[0]}
                                        {user.last_name[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
                            </TableCell>
                            <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} entries
                    </p>
                    <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 15, 20, 25, 30, 35, 40].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size} / page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
                        Previous
                    </Button>
                    <div className="flex items-center justify-center min-w-[100px]">
                        Page {page} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
