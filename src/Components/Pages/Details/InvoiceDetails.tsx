import { useMemo, useState } from 'react'
import { FormWrapper } from "Components/Form";
import { Colors, DISPLAY_DATE_FORMAT, INVOICE_DATE_FORMAT, MD, ROOT_PAYABLE_NAME } from "consts";
import { parse, format } from "date-fns";
import { useGetCalc } from "hooks";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { enumStringToHumanReadable, currencyFormatter } from "../../../util";
import { Button } from 'Components';
import { PaymentModal } from 'Components/PaymentModal';
import { MultiMessageStepModal, parseSignMessage, SignMessage } from 'Components/MultiMessageStepModal';
import { InvoiceContractService } from 'services';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { MsgExecuteContract } from '@provenanceio/wallet-lib/lib/proto/cosmwasm/wasm/v1/tx_pb';
import {LineItemCalc, PaymentCalc} from "../../../models/InvoiceCalc";
import AddressLink from "../../AddressLink";
import { ShareButton } from 'Components/ShareButton';

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


    @media (max-width: ${MD}px) {
        flex-direction: column;
    }
`

const SimpleTwoColumn = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;

    > :nth-child(odd) {
        text-align: right;
    }


    @media (max-width: ${MD}px) {
        grid-template-columns: 1fr;
        > :nth-child(odd) {
            text-align: left;
        }
    }
`

const InvoiceLineItems = styled.div``

const InvoiceItemDetail = styled.div`
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

    &:nth-child(odd):not(:first-child) {
        background-color: rgba(0, 0, 0, .1);
    }


    @media (max-width: ${MD}px) {
        grid-template-columns: repeat(4, 1fr);

        > :nth-child(1) {
            grid-column: 1/4;
        }
        > :nth-child(2) {
            grid-column: 1;
        }
        > :nth-child(3) {
            grid-column: 2;
        }
        > :nth-child(4) {
            grid-column: 4;
        }
        > :nth-child(2), > :nth-child(3) {
            grid-row: 2;
            text-align: left;
        }
    }
`

const InvoiceLineItemHeader = styled(InvoiceItemDetail)`
    background: ${Colors.DARK_BACKGROUND};
    color: ${Colors.LIGHT};
    font-weight: bold;
`

const InvoicePayments = styled.div``

const InvoicePaymentHeader = styled(InvoiceItemDetail)`
    background: ${Colors.PAYMENT_BLUE};
    color: ${Colors.LIGHT};
    font-weight: bold;
`

const InvoiceFooter = styled.div`
    display: grid;
    grid-gap: 10px;
    padding: 10px 20px;
    border-top: 2px solid ${Colors.DARKEN};
    grid-template-areas: "left left left left label label label value";
    font-size: 1.3rem;
    text-align: right;

    @media (max-width: ${MD}px) {
        grid-template-areas: "label value";
        padding-left: 0;
    }
`

const ActionContainer = styled.div`
    display: flex;
    > :not(:last-child) {
        margin-right: 5px;
    }
    
    @media (max-width: ${MD}px) {
        flex-direction: column;

        > * {
            margin-top: 10px;
        }
        > :not(:last-child) {
            margin-right: 0;
        }
    }
`

export interface InvoiceDetailsProps {

}

