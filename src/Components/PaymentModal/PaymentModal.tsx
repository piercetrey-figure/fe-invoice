import { Button, Input } from "Components";
import { Header } from "Components/Headers";
import { Modal } from "Components/Modal";
import { FunctionComponent, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { currencyFormatter } from "../../util";

export interface PaymentModalProps {
    invoiceUuid: string,
    outstandingBalance: number,
    paymentDenom: string,
    initialAmount?: number,
    onSubmit: (amount: number) => void,
    requestClose?: () => any,
}

export const PaymentModal: FunctionComponent<PaymentModalProps> = ({ invoiceUuid, outstandingBalance, paymentDenom, initialAmount, onSubmit, requestClose }) => {
    const formMethods = useForm()

    const formatter = useMemo(() => currencyFormatter(paymentDenom), [paymentDenom])

    return <Modal requestClose={requestClose}>
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit((data: any) => onSubmit(data.amount))}>
                <Header style={{ marginTop: 0 }}>Make a Payment</Header>
                <Input required="Please specify a payment amount" type="number" name="amount" label={`Amount (${paymentDenom})`} registerConfig={{ max: outstandingBalance }} />
                <div>Outstanding Balance: {formatter(outstandingBalance)}</div>
                <Button width="100%" type="submit">Submit</Button>
            </form>
        </FormProvider>
    </Modal>
}