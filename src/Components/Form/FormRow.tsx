import styled from "styled-components";

export interface FormRowProps {
    columns?: number
}

export const FormRow = styled.div<FormRowProps>`
    display: grid;
    grid-template-columns: repeat(${({ columns }) => columns || 1}, 1fr);
    grid-gap: 10px;
`