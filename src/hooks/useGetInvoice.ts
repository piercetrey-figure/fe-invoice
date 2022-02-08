import { useQuery } from "react-query"
import { toInvoice } from "../util";
import { BASE_URL } from '../consts/network';
import { InvoiceCalc } from "../models/InvoiceCalc";

export const useGetInvoice = (uuid: string) => {
    return useQuery(['invoices', uuid], async () => {
        const res = await fetch(`${BASE_URL}/invoices/${uuid}`)
        
        const invoice = await res.text()

        return toInvoice(invoice)
    })
}

export const useGetCalc = (uuid: string) => {
    return useQuery(['calc', uuid], async () => {
        const res = await fetch(`${BASE_URL}/invoices/calc/${uuid}`)

        const invoiceCalcJson = await res.text()

        const invoiceCalc: InvoiceCalc = JSON.parse(invoiceCalcJson)

        return invoiceCalc
    })
}
