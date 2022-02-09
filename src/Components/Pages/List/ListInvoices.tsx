import { FunctionComponent, useMemo, useState } from "react";
import { useInvoiceList } from "../../../hooks/useInvoiceList";
import { FormWrapper } from "../../Form";
import { Button } from 'Components';
import { Invoice } from "../../../proto/invoice_protos_pb";
import styled from "styled-components";
import { TitleHeader } from "../../Headers";
import { calculateTotal, currencyFormatter, invoiceTotal } from "../../../util";
import { Search } from "../../Search";
import { Colors } from 'consts';
import { Link, useNavigate } from 'react-router-dom'
import { ListFilters, ToggleFilter } from "Components/Filters";

const TotalDetails = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`

const InvoiceTable = styled.div`
    width: 100%;
    margin-top: 30px;
    color: ${Colors.DARK};
`

interface InvoiceRowProps {
    invoice: Invoice
}

const TableElement = styled.div`
    font-size: 1.2rem;
`

const InvoiceRowWrapper = styled.div`
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

const InvoiceRow: FunctionComponent<InvoiceRowProps> = ({ invoice }) => {
    const paymentDenom = invoice.getPaymentDenom()
    const formatter = useMemo(() => currencyFormatter(paymentDenom), [paymentDenom])

    return <Link to={`/${invoice.getInvoiceUuid()?.getValue()}`}>
        <InvoiceRowWrapper>
            <TableElement>{invoice.getDescription()}</TableElement>
            <TableElement>{invoice.getToAddress()}</TableElement>
            <TableElement><b>{formatter(invoiceTotal(invoice))}</b></TableElement>
        </InvoiceRowWrapper>
    </Link>
}

const InvoiceHeaderWrapper = styled(InvoiceRowWrapper)`
    border-top: none;
    font-weight: bold;
    &:hover {
        background: transparent;
    }
`

const InvoiceHeader = () => <InvoiceHeaderWrapper>
    <TableElement>Description</TableElement>
    <TableElement>Vendor</TableElement>
    <TableElement>Amount</TableElement>
</InvoiceHeaderWrapper>

export interface ListInvoicesProps {

}


export const ListInvoices: FunctionComponent<ListInvoicesProps> = ({}) => {
    const [from, setFrom] = useState(true)
    const { data: invoices, isLoading, isError, error } = useInvoiceList(from)
    const navigate = useNavigate()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching invoices</div>
    }

    const details = <>
        <TotalDetails>
            {/* <TitleHeader title="Total Amount Outstanding">{invoices && calculateTotal(invoices)} (VARIOUS CURRENCIES?)</TitleHeader> */}
            <TitleHeader title="Total Invoices Outstanding">{invoices?.length || 0}</TitleHeader>
            <Search maxWidth={300} />
        </TotalDetails>
        <ListFilters>
            <ToggleFilter options={[{ key: 'from', value: 'Sent' }, { key: 'to', value: 'Received' }]} onChange={key => setFrom(key === 'from')} />
        </ListFilters>
    </>

    return <FormWrapper title="Invoices" action={<Button onClick={() => navigate('/create')}>New Invoice</Button>} headerDetails={details}>
        {invoices && <InvoiceTable>
            <InvoiceHeader />
            {invoices.map((invoice, i) => <InvoiceRow key={invoice?.getInvoiceUuid()?.getValue() + `-${i}`} invoice={invoice}/>)}
        </InvoiceTable>}
    </FormWrapper>
}