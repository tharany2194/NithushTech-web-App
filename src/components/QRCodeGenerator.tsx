'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
    repairId: string;
    size?: number;
}

export default function QRCodeGenerator({ repairId, size = 200 }: QRCodeGeneratorProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generateQR = async () => {
            try {
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                const trackingUrl = `${appUrl}/track/${repairId}`;

                const dataUrl = await QRCode.toDataURL(trackingUrl, {
                    width: size,
                    margin: 2,
                    color: {
                        dark: '#1e293b',
                        light: '#ffffff',
                    },
                });

                setQrCodeUrl(dataUrl);
            } catch (error) {
                console.error('Failed to generate QR code:', error);
            } finally {
                setLoading(false);
            }
        };

        if (repairId) {
            generateQR();
        }
    }, [repairId, size]);

    if (loading) {
        return (
            <div
                className="bg-gray-100 rounded-lg flex items-center justify-center animate-pulse"
                style={{ width: size, height: size }}
            >
                <span className="text-gray-400 text-sm">Loading...</span>
            </div>
        );
    }

    if (!qrCodeUrl) {
        return (
            <div
                className="bg-gray-100 rounded-lg flex items-center justify-center"
                style={{ width: size, height: size }}
            >
                <span className="text-gray-400 text-sm">No QR Code</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <img
                src={qrCodeUrl}
                alt={`QR Code for repair ${repairId}`}
                className="rounded-lg shadow-sm border border-gray-200"
                width={size}
                height={size}
            />
            <p className="text-xs text-gray-500">Scan to track repair</p>
        </div>
    );
}
