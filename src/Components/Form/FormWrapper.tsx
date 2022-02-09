import { FunctionComponent, ReactChild } from "react";
import styled from "styled-components";
import { Colors } from 'consts';

export interface FormWrapperProps {
    title: string,
    action?: ReactChild,
    headerDetails?: ReactChild
}

const Wrapper = styled.div`
    background: ${Colors.LIGHT};
    padding: 30px;
    border-radius: 10px;

    .inputContainer {
        margin-top: 30px;
    }
`

const Header = styled.div`
    padding-bottom: 30px;
    border-bottom: 1px solid ${Colors.DARK};
`

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:not(:last-child) {
        margin-bottom: 20px;
    }
`

const Title = styled.div`
    font-size: 3em;
    font-weight: bold;
`

const Action = styled.div``

export const FormWrapper: FunctionComponent<FormWrapperProps> = ({ title, action, headerDetails, children }) => <Wrapper>
    <Header>
        <HeaderRow>
            <Title>{title}</Title>
            {action && <Action>{action}</Action>}
        </HeaderRow>
        {headerDetails}
    </Header>
    {children}
</Wrapper>