import { Invoice, LineItem } from '../proto/invoice_protos_pb';
import { UUID, Date as DateProto, Decimal } from '../proto/util_protos_pb';
import crypto from 'crypto';

export const newInvoice = () => new Invoice();
export const newLineItem = () => new LineItem();
export const newUuid = () => new UUID();
export const newRandomUuid = () => {
    const uuid = newUuid();
    const uString = '123'; // todo: random uuid
    uuid.setValue(uString);
    return uuid;
}
export const newDate = () => new DateProto();
export const newDecimal = () => new Decimal();