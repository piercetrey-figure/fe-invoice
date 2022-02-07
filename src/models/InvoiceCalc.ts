/**
 * A calc detail for an individual line item.  Holds information about its total, alongside all originally-onboarded
 * data.
 */
export interface LineItemCalc {
    uuid: string,
    name: string,
    description: string,
    quantity: number,
    price: number,
    total: number,
}

/**
 * A calc detail for an individual payment. Holds information about how much funds were left after applying it.
 */
export interface PaymentCalc {
    uuid: string,
    invoiceUuid: string,
    effectiveTime: string,
    paymentAmount: number,
    paymentDenom: string,
    fromAddress: string,
    owedBeforePayment: number,
    owedAfterPayment: number,
}

/**
 * The root calc interface.  Holds all details for the status of an invoice after it has been successfully onboarded.
 */
export interface InvoiceCalc {
    uuid: string,
    calcTime: string,
    invoiceStatus: string,
    paymentStatus: string,
    ownerAddress: string,
    payerAddress: string,
    createdDate: string,
    dueDate: string,
    description: string,
    lineItems: LineItemCalc[],
    payments: PaymentCalc[],
    paymentSum: number,
    paymentDenom: string,
    originalOwed: number,
    remainingOwed: number,
    paymentDelinquentDays: number,
    payoffTime?: number,
    isPaidOff: boolean,
}
