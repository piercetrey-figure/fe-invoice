import { useState, useEffect } from "react";
import {
  useWalletConnect,
  QRCodeModal,
  WINDOW_MESSAGES as WINDOW_MESSAGE,
} from "@provenanceio/walletconnect-js";
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

const Wrapper = styled.div`
  background: ${PRIMARY_BACKGROUND};

  a {
    color: ${TEXT_ACCENT};
    &:hover {
      color: ${TEXT};
    }
  }
`;
const HomeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
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
    if (!listenersAdded) {
      console.log("Adding event listeners");
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
    }
  }, [listenersAdded]);

  return (
    <Wrapper>
      <HomeContainer>
        {popupContent && (
          <Popup
            delay={popupDuration}
            onClose={() => setPopupContent("")}
            status={popupStatus}
          >
            {popupContent}
          </Popup>
        )}
        <Header>InVoice</Header>
        <Content>
          {connected ? (
            <>
              <Disconnect walletConnectService={wcs} setPopup={setPopup} />
            </>
          ) : (
            <Connect walletConnectService={wcs} setPopup={setPopup} />
          )}
        </Content>
        <QRCodeModal
          walletConnectService={wcs}
          walletConnectState={walletConnectState}
          title="Scan to initiate walletConnect-js session"
        />
        <div>
          WalletConnect-JS Version: {REACT_APP_WCJS_VERSION || "??.??.??"}
        </div>
      </HomeContainer>
    </Wrapper>
  );
};
