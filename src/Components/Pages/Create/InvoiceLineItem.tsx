import { FunctionComponent } from "react"
import styled from "styled-components"
import { Colors } from 'consts';
import { DARK } from '../../../consts/colors';
import { LineItem } from "../../../proto/invoice_protos_pb";
import { Input } from 'Components';
import { FormRow } from "../../Form";
import { newDecimal } from "../../../util";

const Wrapper = styled.div`
    padding: 0 20px 10px 20px;
    border: 1px solid ${Colors.DARK};
    border-radius: 4px;
    margin-bottom: 10px;
`

export interface InvoiceLineItemProps {
    index: number,
    disabled?: boolean,
}

export const InvoiceLineItem: FunctionComponent<InvoiceLineItemProps> = ({ index, disabled }) => {
    return <Wrapper>
        <Input disabled={disabled} required="please enter a name" label="Name" name={`line_item.${index}.name`} />
        <Input disabled={disabled} required="please enter a description" label="Description" name={`line_item.${index}.description`} />
        <FormRow columns={2}>
            <Input disabled={disabled} required="please enter a quantity" type="number" label="Quantity" name={`line_item.${index}.quantity`} />
            <Input disabled={disabled} required="please enter a price" type="number" label="Price" name={`line_item.${index}.price`} />
        </FormRow>
    </Wrapper>
}