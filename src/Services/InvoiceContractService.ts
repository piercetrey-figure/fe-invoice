import { WasmService } from 'services';
import { MsgExecuteContract } from '@provenanceio/wallet-lib/lib/proto/cosmwasm/wasm/v1/tx_pb'
import { Coin } from '@provenanceio/wallet-lib/lib/proto/cosmos/base/v1beta1/coin_pb'
import { Any } from '@provenanceio/wallet-lib/lib/proto/google/protobuf/any_pb'
import { MakePayment, QueryInvoiceSettings, QueryInvoiceSettingsResponse, QueryPayableState, QueryPayableStateResponse, RegisterPayable } from '../models';
import { FEE_DENOM } from 'consts';
import { PayablesContractExecutionDetail } from 'hooks';

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

    async getPayableState(payableUuid: string): Promise<QueryPayableStateResponse> {
        return this.wasmService.queryWasmCustom<QueryPayableState, QueryPayableStateResponse>(await this.getContractAddress(), new QueryPayableState().setPayableUuid(payableUuid))
    }

    async generateCreateInvoiceBase64Message(contractDetail: PayablesContractExecutionDetail, address: string): Promise<string> {
        const [contractAddr, contractConfig] = await Promise.all([
            this.getContractAddress(),
            this.getContractConfig()
        ])
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(new RegisterPayable()
                .setPayableType(contractDetail.payableType)
                .setPayableUuid(contractDetail.payableUuid)
                .setScopeId(contractDetail.scopeId)
                .setPayableDenom(contractDetail.invoiceDenom)
                .setPayableTotal(`${contractDetail.invoiceTotal}`)
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

    async generateMakePaymentBase64Message(payableUuid: string, amount: number, paymentDenom: string, address: string): Promise<string> {
        const [contractAddr, contractConfig] = await Promise.all([
            this.getContractAddress(),
            this.getContractConfig()
        ])
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(new MakePayment()
                .setPayableUuid(payableUuid)
                .toJson()
            , 'utf-8').toString('base64'))
            .setFundsList([new Coin().setAmount(`${amount}`).setDenom(paymentDenom)])
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
