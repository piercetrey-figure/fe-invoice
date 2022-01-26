import { FunctionComponent, useState } from "react";
import { useVendors } from "../../hooks/useVendors";
import Dropdown from '../Dropdown/Dropdown';

interface VendorSelectorProps {
    disabled?: boolean,
}

export const VendorSelector: FunctionComponent<VendorSelectorProps> = ({ disabled }) => {
    const { data: vendors, isLoading } = useVendors()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!vendors) {
        return <div>Error fetching vendors</div>
    }

    return <Dropdown disabled={disabled === true} name="vendor" label="Vendor" options={['Select a Vendor...', ...vendors]} />
}