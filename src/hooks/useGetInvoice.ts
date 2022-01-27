import { useQuery } from "react-query"
import { toInvoice } from "../util";
import { BASE_URL } from '../consts/network';
import { Invoice } from '../proto/invoice_protos_pb.d';

export const useGetInvoice = (uuid: string) => {
    return useQuery(['invoices', uuid], async () => {
        const res = await fetch(`${BASE_URL}/invoices/${uuid}`)
        
        const invoice = await res.text()

        return toInvoice(invoice)
    })
}