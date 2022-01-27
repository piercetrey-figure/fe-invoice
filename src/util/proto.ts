import { Invoice, LineItem } from '../proto/invoice_protos_pb';
import { UUID, Date as DateProto, Decimal } from '../proto/util_protos_pb';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const PROTO_DATE_FORMAT = 'yyyy-MM-dd'

export const newInvoice = () => (new Invoice()).setInvoiceUuid(newRandomUuid());
export const newLineItem = () => (new LineItem()).setLineUuid(newRandomUuid());
export const newUuid = () => new UUID();
export const newRandomUuid = () => newUuid().setValue(uuidv4())
export const newDate = (date: Date = new Date()) => new DateProto().setValue(format(date, PROTO_DATE_FORMAT));
export const newDecimal = (value: number | string = 0) => new Decimal().setValue(value.toString());

export const toInvoice = (b64: string) => Invoice.deserializeBinary(Buffer.from(b64, 'base64'))

export const lineItemPrice = (lineItem: LineItem) => +(lineItem?.getPrice()?.getValue() || 0)
export const lineItemTotal = (lineItem: LineItem) => lineItemPrice(lineItem) * lineItem.getQuantity()
export const invoiceTotal = (invoice: Invoice) => invoice?.getLineItemsList().reduce((acc, item) => acc + lineItemTotal(item), 0)
export const calculateTotal = (invoices: Invoice[]) => invoices.reduce((acc, invoice) => acc + invoiceTotal(invoice), 0)