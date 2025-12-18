import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Repair from '@/models/Repair';
import Invoice from '@/models/Invoice';
import UsedPhone from '@/models/UsedPhone';
import Stock from '@/models/Stock';

// GET dashboard stats
export async function GET() {
    try {
        await dbConnect();

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Repair stats
        const repairStats = {
            total: await Repair.countDocuments(),
            new: await Repair.countDocuments({ status: 'New' }),
            inProgress: await Repair.countDocuments({ status: 'In Progress' }),
            waitingParts: await Repair.countDocuments({ status: 'Waiting Parts' }),
            completed: await Repair.countDocuments({ status: 'Completed' }),
            delivered: await Repair.countDocuments({ status: 'Delivered' }),
            today: await Repair.countDocuments({
                createdAt: { $gte: today, $lt: tomorrow },
            }),
        };

        // Invoice stats
        const allInvoices = await Invoice.find();
        const paidInvoices = allInvoices.filter(i => i.status === 'Paid');
        const invoiceStats = {
            total: allInvoices.length,
            paid: paidInvoices.length,
            partial: allInvoices.filter(i => i.status === 'Partial').length,
            overdue: allInvoices.filter(i => i.status === 'Overdue').length,
            totalRevenue: paidInvoices.reduce((sum, i) => sum + i.totalAmount, 0),
            totalOutstanding: allInvoices.reduce(
                (sum, i) => sum + (i.totalAmount - i.paidAmount),
                0
            ),
        };

        // Used phone stats
        const allPhones = await UsedPhone.find();
        const soldPhones = allPhones.filter(p => p.status === 'Sold');
        const phoneStats = {
            total: allPhones.length,
            bought: allPhones.filter(p => p.status === 'Bought').length,
            repaired: allPhones.filter(p => p.status === 'Repaired').length,
            sold: soldPhones.length,
            totalProfit: soldPhones.reduce(
                (sum, p) => sum + (p.sellPrice - p.buyPrice - p.repairCost),
                0
            ),
            totalInvestment: allPhones
                .filter(p => p.status !== 'Sold')
                .reduce((sum, p) => sum + p.buyPrice + p.repairCost, 0),
        };

        // Stock stats
        const lowStockCount = await Stock.countDocuments({
            $expr: { $lte: ['$quantity', '$reorderLevel'] },
        });

        // Financial summary
        const totalIncome = invoiceStats.totalRevenue;
        const totalExpenses = allPhones.reduce((sum, p) => sum + p.buyPrice + p.repairCost, 0);
        const netProfit = totalIncome - totalExpenses + phoneStats.totalProfit;

        return NextResponse.json({
            repairs: repairStats,
            invoices: invoiceStats,
            phones: phoneStats,
            lowStockCount,
            financial: {
                totalIncome,
                totalExpenses,
                netProfit,
            },
        });
    } catch (error) {
        console.error('Fetch dashboard stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
