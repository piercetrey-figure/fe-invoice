import { BASE_URL } from "consts"
import { useQuery } from "react-query"
import { Invoice } from '../proto/invoice_protos_pb'
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { useGetNames } from "./useGetNames";

export const useInvoiceList = (from: boolean) => {
    const { walletConnectState: { address } } = useWalletConnect()
    const { data: myNames } = useGetNames(address)

    return useQuery<Invoice[]>(['invoices', from, address], async () => {
        const results = from
            ? (await (await fetch(`${BASE_URL}/invoices/address/from/${address}`)).json())
            : (await (await fetch(`${BASE_URL}/invoices/address/all`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ addresses: [address, ...(myNames || [])] }) })).json())

        return results
            .map((invoice: string) => Invoice.deserializeBinary(Buffer.from(invoice, 'base64')))
    })
}