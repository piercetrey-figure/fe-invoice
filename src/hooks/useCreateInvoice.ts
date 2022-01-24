import { Invoice } from "../proto/invoice_protos_pb"

export const useCreateInvoice = () => {
    return {
        onCreate: async (invoice: Invoice) => {
            console.log('creating', { invoice })
        }
    }
}