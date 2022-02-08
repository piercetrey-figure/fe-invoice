import { useState, useEffect } from "react";
import {
  useWalletConnect,
  QRCodeModal,
  WINDOW_MESSAGES as WINDOW_MESSAGE,
} from "@provenanceio/walletconnect-js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { Connect, Disconnect, Popup } from "Components";
import { ROOT_NAME } from "consts";
import { REACT_APP_WCJS_VERSION } from "./version"; // eslint-disable-line
import { useWallet } from "@provenanceio/wallet-lib";
import { TEXT_ACCENT, PRIMARY_BACKGROUND, TEXT } from "./consts/colors";
import { Header, SubHeader } from "Components/Headers";
import { ConversionUtil } from "./util/ConversionUtil";
import { TabContainer } from "Components/Tabs";
import AddressLink from "Components/AddressLink";
import { BigParagraph } from "Components/Display";
import { SidebarLayout, SidebarLink } from "./Components/Layout/Sidebar";
import { ListInvoices } from "./Components/Pages/List/ListInvoices";
import { CreateInvoice } from "./Components/Pages/Create/CreateInvoice";
import { InvoiceDetails } from "Components/Pages/Details";
import { InvoiceBills } from "Components/Pages/Bills";

const Wrapper = styled.div`
  background: ${PRIMARY_BACKGROUND};
`;
const HomeContainer = styled.div`
  max-width: 100%;
  min-height: 100vh;
  position: relative;
`;
const Content = styled.div`
  min-width: 600px;
  padding: 30px 50px;
  border-radius: 4px;
  margin-bottom: 40px;
`;
const WalletConnectVersion = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

export const App = () => {
  const [popupContent, setPopupContent] = useState("");
  const [popupStatus, setPopupStatus] = useState("success");
  const [popupDuration, setPopupDuration] = useState(2500);
  const [hashAmount, setHashAmount] = useState(null);
  const [listenersAdded, setListenersAdded] = useState(false);

  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const { address, connected, peer } = walletConnectState;

  const setPopup = (message, status, duration) => {
    setPopupContent(message);
    if (status) {
      setPopupStatus(status);
    }
    if (duration) {
      setPopupDuration(duration);
    }
  };

  const { grpcService } = useWallet();

  const fetchBalance = () => {
    if (address) {
      grpcService.getBalancesList(address).then((balances) => {
        let hashAmount = ConversionUtil.getHashBalance(balances);
        if (hashAmount) {
          setHashAmount(hashAmount);
        }
      });
    } else {
      setHashAmount(null);
    }
  };
  useEffect(() => {
    fetchBalance();
  }, [address]);

  useEffect(() => {
    setListenersAdded(true);
    wcs.addListener(WINDOW_MESSAGE.CUSTOM_ACTION_COMPLETE, (result) => {
      console.log(
        `WalletConnectJS | Custom Action Complete | Result: `,
        result
      );
    });

    wcs.addListener(WINDOW_MESSAGE.CUSTOM_ACTION_FAILED, (result) => {
      const { error } = result;
      console.log(
        `WalletConnectJS | Custom Action Failed | result, error: `,
        result,
        error
      );
    });
  }, []);

  return (
    <Wrapper>
      <HomeContainer>
        <Router basename="fe-invoice">
          {popupContent && (
            <Popup
              delay={popupDuration}
              onClose={() => setPopupContent("")}
              status={popupStatus}
            >
              {popupContent}
            </Popup>
          )}
          <SidebarLayout
            sidebarContent={
              <>
                <Header>InVoice</Header>
                {connected ? (
                  <>
                    <SidebarLink to="/">Sent Invoices</SidebarLink>
                    <SidebarLink to="/bills">Received Invoices</SidebarLink>
                    <SidebarLink to="/create">Create Invoice</SidebarLink>
                    <Disconnect
                      walletConnectService={wcs}
                      setPopup={setPopup}
                    />
                  </>
                ) : (
                  <Connect walletConnectService={wcs} setPopup={setPopup} />
                )}
                <WalletConnectVersion>
                  WalletConnect-JS Version:{" "}
                  {REACT_APP_WCJS_VERSION || "??.??.??"}
                </WalletConnectVersion>
              </>
            }
          >
            {connected && (
              <Routes>
                <Route path="/" element={<ListInvoices />} />
                <Route path="/bills" element={<InvoiceBills />} />
                <Route path="/create" element={<CreateInvoice />} />
                <Route path="/:uuid" element={<InvoiceDetails />} />
                <Route path="*" element={<ListInvoices />} />
              </Routes>
            )}
          </SidebarLayout>
          <QRCodeModal
            walletConnectService={wcs}
            walletConnectState={walletConnectState}
            title="Scan to initiate walletConnect-js session"
          />
        </Router>
      </HomeContainer>
    </Wrapper>
  );
};