export const InvoiceDetails: FunctionComponent<InvoiceDetailsProps> = ({ }) => {
    const { uuid } = useParams()
    const { data: invoiceCalc, isError, isLoading, refetch: refreshInvoice, } = useGetCalc(uuid || '')
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [messages, setMessages] = useState<SignMessage[][]>([])

    const { walletConnectState: { address } } = useWalletConnect()

    const paymentDenom = invoiceCalc?.paymentDenom || 'USD'
    const formatter = useMemo(() => currencyFormatter(paymentDenom), [paymentDenom])

    const service = new InvoiceContractService(ROOT_PAYABLE_NAME)

    if (!invoiceCalc || isError) {
        return <div>Error retrieving invoice</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    const dateFormat = (date?: string) => format(parse(date || '', INVOICE_DATE_FORMAT, new Date()), DISPLAY_DATE_FORMAT)

    const timestampToDate = (timestamp: string) => format(Date.parse(timestamp), DISPLAY_DATE_FORMAT)

    const handlePayment = async (amount: number) => {
        setPaymentOpen(false)

        const message = await service.generateMakePaymentBase64Message(invoiceCalc?.uuid || '', amount, paymentDenom, address)

        setMessages([[
            parseSignMessage({ typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract', value: message }, MsgExecuteContract.deserializeBinary)
        ]])
    }

    const handleCompletedPayment = () => {
        setMessages([])
        refreshInvoice()
    }

    const action = <ActionContainer>
        <ShareButton />
        <Button disabled={!invoiceCalc || invoiceCalc.paidOff || invoiceCalc.paymentStatus == 'RESTRICTED'} onClick={() => setPaymentOpen(true)}>Make Payment</Button>
    </ActionContainer>

    return <>
        {messages?.length > 0 && <MultiMessageStepModal messages={messages} onComplete={handleCompletedPayment} />}
        {paymentOpen && <PaymentModal requestClose={() => setPaymentOpen(false)} invoiceUuid={uuid || ''} outstandingBalance={invoiceCalc?.remainingOwed} paymentDenom={invoiceCalc.paymentDenom} initialAmount={0} onSubmit={handlePayment} />}
        <FormWrapper title="Invoice Details" action={action}>
            <InvoiceHeader>
                <div>
                    <div>
                        <b>Description:</b> {invoiceCalc.description}
                    </div>
                    <div>
                        <b>From:</b> <AddressLink showAddressText={false} address={invoiceCalc.ownerAddress} />
                    </div>
                    <div>
                        <b>To:</b> {invoiceCalc.payerAddress}
                    </div>
                </div>
                <div>
                    <SimpleTwoColumn>
                        <b>UUID:</b>
                        <div>{invoiceCalc.uuid}</div>
                        <b>Created Date:</b>
                        <div>{dateFormat(invoiceCalc.createdDate)}</div>
                        <b>Due Date:</b>
                        <div>{dateFormat(invoiceCalc.dueDate)}</div>
                        <b>Onboarding Status:</b>
                        <div>{enumStringToHumanReadable(invoiceCalc.invoiceStatus)}</div>
                        <b>Payment Status:</b>
                        <div>{enumStringToHumanReadable(invoiceCalc.paymentStatus)}</div>
                    </SimpleTwoColumn>
                </div>
            </InvoiceHeader>
            <InvoiceLineItems>
                <InvoiceLineItemHeader>
                    <div>Items</div>
                    <div>Quantity</div>
                    <div>Price</div>
                    <div>Amount</div>
                </InvoiceLineItemHeader>
                {invoiceCalc?.lineItems?.map((lineItem: LineItemCalc, i: number) => <InvoiceItemDetail key={`lineItem-${i}`}>
                    <div>
                        <b>{lineItem.name}</b>
                        <p>{lineItem.description}</p>
                    </div>
                    <div>{lineItem.quantity}</div>
                    <div>{formatter(lineItem.price)}</div>
                    <div><b>{formatter(lineItem.total)}</b></div>
                </InvoiceItemDetail>)}
            </InvoiceLineItems>
            {invoiceCalc?.payments?.length > 0 && (
                <InvoicePayments>
                    <InvoicePaymentHeader>
                        <div>Payments</div>
                        <div>Date</div>
                        <div>Sender</div>
                        <div>Amount</div>
                    </InvoicePaymentHeader>
                    {invoiceCalc?.payments?.map((payment: PaymentCalc, i: number) => <InvoiceItemDetail key={`payment=${i}`}>
                        <div>UUID: {payment.uuid}</div>
                        <div>{timestampToDate(payment.effectiveTime)}</div>
                        <AddressLink address={payment.fromAddress} showAddressText={false} altText={'View'} />
                        <div><b>{payment.paymentAmount}{payment.paymentDenom}</b></div>
                    </InvoiceItemDetail>)}
                </InvoicePayments>
            )}
            <InvoiceFooter>
                <b style={{gridColumn: 'label'}}>Total:</b>
                <b>{formatter(invoiceCalc?.originalOwed || 0)}</b>
                <b style={{gridColumn: 'label'}}>Payments:</b>
                <b>{invoiceCalc?.paymentSum > 0 ? "- " : ""}{formatter(invoiceCalc?.paymentSum || 0)}</b>
                <div style={{borderBottom: '2px solid grey', gridColumn: 'label / value' }} />
                <b style={{gridColumn: 'label'}}>Amount Due:</b>
                <div><b>{formatter(invoiceCalc?.remainingOwed || 0)}</b></div>
            </InvoiceFooter>
        </FormWrapper>
    </>
}
