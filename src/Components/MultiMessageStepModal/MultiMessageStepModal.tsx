import { Header, SubHeader } from "Components/Headers";
import { Colors } from "consts";
import { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { useWalletConnect } from '@provenanceio/walletconnect-js';
import { useNavigate } from "react-router-dom";
import { Any } from '@provenanceio/wallet-lib/lib/proto/google/protobuf/any_pb';
import { Message } from 'google-protobuf'
import { decodeB64 } from "../../util";
import { Modal } from "Components/Modal";

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
    messages: SignMessage[][],
    onComplete?: () => any,
}

export const MultiMessageStepModal: FunctionComponent<MultiMessageStepModalProps> = ({ messages, onComplete }) => {
    const [current, setCurrent] = useState(0)
    const navigate = useNavigate()

    const { walletConnectService: wcs } = useWalletConnect()

    const handleSign = async (batch: SignMessage[]) => await wcs.customAction({
        message: batch.map(message => Buffer.from(new Any().setTypeUrl(message.anyProto.typeUrl).setValue(message.anyProto.value).serializeBinary()).toString('base64')),
        description: batch.map(message => message.anyProto.typeUrl).join(),
        method: 'provenance_sendTransaction',
    })

    useEffect(() => {
        (async () => {
            for (const batch of messages) {
                await handleSign(batch)
                setCurrent(c => Math.min(c + 1, messages.length - 1))
            }
            onComplete && onComplete()
        })()
    }, [messages])

    if (messages.length == 0) {
        return <></>
    }

    return <Modal>
        <Header>Sign Transaction ({current + 1} / {messages.length})</Header>
        <pre>{JSON.stringify(messages[current].map(message => message.proto), null, 2)}</pre>
        <SubHeader>Please Check Your Device for Signature Prompt</SubHeader>
    </Modal>
}