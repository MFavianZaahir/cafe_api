import { Injectable } from '@nestjs/common';
const midtransClient = require('midtrans-client');


@Injectable()
export class MidtransService {
  snap = new midtransClient.Snap({
    isProduction: false, // Change to true for production environment
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  async createTransaction(transactionDetails: any) {
    try {
      let snap = new midtransClient.Snap({
        isProduction: false, // Change to true for production environment
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
      });
      console.log(snap);

      const transaction = await snap.createTransaction(transactionDetails);
      return transaction;
    } catch (error) {
      throw new Error(`Midtrans transaction failed: ${error.message}`);
    }
  }
}
