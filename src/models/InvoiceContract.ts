import { ContractMsg } from "./ContractBase"

export class QueryInvoiceSettings {
    query_state: {} = {}
}

export interface QueryInvoiceSettingsResponse {
    // Name of the contract that is tagged on various things
    contract_name: string,
    // Cost to onboard each payable
    onboarding_cost: string, // todo: validate type
    // Coin type for onboarding charge
    onboarding_denom: string,
    // The address that will collect onboarding fees
    fee_collection_address: string,
    // Percentage of each transaction that is taken as fee
    fee_percent: string, // i.e. '0.5'
    // Address of the oracle application that can withdraw excess fees after fee percent is removed from onboarding_cost
    oracle_address: string,
}

export class RegisterPayable extends ContractMsg {
    register_payable: {
        payable_uuid: string,
        scope_id: string,
        payable_denom: string,
        payable_total: string,
    } = {
        payable_uuid: '',
        scope_id: '',
        payable_denom: '',
        payable_total: '',
    }

    setPayableUuid(payable_uuid: string): RegisterPayable {
        this.register_payable.payable_uuid = payable_uuid
        return this
    }

    setScopeId(scope_id: string): RegisterPayable {
        this.register_payable.scope_id = scope_id
        return this
    }

    setPayableDenom(payable_denom: string): RegisterPayable {
        this.register_payable.payable_denom = payable_denom
        return this
    }

    setPayableTotal(payable_total: string): RegisterPayable {
        this.register_payable.payable_total = payable_total
        return this
    }
}
