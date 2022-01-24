import { FunctionComponent } from "react";
import { useInvoiceList } from "../../../hooks/useInvoiceList";
import { FormWrapper } from "../../Form";
import { Button } from 'Components';
import { Invoice } from "../../../proto/invoice_protos_pb";
import styled from "styled-components";
import { TitleHeader } from "../../Headers";
import { formatter } from "../../../util";
import { Search } from "../../Search";
import { Colors } from 'consts';
import { useNavigate } from 'react-router-dom'

const invoiceTotal = (invoice: Invoice) => invoice?.getLineItemsList().reduce((acc, item) => acc + +(item?.getPrice()?.getValue() || 0) * item.getQuantity(), 0)
const calculateTotal = (invoices: Invoice[]) => invoices.reduce((acc, invoice) => acc + invoiceTotal(invoice), 0)

interface TotalDetailsProps {

}

const TotalDetails = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
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
`

const InvoiceRowWrapper = styled.div`
    display: grid;
    grid-template-columns: 2fr 2fr 1fr;
    border-top: 1px solid black;
    padding: 10px 0;
    align-items: center;
    > *:last-child {
        display: flex;
        justify-content: flex-end;
    }
    > *:not(:last-child) {
        font-size: 1.25rem;
    }
`

const InvoiceRow: FunctionComponent<InvoiceRowProps> = ({ invoice }) => <InvoiceRowWrapper>
    <TableElement>{invoice.getToAddress()}</TableElement>
    <TableElement>{invoiceTotal(invoice)}</TableElement>
    {/* <TableElement><Button color={Colors.ACTION} backgroundColor="transparent" borderColor={Colors.ACTION}>Details</Button></TableElement> */}
    <TableElement><Button secondary>Details</Button></TableElement>
</InvoiceRowWrapper>

const InvoiceHeaderWrapper = styled(InvoiceRowWrapper)`
    border-top: none;
    font-weight: bold;
`

const InvoiceHeader = () => <InvoiceHeaderWrapper>
    <TableElement>Vendor</TableElement>
    <TableElement>Amount</TableElement>
    <TableElement />
</InvoiceHeaderWrapper>

export interface ListInvoicesProps {

}


export const ListInvoices: FunctionComponent<ListInvoicesProps> = ({}) => {
    const { data: invoices, isLoading, isError, error } = useInvoiceList()
    const navigate = useNavigate()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching invoices</div>
    }

    const details = <TotalDetails>
        <TitleHeader title="Total Amount Outstanding">{invoices && formatter.format(calculateTotal(invoices))}</TitleHeader>
        <TitleHeader title="Total Invoices Outstanding">{invoices?.length || 0}</TitleHeader>
        <Search maxWidth={300} />
    </TotalDetails>

    return <FormWrapper title="Invoices" action={<Button onClick={() => navigate('/create')}>New Invoice</Button>} headerDetails={details}>
        {invoices && <InvoiceTable>
            <InvoiceHeader />
            {invoices.map((invoice, i) => <InvoiceRow key={invoice?.getInvoiceUuid()?.getValue() + `-${i}`} invoice={invoice}/>)}
        </InvoiceTable>}
    </FormWrapper>
}