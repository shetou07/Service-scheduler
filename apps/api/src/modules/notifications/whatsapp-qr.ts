export type WhatsAppQrStatus =
  | 'DISABLED'
  | 'INITIALIZING'
  | 'WAITING_FOR_QR'
  | 'READY'
  | 'DISCONNECTED'
  | 'ERROR';

type WhatsAppQrState = {
  status: WhatsAppQrStatus;
  qrDataUrl?: string;
  message?: string;
  updatedAt: string;
};

let current: WhatsAppQrState = {
  status: 'INITIALIZING',
  updatedAt: new Date().toISOString(),
};

function update(next: Omit<WhatsAppQrState, 'updatedAt'>) {
  current = { ...next, updatedAt: new Date().toISOString() };
}

export function setWhatsAppQrDisabled() {
  update({ status: 'DISABLED' });
}

export function setWhatsAppQrInitializing() {
  update({ status: 'INITIALIZING' });
}

export function setWhatsAppQr(dataUrl: string) {
  update({ status: 'WAITING_FOR_QR', qrDataUrl: dataUrl });
}

export function setWhatsAppQrReady() {
  update({ status: 'READY' });
}

export function setWhatsAppQrDisconnected(message: string) {
  update({ status: 'DISCONNECTED', message });
}

export function setWhatsAppQrError(message: string) {
  update({ status: 'ERROR', message });
}

export function whatsappQrStatus() {
  return current;
}
