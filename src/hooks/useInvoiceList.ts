import { randomUUID } from "crypto"
import { useQuery } from "react-query"
import { LineItem, Invoice } from '../proto/invoice_protos_pb'
import { UUID, Decimal, Date as DateProto } from '../proto/util_protos_pb'
import { newDate, newDecimal, newInvoice, newLineItem, newRandomUuid } from "../util"

export const useInvoiceList = () => {
    return useQuery(['invoices'], async () => {
        const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const generateLineItem = (num: number) => newLineItem()
            .setLineUuid(newRandomUuid())
            .setName(`Line item ${num}`)
            .setDescription(`Description for line item ${num}`)
            .setQuantity(randomNum(1, 101))
            .setPrice(newDecimal().setValue(`${randomNum(100, 1000)}`))

        const generateInvoice = (num: number, numLines: number) => newInvoice()
            .setInvoiceUuid(newRandomUuid())
            .setFromAddress(`tpFrom${num}`)
            .setToAddress(`tpTo${num}`)
            .setDescription(`Invoice ${num} Description`)
            .setInvoiceCreatedDate(newDate().setValue(Date.now().toLocaleString()))
            .setInvoiceDueDate(newDate().setValue(Date.now().toLocaleString()))
            .setPaymentDenom('hash')
            .setLineItemsList([...new Array(numLines)].map((_, i) => generateLineItem(i)))

        const ret = [... new Array(randomNum(3, 10))].map((_, i) => generateInvoice(i, randomNum(1, 5)))
        return ret
    })
}