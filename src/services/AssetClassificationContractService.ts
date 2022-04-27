import { OnboardAsset, QueryAssetDefinition, QueryAssetDefinitionResponse, VerifierDetail } from "models"
import { WasmService } from "./WasmService"
import { MsgExecuteContract } from '@provenanceio/wallet-lib/lib/proto/cosmwasm/wasm/v1/tx_pb'
import { Coin } from '@provenanceio/wallet-lib/lib/proto/cosmos/base/v1beta1/coin_pb'
import { PayablesContractExecutionDetail } from "hooks"
import { ACCESS_ROUTE, ACCESS_ROUTE_NAME, PAYABLE_ASSET_TYPE } from "consts"

export class AssetClassificationContractService {
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

    async getInvoiceAssetDefinition(): Promise<QueryAssetDefinitionResponse> {
        return this.wasmService.queryWasmCustom<QueryAssetDefinition, QueryAssetDefinitionResponse>(await this.getContractAddress(), QueryAssetDefinition.fromAssetType(PAYABLE_ASSET_TYPE))
    }

    async generateClassifyAssetBase64Message(contractDetail: PayablesContractExecutionDetail, verifier: VerifierDetail, address: string): Promise<string> {
        const contractAddr = await this.getContractAddress()
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(new OnboardAsset()
                .setAssetType(PAYABLE_ASSET_TYPE)
                .setAssetUuid(contractDetail.payableUuid)
                .setVerifierAddress(verifier.address)
                .addAccessRoute(ACCESS_ROUTE, ACCESS_ROUTE_NAME)
                .toJson(), 'utf-8').toString('base64'))
            .setFundsList([new Coin().setAmount(verifier.onboarding_cost).setDenom(verifier.onboarding_denom)])
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