import { FunctionComponent, useState } from "react";
import { useVendors } from "../../hooks/useVendors";
import Dropdown from '../Dropdown/Dropdown';

interface VendorSelectorProps {
    disabled?: boolean,
    required?: boolean | string,
}

export const VendorSelector: FunctionComponent<VendorSelectorProps> = ({ disabled, required }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const { data: vendors, isLoading } = useVendors(searchTerm)

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!vendors) {
        return <div>Error fetching vendors</div>
    }

    return <Dropdown disabled={!!disabled} required={required} name="vendor" label="Vendor" options={['Select a Vendor...', ...vendors.map(v => v.name)]} />
}