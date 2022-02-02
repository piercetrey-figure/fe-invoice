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

export class QueryPayableState {
    query_payable: {
        payable_uuid: string,
    } = {
        payable_uuid: ''
    }

    setPayableUuid(payable_uuid: string): QueryPayableState {
        this.query_payable.payable_uuid = payable_uuid
        return this
    }
}

export interface QueryPayableStateResponse {
    payable_uuid: string,
    // The address of the scope created during onboarding of a payable
    scope_id: string,
    // The denomination the payable accepts for payment
    payable_denom: string,
    // The amount of payable_denom that the payable was originally created to reflect
    payable_total_owed: string,
    // The amount of payable_denom left unpaid on the payable
    payable_remaining_owed: string,
    // Whether or not the oracle has reviewed the structure of the payable and determine if it is
    // a valid payable
    oracle_approved: boolean,
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
export class MakePayment extends ContractMsg {
    make_payment: {
        payable_uuid: string,
    } = {
        payable_uuid: '',
    }

    setPayableUuid(payable_uuid: string): MakePayment {
        this.make_payment.payable_uuid = payable_uuid
        return this
    }
}
