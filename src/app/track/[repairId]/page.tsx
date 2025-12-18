import dbConnect from '@/lib/mongodb';
import Repair from '@/models/Repair';
import { Wrench, CheckCircle, Clock, AlertCircle, Truck } from 'lucide-react';

const statusIcons: Record<string, React.ReactNode> = {
    'New': <Clock className="w-6 h-6" />,
    'In Progress': <Wrench className="w-6 h-6" />,
    'Waiting Parts': <AlertCircle className="w-6 h-6" />,
    'Completed': <CheckCircle className="w-6 h-6" />,
    'Delivered': <Truck className="w-6 h-6" />,
};

const statusColors: Record<string, string> = {
    'New': 'text-blue-600 bg-blue-100',
    'In Progress': 'text-amber-600 bg-amber-100',
    'Waiting Parts': 'text-purple-600 bg-purple-100',
    'Completed': 'text-green-600 bg-green-100',
    'Delivered': 'text-gray-600 bg-gray-100',
};

export default async function TrackPage({ params }: { params: Promise<{ repairId: string }> }) {
    const { repairId } = await params;

    await dbConnect();
    const repair = await Repair.findOne({ repairId }).populate('customer', 'name').lean() as { repairId: string; status: string; deviceType: string; deviceBrand: string; deviceModel: string; customer?: { name: string } } | null;

    if (!repair) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Repair Not Found</h1>
                    <p className="text-gray-500 mt-2">The repair ID &quot;{repairId}&quot; does not exist.</p>
                </div>
            </div>
        );
    }

    const statuses = ['New', 'In Progress', 'Waiting Parts', 'Completed', 'Delivered'];
    const currentIndex = statuses.indexOf(repair.status);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Wrench className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-xl font-bold">NITHUSH TECH</h1>
                    <p className="text-gray-500 text-sm">Repair Tracking</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-500">Repair ID</p>
                        <p className="text-2xl font-bold font-mono text-blue-600">{repair.repairId}</p>
                    </div>

                    <div className={`flex items-center justify-center gap-3 p-4 rounded-xl mb-6 ${statusColors[repair.status]}`}>
                        {statusIcons[repair.status]}
                        <span className="font-semibold text-lg">{repair.status}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Device</span>
                            <span className="font-medium">{repair.deviceBrand} {repair.deviceModel}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Type</span>
                            <span>{repair.deviceType}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Customer</span>
                            <span>{repair.customer?.name}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {statuses.map((status, index) => (
                            <div key={status} className={`flex items-center gap-3 p-3 rounded-lg ${index <= currentIndex ? 'bg-green-50' : 'bg-gray-50'
                                }`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentIndex ? 'bg-green-600 text-white' : 'bg-gray-300 text-white'
                                    }`}>
                                    {index < currentIndex ? '✓' : index + 1}
                                </div>
                                <span className={index <= currentIndex ? 'font-medium' : 'text-gray-400'}>{status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-center text-gray-400 text-sm mt-6">
                    © 2024 NITHUSH TECH
                </p>
            </div>
        </div>
    );
}
