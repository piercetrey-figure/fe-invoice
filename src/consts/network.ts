export const NETWORK = process.env.REACT_APP_NETWORK
export const PRODUCTION = NETWORK == 'mainnet'
export const EXPLORER_URL = PRODUCTION ? 'https://explorer.provenance.io' : 'https://explorer.test.provenance.io'
export const GRPC_URL = PRODUCTION ? 'https://wallet.provenance.io/proxy' : 'https://wallet.test.provenance.io/proxy'
// export const GRPC_URL = 'http://localhost:8080'
export const WALLET_URL = PRODUCTION ? 'https://wallet.provenance.io' : 'https://wallet.test.provenance.io'
export const ROOT_NAME = 'wallettest3.pb'
export const FEE_DENOM = 'nhash'

// export const BASE_URL = 'http://localhost:13459/v1'
export const BASE_URL = 'https://test.figure.tech/service-invoice/v1'
export const ROOT_PAYABLE_NAME = 'payablestest17.pb'
