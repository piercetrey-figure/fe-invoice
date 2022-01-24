// package: invoice
// file: asset_protos.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as util_protos_pb from "./util_protos_pb";
import * as google_protobuf_any_pb from "google-protobuf/google/protobuf/any_pb";
import * as google_protobuf_descriptor_pb from "google-protobuf/google/protobuf/descriptor_pb";

export class Asset extends jspb.Message { 

    hasId(): boolean;
    clearId(): void;
    getId(): util_protos_pb.UUID | undefined;
    setId(value?: util_protos_pb.UUID): Asset;
    getType(): string;
    setType(value: string): Asset;
    getDescription(): string;
    setDescription(value: string): Asset;

    getKvMap(): jspb.Map<string, google_protobuf_any_pb.Any>;
    clearKvMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Asset.AsObject;
    static toObject(includeInstance: boolean, msg: Asset): Asset.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Asset, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Asset;
    static deserializeBinaryFromReader(message: Asset, reader: jspb.BinaryReader): Asset;
}

export namespace Asset {
    export type AsObject = {
        id?: util_protos_pb.UUID.AsObject,
        type: string,
        description: string,

        kvMap: Array<[string, google_protobuf_any_pb.Any.AsObject]>,
    }
}

export const provenanceName: jspb.ExtensionFieldInfo<string>;

export const assetKvName: jspb.ExtensionFieldInfo<string>;

export enum AssetType {
    UNKNOWN_ASSET_TYPE = 0,
    LOAN = 1,
    TITLE = 2,
    FUND = 3,
    NFT = 4,
}
