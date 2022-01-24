import { FunctionComponent, useState } from "react";
import { useVendors } from "../../hooks/useVendors";
import Dropdown from '../Dropdown/Dropdown';

interface VendorSelectorProps {
    disabled?: boolean,
    onChange: (vendor: string) => any,
}

export const VendorSelector: FunctionComponent<VendorSelectorProps> = ({ disabled, onChange }) => {
    const [selected, setSelected] = useState('')
    const { data: vendors, isLoading } = useVendors()

    const handleChange = (v: string) => {
        setSelected(v)
        onChange(v)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!vendors) {
        return <div>Error fetching vendors</div>
    }

    return <Dropdown disabled={disabled === true} name="vendor" label="Vendor" options={['Select a Vendor...', ...vendors]} value={selected} onChange={handleChange} />
}