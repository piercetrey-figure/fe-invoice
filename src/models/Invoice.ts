import { InvoiceCalc } from "./InvoiceCalc";

export interface InvoiceWithCalc {
    uuid:                string;
    invoice:             Invoice;
    status:              string;
    totalOwed:           number;
    created:             string;
    updated:             string;
    calc:                InvoiceCalc;
}

export interface Invoice {
    invoiceUuid:        UUID;
    fromAddress:        string;
    toAddress:          string;
    invoiceCreatedDate: Date;
    invoiceDueDate:     Date;
    description:        string;
    paymentDenom:       string;
    lineItems:          InvoiceLineItem[];
}

export interface UUID {
    value: string;
}

export interface Date {
    value: string;
}

export interface Price {
    value: string;
}

export interface InvoiceLineItem {
    lineUuid:    UUID;
    name:        string;
    description: string;
    quantity:    number;
    price:       Price;
}