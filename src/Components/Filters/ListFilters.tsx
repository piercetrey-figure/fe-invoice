import { FunctionComponent } from "react";
import styled from "styled-components";

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-right: 10px;
`
const Icon = () => <IconWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20"><path fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 0H0l8 9.46V16l4 2V9.46z" transform="translate(1 1)"/></svg>
</IconWrapper>

const Wrapper = styled.div`
    display: flex;
    align-items: center;
`

export interface ListFiltersProps {

}

export const ListFilters: FunctionComponent<ListFiltersProps> = ({ children }) => <Wrapper><Icon />{children}</Wrapper>