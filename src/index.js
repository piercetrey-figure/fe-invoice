import ReactDOM from "react-dom";
import { WalletConnectContextProvider } from "@provenanceio/walletconnect-js";
import { WalletContextProvider } from "@provenanceio/wallet-lib";
import { StrictMode } from "react";
import { App } from "./App";
// Bring in Google Fonts and base styles
import "./base.css";
import { GRPC_URL, NETWORK, WALLET_URL } from "./consts/network";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.render(
  <StrictMode>
    <WalletConnectContextProvider
      network={NETWORK}
      bridge="https://bridge.walletconnect.org/"
    >
      <WalletContextProvider
        grpcServiceAddress={GRPC_URL}
        walletUrl={WALLET_URL}
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WalletContextProvider>
    </WalletConnectContextProvider>
  </StrictMode>,
  document.getElementById("root")
);
