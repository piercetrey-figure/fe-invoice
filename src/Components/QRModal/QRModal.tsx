import { FunctionComponent, MouseEventHandler, useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { useLocation } from "react-router-dom";
import { Modal } from 'Components/Modal';
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button, Popup } from "Components";
import styled from "styled-components";
import { Colors } from "consts";

const QrWrapper = styled.div`
    cursor: pointer;
    margin-bottom: 20px;
`

interface ClipboardItem {
    readonly types: string[];
    readonly presentationStyle: "unspecified" | "inline" | "attachment";
    getType(): Promise<Blob>;
}

interface ClipboardItemData {
    [mimeType: string]: Blob | string | Promise<Blob | string>;
}

declare var ClipboardItem: {
    prototype: ClipboardItem;
    new (itemData: ClipboardItemData): ClipboardItem;
};

export interface QRModalProps {
    requestClose: () => any
}

export const QRModal: FunctionComponent<QRModalProps> = ({ requestClose }) => {
    const [copyMessage, setCopyMessage] = useState("")
    const [qrContent, setQrContent] = useState<any>(null)
    const ref = useRef<QRCode>(null)
    
    const url = window.location.href;

    useEffect(() => {
        (ref?.current as any)?.canvas.current.toBlob((blob: any) => {
            setQrContent(blob)
        })
    }, [ref])

    const copyQrToClipboard: MouseEventHandler = e => {
        try {
            const content = (e.target as HTMLCanvasElement).toBlob(blob => {
                if (!blob) {
                    setCopyMessage("Failed to copy qr contents to clipboard, please share link")
                } else {
                    (navigator.clipboard as any).write([new ClipboardItem({ "image/png": blob })])
                    setCopyMessage("QR Code Copied to Clipboard")
                }
            })
        } catch (e) {
            setCopyMessage("Failed to copy qr contents to clipboard, please share link")
        }
    }

    return <Modal requestClose={requestClose}>
        <div style={{ textAlign: 'center' }}>click on QR code to copy</div>
        <QrWrapper onClick={copyQrToClipboard}>
            <QRCode ref={ref} size={300} value={url} />
        </QrWrapper>
        <CopyToClipboard text={url} onCopy={(text, result) => {
            console.log({ text, result })
            setCopyMessage(`${text} was copied to clipboard`)
        }}>
            <Button width="100%">Copy URL to Clipboard</Button>
        </CopyToClipboard>
        {copyMessage && <Popup onClose={() => {
            setCopyMessage("")
            requestClose()
        }}>{copyMessage}</Popup>}
    </Modal>
}