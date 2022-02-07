export interface LineItemCalc {
    uuid: string,
    name: string,
    description: string,
    quantity: number,
    price: number,
    total: number,
}

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
