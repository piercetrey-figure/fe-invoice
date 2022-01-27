import { FormWrapper } from "Components/Form";
import { SubHeader } from "Components/Headers";
import { Colors } from "consts";
import { parse, format } from "date-fns";
import { useGetInvoice } from "hooks";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { formatter, lineItemPrice, lineItemTotal, invoiceTotal } from "../../../util";

const InvoiceHeader = styled.div`
    display: flex;
    font-size: 1.4rem;
    padding: 30px 0;
    justify-content: space-between;

    > * {
        flex-grow: 0;
        flex-basis: min-content;
        white-space: nowrap;
    }
`

const SimpleTwoColumn = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;

    > :nth-child(odd) {
        text-align: right;
    }
`

const InvoiceLineItem = styled.div`
    display: grid;
    grid-template-columns: 4fr 2fr 1fr 1fr;
    grid-gap: 10px;
    padding: 10px 20px;
    font-size: 1.3rem;

    > :nth-child(2) {
        text-align: center;
    }

    > :nth-child(3), > :nth-child(4) {
        text-align: right;
    }
`

const InvoiceLineItemHeader = styled(InvoiceLineItem)`
    background: ${Colors.DARK_BACKGROUND};
    color: ${Colors.LIGHT};
    font-weight: bold;
`

const InvoiceFooter = styled.div`
    display: grid;
    grid-gap: 10px;
    padding: 10px 20px;
    border-top: 2px solid ${Colors.DARKEN};
    grid-template-columns: 4fr 3fr 1fr;
    font-size: 1.3rem;
    text-align: right;
`

export interface InvoiceDetailsProps {

}

export const InvoiceDetails: FunctionComponent<InvoiceDetailsProps> = ({ }) => {
    const { uuid } = useParams()
    const { data: invoice, isError, isLoading } = useGetInvoice(uuid || '')

    if (!invoice || isError) {
        return <div>Error retrieving invoice</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    const dateFormat = (date?: string) => format(parse(date || '', 'yyyy-MM-dd', new Date()), 'MMMM d, yyyy')

    return <FormWrapper title="Invoice Details">
        <InvoiceHeader>
            <div>
                <div>
                    <b>Description:</b> {invoice.getDescription()}
                </div>
                <div>
                    <b>From:</b> {invoice.getFromAddress()}
                </div>
                <div>
                    <b>To:</b> {invoice.getToAddress()}
                </div>
            </div>
            <div>
                <SimpleTwoColumn>
                    <b>UUID:</b>
                    <div>{invoice.getInvoiceUuid()?.getValue()}</div>
                    <b>Created Date:</b>
                    <div>{dateFormat(invoice.getInvoiceCreatedDate()?.getValue())}</div>
                    <b>Due Date:</b>
                    <div>{dateFormat(invoice.getInvoiceDueDate()?.getValue())}</div>
                </SimpleTwoColumn>
            </div>
        </InvoiceHeader>
        <InvoiceLineItemHeader>
            <div>Items</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>Amount</div>
        </InvoiceLineItemHeader>
        {invoice.getLineItemsList().map((lineItem, i) => <InvoiceLineItem key={`lineItem-${i}`}>
            <div>
                <b>{lineItem.getName()}</b>
                <p>{lineItem.getDescription()}</p>
            </div>
            <div>{lineItem.getQuantity()}</div>
            <div>{formatter.format(lineItemPrice(lineItem))}</div>
            <div>{formatter.format(lineItemTotal(lineItem))}</div>
        </InvoiceLineItem>)}
        <InvoiceFooter>
            <div></div>
            <div>
                <b>Total:</b>
                <div>todo: payment listing</div>
            </div>
            <div>{formatter.format(invoiceTotal(invoice))}</div>
            <div style={{borderBottom: '2px solid grey', gridColumn: '2/4' }}></div>
            <div></div>
            <b>Amount Due (USD):</b>
            <div>{formatter.format(invoiceTotal(invoice))}</div>
        </InvoiceFooter>
    </FormWrapper>
}