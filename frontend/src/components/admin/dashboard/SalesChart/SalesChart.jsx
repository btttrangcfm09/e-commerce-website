import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timeRanges = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' }
];

const SalesChart = ({ data, timeRange, onTimeRangeChange }) => {
    const formatCurrency = (value) => {
        // Kiểm tra an toàn để tránh lỗi NaN khi render
        if (value === null || value === undefined || isNaN(value)) return '$0';
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
                    <p className="text-sm font-medium mb-1 text-muted-foreground">
                        {formatDate(label)}
                    </p>
                    <p className="text-sm text-blue-600 mb-1">
                        Sales: {formatCurrency(Number(payload[0].value))}
                    </p>
                    <p className="text-sm text-green-600">
                        Orders: {Number(payload[1].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    // --- SỬA LỖI Ở ĐÂY ---
    // Backend trả về: total_sales, order_count
    // Frontend cần map sang: sales, orders
    const chartData = data?.map(item => ({
        ...item,
        // Ưu tiên lấy total_sales (từ DB), nếu không có thì lấy sales, nếu không thì 0
        sales: Number(item.total_sales || item.sales || 0),
        // Ưu tiên lấy order_count (từ DB), nếu không có thì lấy orders, nếu không thì 0
        orders: Number(item.order_count || item.orders || 0)
    })) || [];

    const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);
    const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
    const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <CardTitle className="text-xl font-bold">Sales Overview</CardTitle>
                <Select value={timeRange} onValueChange={onTimeRangeChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        {timeRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="date" 
                                tickFormatter={formatDate}
                                stroke="#888888"
                            />
                            <YAxis 
                                yAxisId="left"
                                tickFormatter={formatCurrency}
                                stroke="#888888"
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right"
                                stroke="#888888"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="sales"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={false}
                                name="Sales"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="orders"
                                stroke="#16a34a"
                                strokeWidth={2}
                                dot={false}
                                name="Orders"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex flex-col items-center justify-center p-2">
                        <span className="text-sm text-muted-foreground">Total Sales</span>
                        <span className="text-lg font-semibold mt-1">
                            {formatCurrency(totalSales)}
                        </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2">
                        <span className="text-sm text-muted-foreground">Total Orders</span>
                        <span className="text-lg font-semibold mt-1">
                            {totalOrders}
                        </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2">
                        <span className="text-sm text-muted-foreground">Avg. Order Value</span>
                        <span className="text-lg font-semibold mt-1">
                            {formatCurrency(avgOrderValue)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SalesChart;