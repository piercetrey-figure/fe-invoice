import { Dropdown } from "Components";
import { FunctionComponent } from "react";
import styled from "styled-components";

const Wrapper = styled.select`
    padding: 5px 10px;
`

const Item = styled.option`
    
`

export interface ToggleFilterProps {
    options: { key: string, value: string }[],
    onChange: (key: string) => void,
}

export const ToggleFilter: FunctionComponent<ToggleFilterProps> = ({ options, onChange }) => {
    return <Wrapper onChange={e => onChange(e.target.value)}>
        {options.map((opt, i) => <Item key={`item-${i}`} value={opt.key}>{opt.value}</Item>)}
    </Wrapper>
}