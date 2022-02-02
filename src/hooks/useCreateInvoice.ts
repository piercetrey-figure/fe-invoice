import { BASE_URL } from "consts"
import { Invoice } from "../proto/invoice_protos_pb"
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { urlSafeBase64ToBase64 } from "../util"

export interface PayablesContractExecutionDetail {
    payableUuid: string,
    scopeId: string,
    invoiceDenom: string,
    invoiceTotal: number,
}

export interface CreateInvoiceResponse {
    invoice: any,
    payablesContractExecutionDetail: PayablesContractExecutionDetail,
    scopeGenerationDetail: {
        writeScopeRequest: any,
        writeSessionRequest: any,
        writeRecordRequest: any,
    }
}

export const useCreateInvoice = () => {
    const { walletConnectState } = useWalletConnect()

    const { address, publicKey } = walletConnectState
    return {
        onCreate: async (invoice: Invoice): Promise<CreateInvoiceResponse> => {
            const { lineItemsList: lineItems, ...rest } = invoice.toObject()
            const body = JSON.stringify({ ...rest, lineItems })
            const res = await fetch(`${BASE_URL}/invoices/onboard`, { method: 'POST', body, headers: {
                'Content-Type': 'application/json',
                'x-public-key': urlSafeBase64ToBase64(publicKey),
                'x-address': address,
            } })
            const resBody = await res.json()

            if (res.status != 200) {
                throw Error(`Error Creating Invoice: ${resBody.error}`)
            }

            return resBody
        }
    }
}
