import styled from "styled-components";

export const SubmittingOverlay = styled.div`
    position: fixed;
    background: rgba(0, 0, 0, .5);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: white;
    pointer-events: none;
`