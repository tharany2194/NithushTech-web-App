import QRCode from 'qrcode';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function getTrackingUrl(repairId: string): string {
    return `${APP_URL}/track/${repairId}`;
}

export async function generateQRCode(repairId: string): Promise<string> {
    const trackingUrl = getTrackingUrl(repairId);

    try {
        const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
            width: 200,
            margin: 2,
            color: {
                dark: '#1e293b',
                light: '#ffffff',
            },
        });
        return qrDataUrl;
    } catch (error) {
        console.error('Failed to generate QR code:', error);
        throw error;
    }
}

export async function generateQRCodeBuffer(repairId: string): Promise<Buffer> {
    const trackingUrl = getTrackingUrl(repairId);

    try {
        const buffer = await QRCode.toBuffer(trackingUrl, {
            width: 200,
            margin: 2,
            color: {
                dark: '#1e293b',
                light: '#ffffff',
            },
        });
        return buffer;
    } catch (error) {
        console.error('Failed to generate QR code buffer:', error);
        throw error;
    }
}
