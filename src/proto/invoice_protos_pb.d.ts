// package: invoice
// file: invoice_protos.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as util_protos_pb from "./util_protos_pb";

export class Invoice extends jspb.Message { 

    hasInvoiceUuid(): boolean;
    clearInvoiceUuid(): void;
    getInvoiceUuid(): util_protos_pb.UUID | undefined;
    setInvoiceUuid(value?: util_protos_pb.UUID): Invoice;
    getFromAddress(): string;
    setFromAddress(value: string): Invoice;
    getToAddress(): string;
    setToAddress(value: string): Invoice;

    hasInvoiceCreatedDate(): boolean;
    clearInvoiceCreatedDate(): void;
    getInvoiceCreatedDate(): util_protos_pb.Date | undefined;
    setInvoiceCreatedDate(value?: util_protos_pb.Date): Invoice;

    hasInvoiceDueDate(): boolean;
    clearInvoiceDueDate(): void;
    getInvoiceDueDate(): util_protos_pb.Date | undefined;
    setInvoiceDueDate(value?: util_protos_pb.Date): Invoice;
    getDescription(): string;
    setDescription(value: string): Invoice;
    getPaymentDenom(): string;
    setPaymentDenom(value: string): Invoice;
    clearLineItemsList(): void;
    getLineItemsList(): Array<LineItem>;
    setLineItemsList(value: Array<LineItem>): Invoice;
    addLineItems(value?: LineItem, index?: number): LineItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Invoice.AsObject;
    static toObject(includeInstance: boolean, msg: Invoice): Invoice.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Invoice, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Invoice;
    static deserializeBinaryFromReader(message: Invoice, reader: jspb.BinaryReader): Invoice;
}

export namespace Invoice {
    export type AsObject = {
        invoiceUuid?: util_protos_pb.UUID.AsObject,
        fromAddress: string,
        toAddress: string,
        invoiceCreatedDate?: util_protos_pb.Date.AsObject,
        invoiceDueDate?: util_protos_pb.Date.AsObject,
        description: string,
        paymentDenom: string,
        lineItemsList: Array<LineItem.AsObject>,
    }
}

export class LineItem extends jspb.Message { 

    hasLineUuid(): boolean;
    clearLineUuid(): void;
    getLineUuid(): util_protos_pb.UUID | undefined;
    setLineUuid(value?: util_protos_pb.UUID): LineItem;
    getName(): string;
    setName(value: string): LineItem;
    getDescription(): string;
    setDescription(value: string): LineItem;
    getQuantity(): number;
    setQuantity(value: number): LineItem;

    hasPrice(): boolean;
    clearPrice(): void;
    getPrice(): util_protos_pb.Decimal | undefined;
    setPrice(value?: util_protos_pb.Decimal): LineItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LineItem.AsObject;
    static toObject(includeInstance: boolean, msg: LineItem): LineItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LineItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LineItem;
    static deserializeBinaryFromReader(message: LineItem, reader: jspb.BinaryReader): LineItem;
}

export namespace LineItem {
    export type AsObject = {
        lineUuid?: util_protos_pb.UUID.AsObject,
        name: string,
        description: string,
        quantity: number,
        price?: util_protos_pb.Decimal.AsObject,
    }
}
