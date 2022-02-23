import { FunctionComponent, useEffect, useState } from "react";
import { FormActions, FormRow, FormWrapper } from "../../Form";
import { SubHeader } from 'Components/Headers';
import { Input } from 'Components';
import { VendorSelector } from "../../Vendor/VendorSelector";
import Dropdown from "../../Dropdown/Dropdown";
import { Button } from 'Components';
import { useNavigate } from 'react-router-dom';
import { Invoice, LineItem } from "../../../proto/invoice_protos_pb";
import { Date as DateProto } from "../../../proto/util_protos_pb";
import { addDays, format, parse } from 'date-fns'
import { newDate, newInvoice, newLineItem, newRandomUuid, newDecimal, decodeB64 } from "../../../util";
import { ErrorBar } from "../../Error/ErrorBar";
import { SubmittingOverlay } from "../../Submitting/SubmittingOverlay";
import { CreateInvoiceResponse, useCreateInvoice } from "../../../hooks/useCreateInvoice";
import { InvoiceLineItem } from "./InvoiceLineItem";
import styled from "styled-components";
import { useForm, FormProvider, useFormState } from 'react-hook-form'
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { MultiMessageStepModal, parseSignMessage, SignMessage } from "Components/MultiMessageStepModal";
import { MsgWriteScopeRequest, MsgWriteSessionRequest, MsgWriteRecordRequest } from '@provenanceio/wallet-lib/lib/proto/provenance/metadata/v1/tx_pb'
import { MsgExecuteContract } from '@provenanceio/wallet-lib/lib/proto/cosmwasm/wasm/v1/tx_pb';
import { InvoiceContractService } from "services";
import { INVOICE_DATE_FORMAT, ROOT_PAYABLE_NAME } from "consts";
import { useGetDenoms } from "hooks";

interface TermsSelectorProps {
    value?: string,
    disabled?: boolean,
    required?: boolean | string,
}

const TermsSelector: FunctionComponent<TermsSelectorProps> = ({ value, disabled, required, }) => {
    const [selected, setSelected] = useState(value || '90 Days')
    const options = ['90 Days', '180 Days']

    return <Dropdown disabled={disabled} required={required} name="terms" label="Terms" options={['Select Terms...', ...options]} />
}

const LineItemWrapper = styled.div`
    margin-bottom: 20px;
`
interface CreateInvoiceProps {
    
}

