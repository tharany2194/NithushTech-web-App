import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

// Email template IDs
const TEMPLATES = {
    REPAIR_WELCOME: 'repair_welcome',
    STATUS_UPDATE: 'status_update',
    PAYMENT_REMINDER: 'payment_reminder',
    INVOICE: 'invoice_notification',
};

interface EmailParams {
    to_email: string;
    to_name: string;
    [key: string]: string;
}

export async function sendEmail(templateId: string, params: EmailParams): Promise<boolean> {
    if (!SERVICE_ID || !PUBLIC_KEY) {
        console.warn('EmailJS not configured. Skipping email send.');
        return false;
    }

    try {
        await emailjs.send(SERVICE_ID, templateId, params, PUBLIC_KEY);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}

export async function sendRepairWelcomeEmail(params: {
    customerName: string;
    customerEmail: string;
    repairId: string;
    deviceType: string;
    deviceModel: string;
    issue: string;
    trackingUrl: string;
}): Promise<boolean> {
    return sendEmail(TEMPLATES.REPAIR_WELCOME, {
        to_email: params.customerEmail,
        to_name: params.customerName,
        repair_id: params.repairId,
        device_type: params.deviceType,
        device_model: params.deviceModel,
        issue: params.issue,
        tracking_url: params.trackingUrl,
    });
}

export async function sendStatusUpdateEmail(params: {
    customerName: string;
    customerEmail: string;
    repairId: string;
    deviceModel: string;
    oldStatus: string;
    newStatus: string;
    trackingUrl: string;
}): Promise<boolean> {
    return sendEmail(TEMPLATES.STATUS_UPDATE, {
        to_email: params.customerEmail,
        to_name: params.customerName,
        repair_id: params.repairId,
        device_model: params.deviceModel,
        old_status: params.oldStatus,
        new_status: params.newStatus,
        tracking_url: params.trackingUrl,
    });
}

export async function sendPaymentReminderEmail(params: {
    customerName: string;
    customerEmail: string;
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    dueDate: string;
}): Promise<boolean> {
    const outstanding = (params.totalAmount - params.paidAmount).toFixed(2);
    return sendEmail(TEMPLATES.PAYMENT_REMINDER, {
        to_email: params.customerEmail,
        to_name: params.customerName,
        invoice_number: params.invoiceNumber,
        total_amount: params.totalAmount.toFixed(2),
        paid_amount: params.paidAmount.toFixed(2),
        outstanding_amount: outstanding,
        due_date: params.dueDate,
    });
}

export { TEMPLATES };
