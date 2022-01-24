import { FunctionComponent } from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { Component } from "typedoc/dist/lib/utils";
import { DARK_BACKGROUND, LIGHT, LIGHT_TEXT, TEXT_ACCENT } from "../../../consts/colors";

const Wrapper = styled.div`
    display: flex;
    flex-grow: 1;
    min-height: 100vh;
`

const Sidebar = styled.div`
    min-width: 300px;
    background: ${DARK_BACKGROUND};
    color: ${LIGHT_TEXT};
    padding: 20px;
`

const Content = styled.div`
    flex-grow: 1;
    padding: 20px;
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
`