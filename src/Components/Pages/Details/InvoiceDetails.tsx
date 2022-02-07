import { useEffect, useMemo, useState } from 'react'
import { FormWrapper } from "Components/Form";
import { SubHeader } from "Components/Headers";
import { Colors, DISPLAY_DATE_FORMAT, INVOICE_DATE_FORMAT, ROOT_PAYABLE_NAME } from "consts";
import { parse, format } from "date-fns";
import {useGetCalc, useGetInvoice} from "hooks";
import { FunctionComponent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { enumStringToHumanReadable, lineItemPrice, lineItemTotal, invoiceTotal, currencyFormatter } from "../../../util";
import { Button } from 'Components';
import { PaymentModal } from 'Components/PaymentModal';
import { MultiMessageStepModal, parseSignMessage, SignMessage } from 'Components/MultiMessageStepModal';
import { InvoiceContractService } from 'Services';
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { MsgExecuteContract } from '@provenanceio/wallet-lib/lib/proto/cosmwasm/wasm/v1/tx_pb';
import {LineItemCalc, PaymentCalc} from "../../../models/InvoiceCalc";
import AddressLink from "../../AddressLink";

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

const InvoiceLineItems = styled.div``

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

    &:nth-child(odd):not(:first-child) {
        background-color: rgba(0, 0, 0, .1);
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
    const { data: invoiceCalc, isError, isLoading } = useGetCalc(uuid || '')
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [messages, setMessages] = useState<SignMessage[]>([])
    const [outstandingBalanceFetched, setOutstandingBalanceFetched] = useState(false)
    const [outstandingBalance, setOutstandingBalance] = useState(0)
    const navigate = useNavigate()

    const { walletConnectState: { address } } = useWalletConnect()

    const paymentDenom = invoiceCalc?.paymentDenom || 'USD'
    const formatter = useMemo(() => currencyFormatter(paymentDenom), [paymentDenom])

    const service = new InvoiceContractService(ROOT_PAYABLE_NAME)

    const refreshOutstandingBalance = async () => {
        if (uuid) {
            try {
                setOutstandingBalanceFetched(false)
                const payableState = await service.getPayableState(uuid)
                setOutstandingBalance(+payableState.payable_remaining_owed)
                setOutstandingBalanceFetched(true)
            } catch (e) {
                alert(`error fetching payable state ${e}`)
                navigate('/')
            }
        } else {
            setOutstandingBalanceFetched(false)
            setOutstandingBalance(0)
        }
    }

    useEffect(() => {
        refreshOutstandingBalance()
    }, [uuid])

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

        setMessages([
            parseSignMessage({ typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract', value: message }, MsgExecuteContract.deserializeBinary)
        ])
    }

    const handleCompletedPayment = () => {
        setMessages([])
        refreshOutstandingBalance()
    }

    return <>
        {messages?.length > 0 && <MultiMessageStepModal messages={messages} onComplete={handleCompletedPayment} />}
        {paymentOpen && <PaymentModal requestClose={() => setPaymentOpen(false)} invoiceUuid={uuid || ''} outstandingBalance={outstandingBalance} paymentDenom={invoiceCalc.paymentDenom} initialAmount={0} onSubmit={handlePayment} />}
        <FormWrapper title="Invoice Details" action={<Button disabled={!outstandingBalanceFetched || outstandingBalance <= 0} onClick={() => setPaymentOpen(true)}>Make Payment</Button>}>
            <InvoiceHeader>
                <div>
                    <div>
                        <b>Description:</b> {invoiceCalc.description}
                    </div>
                    <div>
                        <b>From:</b> {invoiceCalc.ownerAddress}
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
                {invoiceCalc?.lineItems?.map((lineItem: LineItemCalc, i: number) => <InvoiceLineItem key={`lineItem-${i}`}>
                    <div>
                        <b>{lineItem.name}</b>
                        <p>{lineItem.description}</p>
                    </div>
                    <div>{lineItem.quantity}</div>
                    <div>{formatter(lineItem.price)}</div>
                    <div><b>{formatter(lineItem.total)}</b></div>
                </InvoiceLineItem>)}
            </InvoiceLineItems>
            {invoiceCalc?.payments?.length > 0 && (
                <InvoiceLineItems>
                    <InvoiceLineItemHeader>
                        <div>Payments</div>
                        <div>Date</div>
                        <div>Sender</div>
                        <div>Amount</div>
                    </InvoiceLineItemHeader>
                    {invoiceCalc?.payments?.map((payment: PaymentCalc, i: number) => <InvoiceLineItem key={`payment=${i}`}>
                        <div>
                            <b>Payment UUID</b>
                            <p>{payment.uuid}</p>
                        </div>
                        <div>{timestampToDate(payment.effectiveTime)}</div>
                        <AddressLink address={payment.fromAddress} showAddressText={false} altText={'View'} />
                        <div><b>{payment.paymentAmount}{payment.paymentDenom}</b></div>
                    </InvoiceLineItem>)}
                </InvoiceLineItems>
            )}
            <InvoiceFooter>
                <b>{formatter(invoiceCalc?.originalOwed || 0)}</b>
                <b>- {formatter(invoiceCalc?.paymentSum || 0)}</b>
                <div style={{borderBottom: '2px solid grey', gridColumn: '2/4' }} />
                <div />
                <b>Amount Due ({paymentDenom}):</b>
                <div><b>{formatter(invoiceCalc?.remainingOwed || 0)}</b></div>
            </InvoiceFooter>
        </FormWrapper>
    </>
}
