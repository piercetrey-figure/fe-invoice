import { FunctionComponent, useEffect, useState } from "react";
import { FormActions, FormRow, FormWrapper } from "../../Form";
import { SubHeader } from 'Components/Headers';
import { Input } from 'Components';
import { VendorSelector } from "../../Vendor/VendorSelector";
import Dropdown from "../../Dropdown/Dropdown";
import { Button } from 'Components';
import { useNavigate } from 'react-router-dom';
import { Invoice } from "../../../proto/invoice_protos_pb";
import { Date as DateProto } from "../../../proto/util_protos_pb";
import { addDays, format, parse } from 'date-fns'
import { newDate, newRandomUuid } from "../../../util";
import { ErrorBar } from "../../Error/ErrorBar";
import { SubmittingOverlay } from "../../Submitting/SubmittingOverlay";
import { useCreateInvoice } from "../../../hooks/useCreateInvoice";

interface TermsSelectorProps {
    value?: string,
    valueChange: (value: string) => any,
    disabled?: boolean,
}

const TermsSelector: FunctionComponent<TermsSelectorProps> = ({ value, valueChange, disabled }) => {
    const [selected, setSelected] = useState(value || '90 Days')
    const options = ['90 Days', '180 Days']

    
    const handleValueChange = (v: string) => {
        setSelected(v)
        valueChange(v)
    }

    useEffect(() => {
        handleValueChange(selected)
    }, [])

    return <Dropdown disabled={disabled} name="terms" label="Terms" value={selected} onChange={(v) => handleValueChange(v)} options={['Select Terms...', ...options]} />
}

interface CreateInvoiceProps {
    
}

export const CreateInvoice: FunctionComponent<CreateInvoiceProps> = ({ }) => {
    const { onCreate } = useCreateInvoice()

    const [reviewing, setReviewing] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    
    const [vendor, setVendor] = useState('')
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [terms, setTerms] = useState('')
    const [description, setDescription] = useState('')

    const navigate = useNavigate()

    const createInvoice = async () => {
        setSubmitting(true)
        
        try {
            const invoice = new Invoice()
            const uuid = newRandomUuid()
            console.log({ date })
            const startDate = parse(date, 'yyyy-MM-dd', new Date())
            console.log({ startDate })
            const dueDate = addDays(startDate, parseInt(terms))
            console.log({ terms ,t: parseInt(terms) })
            invoice.setInvoiceUuid(uuid)
                .setToAddress(vendor)
                .setInvoiceCreatedDate(newDate().setValue(startDate.toISOString()))
                .setInvoiceDueDate(newDate().setValue(dueDate.toISOString()))
                .setDescription(description)
                
            console.log({ invoice })
            await onCreate(invoice)
            navigate(`invoices/${uuid.getValue()}`)
        } catch (e) {
            setError(e)
            setSubmitting(false)
            setReviewing(false)
        }
    }

    return <FormWrapper title="Create Invoice">
        {submitting && <SubmittingOverlay>Submitting...</SubmittingOverlay>}
        <VendorSelector disabled={reviewing} onChange={setVendor} />
        <Input type="number" value={amount} onChange={amt => setAmount(+amt)} disabled={reviewing} label="Amount" />
        <FormRow columns={2}>
            <Input type="date" disabled={reviewing} label="Invoice Date" value={date} onChange={setDate}></Input>
            <TermsSelector disabled={reviewing} valueChange={setTerms} />
        </FormRow>
        <Input disabled={reviewing} label="Description" value={description} onChange={setDescription} />
        <FormActions>
            <Button width="100%" type="submit" onClick={() => reviewing ? createInvoice() : setReviewing(true)}>{reviewing ? 'Submit' : 'Review'}</Button>
            <Button secondary width="100%" onClick={() => reviewing ? setReviewing(false) : navigate('/')}>Cancel</Button>
        </FormActions>
        {error && <ErrorBar>{`${error}`}</ErrorBar>}
    </FormWrapper>
}