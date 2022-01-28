import { string } from "prop-types"
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

export class RegisterPayableMarker extends ContractMsg {
    register_payable_marker: {
        marker_address: string,
        marker_denom: string,
        scope_id: string,
        payable_denom: string,
        payable_total: string,
    } = {
        marker_address: '',
        marker_denom: '',
        scope_id: '',
        payable_denom: '',
        payable_total: '',
    }

    setMarkerAddress(marker_address: string): RegisterPayableMarker {
        this.register_payable_marker.marker_address = marker_address
        return this
    }

    setMarkerDenom(marker_denom: string): RegisterPayableMarker {
        this.register_payable_marker.marker_denom = marker_denom
        return this
    }

    setScopeId(scope_id: string): RegisterPayableMarker {
        this.register_payable_marker.scope_id = scope_id
        return this
    }

    setPayableDenom(payable_denom: string): RegisterPayableMarker {
        this.register_payable_marker.payable_denom = payable_denom
        return this
    }

    setPayableTotal(payable_total: string): RegisterPayableMarker {
        this.register_payable_marker.payable_total = payable_total
        return this
    }
}