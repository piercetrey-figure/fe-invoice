import { FunctionComponent, useMemo } from "react";
import { useMyBills } from "hooks/useMyBills";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { TitleHeader } from "Components/Headers";
import { currencyFormatter } from "util/currency";
import { calculateTotal, distinctInvoiceDenoms, invoiceTotal } from "util/proto";
import { FormWrapper } from "Components/Form";
import { Colors } from 'consts';
import { Invoice } from "proto/invoice_protos_pb";

const TotalDetails = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
`

const BillTable = styled.div`
    width: 100%;
    margin-top: 30px;
    color: ${Colors.DARK};
`

const BillRowWrapper = styled.div`
    display: grid;
    grid-template-columns: 2fr 2fr 2fr;
    border-top: 1px solid black;
    padding: 10px;
    align-items: center;

    color: ${Colors.TEXT};
    &:hover {
        background: rgba(0, 0, 0, .2);
    }

    > *:last-child {
        display: flex;
        justify-content: flex-end;
    }
`

const BillHeaderWrapper = styled(BillRowWrapper)`
    border-top: none;
    font-weight: bold;
    &:hover {
        background: transparent;
    }
`

const TableElement = styled.div`
    font-size: 1.2rem;
`

const BillHeader = () => <BillHeaderWrapper>
    <TableElement>Description</TableElement>
    <TableElement>Sender</TableElement>
    <TableElement>Amount</TableElement>
</BillHeaderWrapper>

interface BillRowProps {
    invoice: Invoice
}

const BillRow: FunctionComponent<BillRowProps> = ({ invoice }) => {
    const paymentDenom = invoice.getPaymentDenom()
    const formatter = useMemo(() => currencyFormatter(paymentDenom), [paymentDenom])

    return <Link to={`/${invoice.getInvoiceUuid()?.getValue()}`}>
        <BillRowWrapper>
            <TableElement>{invoice.getDescription()}</TableElement>
            <TableElement>{invoice.getFromAddress()}</TableElement>
            <TableElement><b>{formatter(invoiceTotal(invoice))}</b></TableElement>
        </BillRowWrapper>
    </Link>
}

interface InvoiceBillsProps {

}

export const InvoiceBills: FunctionComponent<InvoiceBillsProps> = ({ }) => {
    const { data: invoices, isLoading, isError } = useMyBills()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching bills!</div>
    }

    const totals = <TotalDetails>
        <TitleHeader title="Total Amount Billed">{invoices && calculateTotal(invoices)} {invoices && distinctInvoiceDenoms(invoices).join()}</TitleHeader>
        <TitleHeader title="Total Invoices Billed to You">{invoices?.length || 0}</TitleHeader>
    </TotalDetails>

    return <FormWrapper title="Bills" headerDetails={totals}>
        {invoices && <BillTable>
            <BillHeader />
            {invoices.map((invoice, i) => <BillRow key={invoice?.getInvoiceUuid()?.getValue() + `-${i}`} invoice={invoice} />)}
        </BillTable>}
    </FormWrapper>
}