export const CreateInvoice: FunctionComponent<CreateInvoiceProps> = ({ }) => {
    const { onCreate } = useCreateInvoice()
    const { data: denoms } = useGetDenoms()

    const navigate = useNavigate()

    const [reviewing, setReviewing] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [signing, setSigning] = useState(false)
    const [messages, setMessages] = useState<SignMessage[][]>([])
    const [handleComplete, setHandleComplete] = useState(() => () => navigate('/'))
    const [error, setError] = useState('')

    const { walletConnectState: { address } } = useWalletConnect()

    const defaultLineItems: { name: string, description: string, quantity: number, price: number }[] = []
    const formMethods = useForm({
        reValidateMode: 'onBlur',
        defaultValues: {
            invoice_date: format(new Date(), INVOICE_DATE_FORMAT),
            // todo: remove below, for testing only
            description: 'the best description',
            line_item: defaultLineItems,
            paymentDenom: 'nhash'
        }
    })

    // todo: remove, for testing
    const newDummyLineItem = (i: number) => newLineItem()
        .setName(`line item ${i}`)
        .setDescription(`line item ${i} description`)
        .setQuantity(i)
        .setPrice(newDecimal(+`${i}${i}`))

    const { handleSubmit } = formMethods

    const [lineItems, setLineItems] = useState<LineItem[]>([])
    const addLineItem = () => {
        // setLineItems([...lineItems, newLineItem()])
        const dummyItem = newDummyLineItem(lineItems.length + 1)
        formMethods.setValue(`line_item`, [...formMethods.getValues().line_item, {
            name: dummyItem.getName(),
            description: dummyItem.getDescription(),
            quantity: dummyItem.getQuantity(),
            price: +(dummyItem.getPrice()?.getValue() || 0)
        }])
        setLineItems([...lineItems, dummyItem])
    }
    useEffect(() => {
        addLineItem()
    }, [])

    const createInvoice = async (data: any) => {
        setSubmitting(true)
        setError('')
        
        try {
            const invoice = newInvoice()
            const startDate = parse(data.invoice_date, INVOICE_DATE_FORMAT, new Date())
            const dueDate = addDays(startDate, parseInt(data.terms))
            invoice.setToAddress(data.vendor)
                .setFromAddress(address)
                .setInvoiceCreatedDate(newDate(startDate))
                .setInvoiceDueDate(newDate(dueDate))
                .setDescription(data.description)
                .setPaymentDenom(data.paymentDenom)
                .setLineItemsList(data.line_item.map((lineItem: any) => newLineItem()
                    .setName(lineItem.name)
                    .setDescription(lineItem.description)
                    .setQuantity(lineItem.quantity)
                    .setPrice(newDecimal(lineItem.price))
                ))
                
            const createResult = await onCreate(invoice)

            const invoiceContractService = new InvoiceContractService(ROOT_PAYABLE_NAME)

            setMessages([[
                parseSignMessage(createResult.scopeGenerationDetail.writeScopeRequest, MsgWriteScopeRequest.deserializeBinary),
                parseSignMessage(createResult.scopeGenerationDetail.writeSessionRequest, MsgWriteSessionRequest.deserializeBinary),
                parseSignMessage(createResult.scopeGenerationDetail.writeRecordRequest, MsgWriteRecordRequest.deserializeBinary),
            ], [
                // TODO: add this back into the other bulk transaction once attributes can be added to scopes that are created in the same transaction group
                parseSignMessage({typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract', value: await invoiceContractService.generateCreateInvoiceBase64Message(createResult.payablesContractExecutionDetail, address)}, MsgExecuteContract.deserializeBinary),
            ]])
            setHandleComplete(() => () => navigate(`/invoices/${invoice?.getInvoiceUuid()?.getValue()}`))

            setSigning(true)
        } catch (e) {
            console.log({ e })
            setError(e)
            setSubmitting(false)
            setReviewing(false)
        }
    }

    return <FormWrapper title="Create Invoice">
        {signing && <MultiMessageStepModal messages={messages} onComplete={handleComplete} />}
        {submitting && <SubmittingOverlay>Submitting...</SubmittingOverlay>}
            <FormProvider {...formMethods}>
                <form onSubmit={e => e.preventDefault()}>
                    <VendorSelector required disabled={reviewing} />
                    <FormRow columns={2}>
                        <Input type="date" required disabled={reviewing} label="Invoice Date" name="invoice_date"></Input>
                        <TermsSelector required disabled={reviewing} />
                    </FormRow>
                    <Input disabled={reviewing} required="please enter a description" label="Description" name="description" />
                    <Dropdown name="paymentDenom" label="Payment Denom" options={['Select a Payment Denom', ...(denoms || [])]} />
                    <LineItemWrapper>
                        <SubHeader>Line Items</SubHeader>
                        {lineItems.map((li, i) => <InvoiceLineItem disabled={reviewing} index={i} key={`invoice-lineitem-${i}`}></InvoiceLineItem>)}
                        <Button disabled={reviewing} onClick={addLineItem}>Add Line Item</Button>
                    </LineItemWrapper>
                    <FormActions>
                        {reviewing ?
                            <Button width="100%" type="submit" onClick={handleSubmit(createInvoice)}>Submit</Button> :
                            <Button width="100%" type="button" onClick={() => setReviewing(true)}>Review</Button>
                        }
                        <Button type="button" secondary width="100%" onClick={() => reviewing ? setReviewing(false) : navigate('/')}>Cancel</Button>
                    </FormActions>
                </form>
            </FormProvider>
        {error && <ErrorBar>{`${error}`}</ErrorBar>}
    </FormWrapper>
}
