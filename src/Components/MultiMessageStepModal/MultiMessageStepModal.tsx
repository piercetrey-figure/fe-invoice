import { Header, SubHeader } from "Components/Headers";
import { Colors } from "consts";
import { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { useNavigate } from "react-router-dom";
import { Any } from '@provenanceio/wallet-lib/lib/proto/google/protobuf/any_pb';
import { Message } from 'google-protobuf'
import { decodeB64 } from "../../util";

const Wrapper = styled.div`
    position: fixed;

    background: rgba(0, 0, 0, .7);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;

    display: flex;
    align-items: center;
    justify-content: center;
`

const Body = styled.div`
    background: ${Colors.LIGHT};
    border-radius: 4px;
    padding: 30px;
    word-break: break-word;
    min-width: 300px;
    max-width: 90vw;
`

export interface SignMessage {
    proto: any,
    anyProto: any
}

export function parseSignMessage<T extends Message>(anyProto: any, deserializer: (b: Buffer) => T, modifier: (message: T) => T = (m) => m): SignMessage {
    const deserialized = modifier(deserializer(decodeB64(anyProto.value)))
    anyProto.value = Buffer.from(deserialized.serializeBinary()).toString('base64')
    return {
        proto: deserialized.toObject(),
        anyProto
    }
}

export interface MultiMessageStepModalProps {
    messages: SignMessage[],
    redirect: string,
}

export const MultiMessageStepModal: FunctionComponent<MultiMessageStepModalProps> = ({ messages, redirect }) => {
    const [current, setCurrent] = useState(0)
    const navigate = useNavigate()

    const { walletConnectService: wcs } = useWalletConnect()

    const handleSign = async (message: SignMessage) => await wcs.customAction({
        message: Buffer.from(new Any().setTypeUrl(message.anyProto.typeUrl).setValue(message.anyProto.value).serializeBinary()).toString('base64'),
        description: message.anyProto.typeUrl,
        method: "provenance_sendTransaction",
    })

    useEffect(() => {
        (async () => {
            for (const message of messages) {
                await handleSign(message)
                setCurrent(c => Math.min(c + 1, messages.length - 1))
            }
            navigate(redirect)
        })()
    }, [messages])

    return <Wrapper>
        <Body>
            <Header>Sign Message ({current + 1} / {messages.length})</Header>
            <pre>{JSON.stringify(messages[current].proto, null, 2)}</pre>
            <SubHeader>Please Check Your Device for Signature Prompt</SubHeader>
        </Body>
    </Wrapper>
}