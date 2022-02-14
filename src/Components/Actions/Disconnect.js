import { useEffect } from "react";
import { WINDOW_MESSAGES } from "@provenanceio/walletconnect-js";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button } from "Components";
import { ActionContainer } from "./ActionContainer";
import { Colors, SM } from "consts";

const Info = styled.div`
  font-size: 1.4rem;
  margin-right: 40px;
  flex-basis: 80%;
  @media (max-width: ${SM}px) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;
export const Disconnect = ({ walletConnectService, setPopup }) => {
  const color = Colors.WARN;

  useEffect(() => {
    walletConnectService.addListener(WINDOW_MESSAGES.DISCONNECT, (result) => {
      console.log("WalletConnectJS | Disconnect | Result: ", result); // eslint-disable-line no-console
      setPopup("Wallet Disconnected", "failure");
    });

    return () => {
      walletConnectService.removeAllListeners(WINDOW_MESSAGES.DISCONNECT);
    };
  }, [walletConnectService, setPopup]);

  return (
    <ActionContainer color={color} justify="space-between">
      <Info>Disconnect the connected wallet</Info>
      <Button backgroundColor={color} onClick={walletConnectService.disconnect}>
        Disconnect
      </Button>
    </ActionContainer>
  );
};

Disconnect.propTypes = {
  walletConnectService: PropTypes.shape({
    disconnect: PropTypes.func,
    addListener: PropTypes.func,
    removeAllListeners: PropTypes.func,
  }).isRequired,
  setPopup: PropTypes.func.isRequired,
};
