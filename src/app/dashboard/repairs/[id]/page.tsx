'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepairById, updateRepairStatus, updateRepair } from '@/store/slices/repairsSlice';
import { AppDispatch, RootState } from '@/store/store';
import StatusBadge from '@/components/StatusBadge';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { REPAIR_STATUSES, formatShortDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Save, Mail, Phone, MapPin, Edit2 } from 'lucide-react';

export default function RepairDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { currentRepair, isLoading } = useSelector((state: RootState) => state.repairs);
    const [editing, setEditing] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [formData, setFormData] = useState({
        finalCost: '',
        technicianNotes: '',
    });

    useEffect(() => {
        if (params.id) {
            dispatch(fetchRepairById(params.id as string));
        }
    }, [dispatch, params.id]);

    useEffect(() => {
        if (currentRepair) {
            setFormData({
                finalCost: currentRepair.finalCost?.toString() || '',
                technicianNotes: currentRepair.technicianNotes || '',
            });
        }
    }, [currentRepair]);

    const handleStatusChange = async (newStatus: string) => {
        if (!currentRepair) return;
        setStatusUpdating(true);
        await dispatch(updateRepairStatus({ id: currentRepair._id, status: newStatus }));
        setStatusUpdating(false);
    };

    const handleSave = async () => {
        if (!currentRepair) return;
        await dispatch(updateRepair({
            id: currentRepair._id,
            data: {
                finalCost: parseFloat(formData.finalCost) || 0,
                technicianNotes: formData.technicianNotes,
            },
        }));
        setEditing(false);
    };

    if (isLoading || !currentRepair) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/repairs"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{currentRepair.repairId}</h1>
                            <StatusBadge status={currentRepair.status} />
                        </div>
                        <p className="text-gray-500 mt-1">
                            Created on {formatShortDate(currentRepair.createdAt)}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setEditing(!editing)}
                    className="btn btn-outline inline-flex items-center gap-2"
                >
                    <Edit2 className="w-4 h-4" />
                    {editing ? 'Cancel' : 'Edit'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Device Info */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h2>
                        
                        {/* Before Repair Photo */}
                        {currentRepair.beforeRepairPhoto && (
                            <div className="mb-4 pb-4 border-b border-gray-100">
                                <p className="text-sm text-gray-500 mb-2">Before Repair Photo</p>
                                <img 
                                    src={currentRepair.beforeRepairPhoto} 
                                    alt="Device before repair" 
                                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                />
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Type</p>
                                <p className="font-medium">{currentRepair.deviceType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Brand</p>
                                <p className="font-medium">{currentRepair.deviceBrand}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Model</p>
                                <p className="font-medium">{currentRepair.deviceModel}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">IMEI/Serial</p>
                                <p className="font-medium font-mono">{currentRepair.imei || '-'}</p>
                            </div>
                            {currentRepair.assignedTechnician && (
                                <div>
                                    <p className="text-sm text-gray-500">Assigned Technician</p>
                                    <p className="font-medium">{currentRepair.assignedTechnician}</p>
                                </div>
                            )}
                            {currentRepair.expectedDeliveryDate && (
                                <div>
                                    <p className="text-sm text-gray-500">Expected Delivery</p>
                                    <p className="font-medium">{formatShortDate(currentRepair.expectedDeliveryDate)}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">Issue Description</p>
                            <p className="mt-1">{currentRepair.issue}</p>
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
                        <div className="flex flex-wrap gap-2">
                            {REPAIR_STATUSES.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    disabled={statusUpdating || currentRepair.status === status}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentRepair.status === status
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pricing & Notes */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Notes</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Estimated Cost</p>
                                <p className="font-semibold text-lg">{formatCurrency(currentRepair.estimatedCost)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Deposit Paid</p>
                                <p className="font-semibold text-lg">{formatCurrency(currentRepair.depositAmount)}</p>
                            </div>
                        </div>

                        {editing ? (
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div>
                                    <label className="label">Final Cost (€)</label>
                                    <input
                                        type="number"
                                        value={formData.finalCost}
                                        onChange={(e) => setFormData({ ...formData, finalCost: e.target.value })}
                                        className="input"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="label">Technician Notes</label>
                                    <textarea
                                        value={formData.technicianNotes}
                                        onChange={(e) => setFormData({ ...formData, technicianNotes: e.target.value })}
                                        className="input min-h-25"
                                    />
                                </div>
                                <button onClick={handleSave} className="btn btn-accent inline-flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 border-t border-gray-100">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">Final Cost</p>
                                    <p className="font-semibold text-xl text-green-600">
                                        {currentRepair.finalCost > 0 ? formatCurrency(currentRepair.finalCost) : 'Not set'}
                                    </p>
                                </div>
                                {currentRepair.technicianNotes && (
                                    <div>
                                        <p className="text-sm text-gray-500">Technician Notes</p>
                                        <p className="mt-1">{currentRepair.technicianNotes}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer</h2>
                        <div className="space-y-3">
                            <p className="font-semibold text-lg">{currentRepair.customer?.name}</p>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{currentRepair.customer?.phone}</span>
                            </div>
                            {currentRepair.customer?.email && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>{currentRepair.customer.email}</span>
                                </div>
                            )}
                        </div>

                        {currentRepair.customer?.email && (
                            <button className="btn btn-outline w-full mt-4 inline-flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" />
                                Send Notification
                            </button>
                        )}
                    </div>

                    {/* QR Code */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking QR Code</h2>
                        <div className="flex justify-center">
                            <QRCodeGenerator repairId={currentRepair.repairId} size={180} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
