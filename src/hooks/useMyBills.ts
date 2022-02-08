import { NameContractService } from "Services/NameContractService";
import { BASE_URL, ROOT_NAME } from "consts";
import { useQuery } from "react-query";
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { Invoice } from "proto/invoice_protos_pb";

export const useMyBills = () => {
    const { walletConnectState: { address } } = useWalletConnect()

    return useQuery<Invoice[]>(['invoices'], async () => {
        const names = await new NameContractService(ROOT_NAME).listNames(address)
        const invoicePayload = await fetch(`${BASE_URL}/invoices/address/all`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                addresses: names,
            }),
        })
        return (await invoicePayload.json()).map((invoice: string) => Invoice.deserializeBinary(Buffer.from(invoice, 'base64')))
    })
}
