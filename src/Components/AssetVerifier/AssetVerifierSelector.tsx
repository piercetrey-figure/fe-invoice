import { useAssetVerifiers } from "hooks/useAssetVerifiers";
import { FunctionComponent, useState } from "react";
import { useVendors } from "../../hooks/useVendors";
import Dropdown from '../Dropdown/Dropdown';

interface AssetVerifierSelectorProps {
    disabled?: boolean,
    required?: boolean | string,
}

export const AssetVerifierSelector: FunctionComponent<AssetVerifierSelectorProps> = ({ disabled, required }) => {
    const { data: verifiers, isLoading } = useAssetVerifiers()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!verifiers) {
        return <div>Error fetching verifiers</div>
    }

    return <Dropdown disabled={!!disabled} required={required} name="verifier" label="Asset Verifier" options={['Select an Asset Verifier...', { key: 'undefined', value: 'undefined', display: 'No Asset Verifier' }, ...verifiers.map(v => ({ key: v.address, value: v.address, display: v.entity_detail?.name || v.entity_detail?.description || v.address}))]} />
}