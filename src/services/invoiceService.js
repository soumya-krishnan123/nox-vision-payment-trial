const express = require('express');
const router = express.Router();
const axios = require('axios');
const invoiceModel = require('../models/invoiceModel');



exports.createInvoice = async (req,user_id) => {
  try {
    let invoice;
    const existingInvoice=await invoiceModel.getInvoiceForUser(user_id);
    if(existingInvoice){
      invoice=await invoiceModel.updateInvoice(existingInvoice.id,req,user_id);
    }
     invoice=await invoiceModel.createInvoice(req,user_id);
    return invoice;
  } catch (error) {
    console.error('Error creating invoice:', error.response?.data || error.message);
    return { error: 'Failed to create invoice' };
  }
}


