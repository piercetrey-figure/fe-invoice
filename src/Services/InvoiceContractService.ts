import { WasmService } from 'Services';
import { MsgExecuteContract } from '@provenanceio/wallet-lib/lib/proto/cosmwasm/wasm/v1/tx_pb'
import { Coin } from '@provenanceio/wallet-lib/lib/proto/cosmos/base/v1beta1/coin_pb'
import { Any } from '@provenanceio/wallet-lib/lib/proto/google/protobuf/any_pb'
import { QueryInvoiceSettings, QueryInvoiceSettingsResponse, RegisterPayableMarker } from '../models';
import { FEE_DENOM } from 'consts';
import { MarkerCreationDetail } from 'hooks';

export class InvoiceContractService {
    wasmService = new WasmService()
    contractAddress: string | null = null
    rootName: string

    constructor(rootName: string) {
        this.rootName = rootName
    }

    async getContractAddress(): Promise<string> {
        if (this.contractAddress != null) {
            return this.contractAddress
        }
        this.contractAddress = await this.wasmService.lookupContractByName(this.rootName)
        return this.contractAddress
    }

    async getContractConfig(): Promise<QueryInvoiceSettingsResponse> {
        return this.wasmService.queryWasmCustom<QueryInvoiceSettings, QueryInvoiceSettingsResponse>(await this.getContractAddress(), new QueryInvoiceSettings())
    }

    async generateCreateInvoiceBase64Message(markerDetail: MarkerCreationDetail, address: string): Promise<string> {
        const [contractAddr, contractConfig] = await Promise.all([
            this.getContractAddress(),
            this.getContractConfig()
        ])
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(new RegisterPayableMarker()
                .setMarkerAddress(markerDetail.markerAddress)
                .setMarkerDenom(markerDetail.markerDenom)
                .setScopeId(markerDetail.scopeId)
                .setPayableDenom(markerDetail.invoiceDenom)
                .setPayableTotal(`${markerDetail.invoiceTotal}`)
                .toJson()
            , 'utf-8').toString('base64'))
            .setFundsList([new Coin().setAmount(contractConfig.onboarding_cost).setDenom(contractConfig.onboarding_denom)])
            .setContract(contractAddr)
            .setSender(address);
        // Directly hardcoded from https://github.com/CuCreekCo/ProvenanceWalletConnect/blob/d2227d716ddb3f95783624b50e0e70220e33a858/ProvenanceWalletConnect/Handlers/WalletConnectHandlers.swift#L408
        // const any = new Any()
        //     .setTypeUrl("/cosmwasm.wasm.v1.MsgExecuteContract")
        //     .setValue(message.serializeBinary());
        // todo: rectify this so it matches how name service works?
        return Buffer.from(message.serializeBinary()).toString("base64");
    }
}
