// lib/whatsapp.ts
import makeWASocket, { useSingleFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as fs from 'fs';

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

let sock: ReturnType<typeof makeWASocket>;

export const startWhatsApp = () => {
  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // scan QR pertama kali
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('⛔ Koneksi terputus:', lastDisconnect?.error);
      if (shouldReconnect) startWhatsApp();
    } else if (connection === 'open') {
      console.log('✅ Terhubung ke WhatsApp!');
    }
  });

  sock.ev.on('creds.update', saveState);
};

// Kirim pesan WA
export const sendWaMessage = async (number: string, message: string) => {
  if (!sock) throw new Error("WhatsApp belum terhubung");
  const jid = number + '@s.whatsapp.net'; // Format nomor: 628xx
  await sock.sendMessage(jid, { text: message });
  console.log('📤 Pesan terkirim ke', number);
};
