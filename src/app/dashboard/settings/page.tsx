'use client';

import { useState } from 'react';
import { User, Bell, Lock, Save } from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100">
                    {[
                        { id: 'profile', label: 'Profile', icon: User },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Lock },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="p-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Name</label>
                                    <input defaultValue="Admin" className="input" />
                                </div>
                                <div>
                                    <label className="label">Email</label>
                                    <input defaultValue="admin@nithushtech.com" className="input" />
                                </div>
                            </div>
                            <button className="btn btn-accent">
                                <Save className="w-4 h-4 mr-2" />Save
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-4">
                            {['New repairs', 'Status updates', 'Low stock'].map((item) => (
                                <div key={item} className="flex justify-between p-4 bg-gray-50 rounded-xl">
                                    <span>{item}</span>
                                    <input type="checkbox" defaultChecked />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="label">Current Password</label>
                                <input type="password" className="input" />
                            </div>
                            <div>
                                <label className="label">New Password</label>
                                <input type="password" className="input" />
                            </div>
                            <button className="btn btn-accent">Update Password</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
