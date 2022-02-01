import { Colors } from "consts";
import { FunctionComponent } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    color: ${Colors.WARN};
`

export interface InputErrorProps {
    children: string | { message: string }
}

export const InputError: FunctionComponent<InputErrorProps> = ({ children }) => {
    if (!children) {
        return <></>
    }

    return <Wrapper>{(typeof children === 'string' ? children : children.message) || 'required'}</Wrapper>
}