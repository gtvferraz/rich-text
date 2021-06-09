import styled from 'styled-components'
import { createElement, useEffect, useState } from 'react';

import TitleIcon from "../src/assets/icons/title.svg";
import BoldIcon from "../src/assets/icons/bold.svg";
import ItalicIcon from "../src/assets/icons/italic.svg";
import CodeIcon from "../src/assets/icons/code.svg";
import ItemizeIcon from "../src/assets/icons/itemize.svg";
import UnderlineIcon from "../src/assets/icons/underline.svg";
import QuotesIcon from "../src/assets/icons/quotes.svg";
import LinkIcon from "../src/assets/icons/link.svg";

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MainContainer = styled.div`
  width: 840px;
  height: 50vh;
  margin-top: 5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px -10px black;

  @media only screen and (max-width: 1050px) {
    width: calc(80vw - 2rem);
  }
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }

  svg {
    cursor: pointer;
  }
`;

const Content = styled.div`
  margin-top: 1rem;

  & > div {
    font-size: 1rem;
    line-height: 1.2rem;
    font-family: ${({theme}) => `${theme.fonts.primary.family},${theme.fonts.primary.generic}`};
    border: 0;
    margin-top: 0.1rem;

    &:first-child {
      margin-top: 0;
    }

    &:hover {
      background-color: rgba(0,162,232,0.2);
    }

    &:focus {
      outline: none;
      background-color: rgba(230,230,230,0.3);
    }

    &:empty::before {
      content: 'Type something here!';
      color: rgba(0,0,0,0.5);
    }
  }
`;

const options = {
  title: 0,
  bold: 1,
  italic: 0,
  code: 0,
  itemize: 0,
  undeline: 0,
  quotes: 0,
  link: 0,
}

export const Menu = (props) => {
  const handleClick = (event, option) => {
    props.onMenuClick(event, option);
  }

  return (
    <MenuContainer id='menu'>
      <TitleIcon onClick={(event) => handleClick(event, options.title)} />
      <BoldIcon onClick={(event) => handleClick(event, options.bold)} />
      <ItalicIcon onClick={(event) => handleClick(event, options.italic)} />
      <CodeIcon onClick={(event) => handleClick(event, options.code)} />
      <ItemizeIcon onClick={(event) => handleClick(event, options.itemize)} />
      <UnderlineIcon onClick={(event) => handleClick(event, options.undeline)} />
      <QuotesIcon onClick={(event) => handleClick(event, options.quotes)} />
      <LinkIcon onClick={(event) => handleClick(event, options.link)} />
    </MenuContainer>
  );
}

export default function Home() {
  useEffect(() => {
  }, [])

  const handleMenuClick = (event, option) => {
    console.log(option);
  }

  const handleKeyDown = (event, option) => {
    console.log(event.keyCode);
    const target = event.target;

    if(event.keyCode === 13) {
      event.preventDefault();

      const newLine = document.createElement('div');
      newLine.contentEditable = true;
      newLine.onkeydown = (e) => handleKeyDown(e);

      target.after(newLine);
      newLine.focus();
    } else if(event.keyCode === 8) {
      if(!target.innerHTML && target.parentNode.childElementCount > 1) {
        let sibling;
        if(target.previousSibling)
          sibling = target.previousSibling;
        else
          sibling = target.nextSibling;

        sibling.focus();

        console.log(sibling.setSelectionRange(0,0));
        // var t = sibling.createTextRange();
        // t.collapse(true);
        // t.moveEnd('character', len);
        // t.moveStart('character', len);
        // t.select();

        target.remove();
      }
    }
  }

  return (
    <PageContainer>
      <MainContainer>
        <Menu onMenuClick={handleMenuClick}/>
          <Content id='content_wrapper'>
            <div contentEditable={true} onKeyDown={(e) => handleKeyDown(e)} />
          </Content>
      </MainContainer>
        </PageContainer>
    );
}