import { LG, MD } from "consts";
import { FunctionComponent } from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { Component } from "typedoc/dist/lib/utils";
import { DARK_BACKGROUND, LIGHT, LIGHT_TEXT, TEXT_ACCENT } from "../../../consts/colors";

const Wrapper = styled.div`
    display: flex;
    flex-grow: 1;
    height: 100vh;

    @media(max-width: ${LG}px) {
        flex-direction: column;
        height: auto;
    }
`

const Sidebar = styled.div`
    min-width: 300px;
    background: ${DARK_BACKGROUND};
    color: ${LIGHT_TEXT};
    padding: 20px;    

    @media(max-width: ${LG}px) {
        min-width: unset;
    }
    `

const Content = styled.div`
    flex-grow: 1;
    padding: 20px;
    overflow-y: scroll;

    @media(max-width: ${LG}px) {
        padding-bottom: 40px;
    }
`

export interface SidebarLayoutProps {
    sidebarContent: Component,
}

export const SidebarLayout: FunctionComponent<SidebarLayoutProps> = ({ sidebarContent, children }) => {
    return <Wrapper>
        <Sidebar>{sidebarContent}</Sidebar>
        <Content>{children}</Content>
    </Wrapper>
}

export const SidebarLink = styled(NavLink).attrs({ activeclassname: 'active', exact: 'true' })`
    display: block;
    color: ${LIGHT_TEXT};
    font-size: 2rem;
    padding: 20px;
    margin-left: -20px;
    margin-right: -20px;
    &:hover {
        color: ${TEXT_ACCENT};
    }
    &:last-of-type {
        margin-bottom: 40px;
    }
    &.active {
        background: ${LIGHT_TEXT};
        color: ${DARK_BACKGROUND};
    }

    @media(max-width: ${LG}px) {
        padding: 10px 20px;

        &:last-of-type {
            margin-bottom: 20px;
        }
    }
`