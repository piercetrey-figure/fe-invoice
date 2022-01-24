import styled from "styled-components";
import { Colors } from 'consts';
import { LIGHT_TEXT } from '../../consts/colors';

export const ErrorBar = styled.div`
    padding: 10px 20px;
    color: white;
    font-size: 2rem;
    text-align: center;
    background: ${Colors.WARN};
    margin-top: 20px;
`