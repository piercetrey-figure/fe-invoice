import { FunctionComponent, useMemo, useState } from "react";
import { useInvoiceList } from "../../../hooks/useInvoiceList";
import { FormWrapper } from "../../Form";
import { Button } from 'Components';
import { Invoice } from "../../../proto/invoice_protos_pb";
import styled from "styled-components";
import { TitleHeader } from "../../Headers";
import { calculateTotal, currencyFormatter, enumStringToHumanReadable, invoiceTotal } from "../../../util";
import { Search } from "../../Search";
import { Colors, MD, SM } from 'consts';
import { Link, useNavigate } from 'react-router-dom'
import { ListFilters, ToggleFilter } from "Components/Filters";
import { InvoiceWithCalc } from "models";

const TotalDetails = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    @media (max-width: ${MD}px) {
        flex-direction: column;
        align-items: flex-start;
    }
`

const InvoiceTable = styled.div`
    width: 100%;
    margin-top: 30px;
    color: ${Colors.DARK};
`

interface InvoiceRowProps {
    invoice: InvoiceWithCalc
}

const TableElement = styled.div`
    font-size: 1.2rem;
`

const InvoiceRowWrapper = styled.div`
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(5, 1fr);
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
        text-align: right;
    }

    @media (max-width: ${MD}px) {
        grid-template-columns: repeat(4, 1fr);

        > :nth-child(3) {
            display: none;
        }
    }

    @media (max-width: ${SM}px) {
        grid-template-columns: 1fr 1fr;

        > :nth-child(2) {
            display: flex;
            justify-content: flex-end;
            text-align: right;
        }
    }
`

const InvoiceRow: FunctionComponent<InvoiceRowProps> = ({ invoice }) => {
    const paymentDenom = invoice.invoice.paymentDenom
    const formatter = useMemo(() => currencyFormatter(paymentDenom), [paymentDenom])

    return <Link to={`/${invoice.uuid}`}>
        <InvoiceRowWrapper>
            <TableElement>{invoice.invoice.description}</TableElement>
            <TableElement>{invoice.invoice.toAddress}</TableElement>
            <TableElement><b>{formatter(invoice.totalOwed)}</b></TableElement>
            <TableElement><b>{formatter(invoice.calc.remainingOwed)}</b></TableElement>
            <TableElement>{enumStringToHumanReadable(invoice.calc.paymentStatus)}</TableElement>
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
    <TableElement>Balance</TableElement>
    <TableElement>Payment Status</TableElement>
</InvoiceHeaderWrapper>

export interface ListInvoicesProps {

}


export const ListInvoices: FunctionComponent<ListInvoicesProps> = ({}) => {
    const [from, setFrom] = useState(true)
    const { data: invoices, isLoading, isError, error } = useInvoiceList(from)
    const navigate = useNavigate()

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
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error fetching invoices</div>}
        {invoices && !isLoading && <InvoiceTable>
            <InvoiceHeader />
            {invoices.map((invoice, i) => <InvoiceRow key={invoice?.uuid + `-${i}`} invoice={invoice}/>)}
        </InvoiceTable>}
    </FormWrapper>
}