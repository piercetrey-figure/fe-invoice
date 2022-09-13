import { ContractMsg } from "./ContractBase"

export class QueryAssetDefinition {
    public query_asset_definition: {
        asset_type?: string
    } = {}

    setAssetType(asset_type: string): QueryAssetDefinition {
        this.query_asset_definition.asset_type = asset_type
        return this
    }
}

export interface QueryAssetDefinitionResponse {
    asset_type: string,
    verifiers: VerifierDetail[],
    enabled: boolean,
}

export interface VerifierDetail {
    address: string,
    onboarding_cost: string,
    onboarding_denom: string,
    fee_destinations: FeeDestination[],
    entity_detail?: EntityDetail,
}

export interface FeeDestination {
    address: string,
    fee_amount: number,
    entity_detail?: EntityDetail,
}

export interface EntityDetail {
    /// A short name describing the entity
    name?: string,
    /// A short description of the entity's purpose
    description?: string,
    /// A web link that can send observers to the organization that the verifier belongs to
    home_url?: string,
    // A web link that can send observers to the source code of the verifier, for increased transparency
    source_url?: string,
}

export class OnboardAsset extends ContractMsg {
    onboard_asset: {
        identifier?: AssetIdentifier,
        asset_type?: string,
        verifier_address?: string,
        access_routes?: AccessRoute[]
    } = {}

    setAssetUuid(asset_uuid: string): OnboardAsset {
        this.onboard_asset.identifier = {
            type: 'asset_uuid',
            value: asset_uuid,
        }
        return this
    }

    setScopeAddress(scope_address: string): OnboardAsset {
        this.onboard_asset.identifier = {
            type: 'scope_address',
            value: scope_address,
        }
        return this
    }
    
    setAssetType(asset_type: string): OnboardAsset {
        this.onboard_asset.asset_type = asset_type
        return this
    }

    setVerifierAddress(verifier_address: string): OnboardAsset {
        this.onboard_asset.verifier_address = verifier_address
        return this
    }

    addAccessRoute(route: string, name?: string): OnboardAsset {
        this.onboard_asset.access_routes = [
            ...(this.onboard_asset.access_routes || []),
            { route, name },
        ]
        return this
    }
}

export type AssetIdentifier = AssetUuidAssetIdentifier | ScopeAddressAssetIdentifier

export interface AssetUuidAssetIdentifier {
    type: 'asset_uuid',
    value: string,
}

export interface ScopeAddressAssetIdentifier {
    type: 'scope_address',
    value: string,
}

export interface AccessRoute {
    route: string,
    name?: string
}
