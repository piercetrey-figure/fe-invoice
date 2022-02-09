import { Colors } from "consts"
import { FunctionComponent } from "react"
import styled from "styled-components"

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

    pre {
        overflow-x: scroll;
    }
`

const Body = styled.div`
    background: ${Colors.LIGHT};
    border-radius: 4px;
    padding: 30px;
    word-break: break-word;
    min-width: 300px;
    max-width: 90vw;
    max-height: 80vh;
    overflow-y: scroll;
    position: relative;
`

const Close = styled.button`
    border: none;
    background: transparent;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 2em;
    height: 2em;
    text-align: center;
    cursor: pointer;
    border-radius: 50%;
    &:hover {
        background: rgba(0, 0, 0, .1);
    }
`

export interface ModalProps {
    requestClose?: () => any
}

export const Modal: FunctionComponent<ModalProps> = ({ children, requestClose }) => {
    return <Wrapper onClick={() => requestClose && requestClose()}>
        <Body onClick={e => e.stopPropagation()}>
            {requestClose && <Close onClick={requestClose}>X</Close>}
            {children}
        </Body>
    </Wrapper>
}