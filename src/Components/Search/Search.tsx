import { FunctionComponent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import Input from '../Input/Input';

interface SearchInputProps {
    maxWidth?: number
}

const SearchInput = styled(Input).attrs(({ style: { borderRadius: '20px', marginBottom: 0 } }))<SearchInputProps>`
    max-width: ${({ maxWidth }) => (`${maxWidth}px` || 'none')};
`

export interface SearchProps {
    maxWidth?: number,
}

export const Search: FunctionComponent<SearchProps> = ({ maxWidth }) => {
    const formMethods = useForm()
    return <FormProvider {...formMethods}>
        <SearchInput disabled={false} maxWidth={maxWidth} placeholder="Search" name="search" />
    </FormProvider>
}