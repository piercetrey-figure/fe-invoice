import { Invoice, LineItem } from '../proto/invoice_protos_pb';
import { UUID, Date as DateProto, Decimal } from '../proto/util_protos_pb';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { INVOICE_DATE_FORMAT } from 'consts';

export const newInvoice = () => (new Invoice()).setInvoiceUuid(newRandomUuid());
export const newLineItem = () => (new LineItem()).setLineUuid(newRandomUuid());
export const newUuid = () => new UUID();
export const newRandomUuid = () => newUuid().setValue(uuidv4())
export const newDate = (date: Date = new Date()) => new DateProto().setValue(format(date, INVOICE_DATE_FORMAT));
export const newDecimal = (value: number | string = 0) => new Decimal().setValue(value.toString());

export const decodeB64 = (b64: string) => Buffer.from(b64, 'base64')
export const toInvoice = (b64: string) => Invoice.deserializeBinary(decodeB64(b64))

export const lineItemPrice = (lineItem: LineItem) => +(lineItem?.getPrice()?.getValue() || 0)
export const lineItemTotal = (lineItem: LineItem) => lineItemPrice(lineItem) * lineItem.getQuantity()
export const invoiceTotal = (invoice: Invoice) => invoice?.getLineItemsList().reduce((acc, item) => acc + lineItemTotal(item), 0)
export const calculateTotal = (invoices: Invoice[]) => invoices.reduce((acc, invoice) => acc + invoiceTotal(invoice), 0)
export const distinctInvoiceDenoms = (invoices: Invoice[]) => invoices.map(invoice => invoice.getPaymentDenom()).filter((value, index, self) => self.indexOf(value) === index)
