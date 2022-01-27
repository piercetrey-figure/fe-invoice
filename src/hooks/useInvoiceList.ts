import { BASE_URL } from "consts"
import { randomUUID } from "crypto"
import { useQuery } from "react-query"
import { LineItem, Invoice } from '../proto/invoice_protos_pb'
import { UUID, Decimal, Date as DateProto } from '../proto/util_protos_pb'
import { newDate, newDecimal, newInvoice, newLineItem, newRandomUuid } from "../util"
import { useWalletConnect } from '@provenanceio/walletconnect-js';

export const useInvoiceList = () => {
    const { walletConnectState: { address } } = useWalletConnect()

    return useQuery<Invoice[]>(['invoices'], async () => {
        return (await (await fetch(`${BASE_URL}/invoices/address/from/${address}`)).json())
            .map((invoice: string) => Invoice.deserializeBinary(Buffer.from(invoice, 'base64')))
    })
}