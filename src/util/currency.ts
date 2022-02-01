type FormatFn = (value: number) => string

const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
})

export const currencyFormatter = (currency: string): FormatFn => {
    switch (currency) {
        case 'USD':
            return value => usdFormatter.format(value)
            break;
        default:
            return value => `${value}${currency}`
    }
}
