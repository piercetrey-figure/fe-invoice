// package: invoice
// file: util_protos.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class UUID extends jspb.Message { 
    getValue(): string;
    setValue(value: string): UUID;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UUID.AsObject;
    static toObject(includeInstance: boolean, msg: UUID): UUID.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UUID, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UUID;
    static deserializeBinaryFromReader(message: UUID, reader: jspb.BinaryReader): UUID;
}

export namespace UUID {
    export type AsObject = {
        value: string,
    }
}

export class Decimal extends jspb.Message { 
    getValue(): string;
    setValue(value: string): Decimal;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Decimal.AsObject;
    static toObject(includeInstance: boolean, msg: Decimal): Decimal.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Decimal, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Decimal;
    static deserializeBinaryFromReader(message: Decimal, reader: jspb.BinaryReader): Decimal;
}

export namespace Decimal {
    export type AsObject = {
        value: string,
    }
}

export class Date extends jspb.Message { 
    getValue(): string;
    setValue(value: string): Date;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Date.AsObject;
    static toObject(includeInstance: boolean, msg: Date): Date.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Date, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Date;
    static deserializeBinaryFromReader(message: Date, reader: jspb.BinaryReader): Date;
}

export namespace Date {
    export type AsObject = {
        value: string,
    }
}
