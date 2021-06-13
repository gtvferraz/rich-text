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
import next from 'next';

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
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
      filter: brightness(0.5);
    }
  }
`;

const Content = styled.div`
  margin-top: 1rem;

  & > div {
    font-size: 1rem;
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
      cursor: text;
      content: 'Type something here!';
      color: rgba(0,0,0,0.5);
    }

    h1 {
      margin: 0;
    }
  }
`;

const options = {
  title: 0,
  bold: 1,
  italic: 2,
  undeline: 3,
  code: 0,
  itemize: 0,
  quotes: 0,
  link: 0,
}

export const Menu = (props) => {
  const handleClick = (event, option) => {
    props.onMenuClick(event, option);
  }

  return (
    <MenuContainer id='menu'>
      <TitleIcon onClick={(e) => handleClick(e, options.title)} onMouseDown={(e) => e.preventDefault()} />
      <BoldIcon onClick={(e) => handleClick(e, options.bold)}  onMouseDown={(e) => e.preventDefault()} />
      <ItalicIcon onClick={(e) => handleClick(e, options.italic)} onMouseDown={(e) => e.preventDefault()} />
      <UnderlineIcon onClick={(e) => handleClick(e, options.underline)} onMouseDown={(e) => e.preventDefault()} />
      <CodeIcon onClick={(e) => handleClick(e, options.code)} onMouseDown={(e) => e.preventDefault()} />
      <ItemizeIcon onClick={(e) => handleClick(e, options.itemize)} onMouseDown={(e) => e.preventDefault()} />
      <QuotesIcon onClick={(e) => handleClick(e, options.quotes)} onMouseDown={(e) => e.preventDefault()} />
      <LinkIcon onClick={(e) => handleClick(e, options.link)} onMouseDown={(e) => e.preventDefault()} />
    </MenuContainer>
  );
}

export default function Home() {
  useEffect(() => {
  }, [])

  const compareStyles = (style1, style2) => { 
    let props1 = [];
    let props2 = [];

    let auxArray = Object.entries(style1);
    for(let i=0; i<auxArray.length; i++) {
      if(!auxArray[i][1])
        break;
      props1.push(auxArray[i][1]);
    }

    auxArray = Object.entries(style2);
    for(let i=0; i<auxArray.length; i++) {
      if(!auxArray[i][1])
        break;
      props2.push(auxArray[i][1]);
    }

    if(props1.length !== props2.length)
      return false;

    for(let i=0; i<props1.length; i++) {
      if(!props2.find(element => element === props1[i]))
        return false;
    };

    return true;
  }

  const checkOption = (span, option) => {
    if(option === options.bold) {
      if(span.style.fontWeight === 'bold')
        return true;
      return false;
    } else if(option === options.italic) {
      if(span.style.fontStyle === 'italic')
        return true;
      return false;
    } else {
      if(span.style.textDecoration === 'underline')
        return true;
      return false;
    } 
  }

  const stylizeSpan = (span, option, disableDelete) => {
    if(option === options.bold) {
      if(span.style.fontWeight === 'bold') {
        if(!disableDelete) 
          span.style.fontWeight = '';
      } else
        span.style.fontWeight = 'bold';
    } else if(option === options.italic) {
      if(span.style.fontStyle === 'italic') {
        if(!disableDelete) 
          span.style.fontStyle = '';
      } else
        span.style.fontStyle = 'italic';
    } else {
      if(span.style.textDecoration === 'underline') {
        if(!disableDelete) 
          span.style.textDecoration = '';
      } else
        span.style.textDecoration = 'underline';
    } 
  }

  //Returns true if the selection was made from left to right and false otherwise
  const checkSelectDir = (selection) => {
    let sibling = selection.anchorNode.parentNode.nextSibling;

    while(sibling && sibling !== selection.focusNode.parentNode) {
      sibling = sibling.nextSibling;
    }

    if(!sibling)
      return false;
    return true;
  }

  const splitSpan = (span, splitIndex) => {
    const selection = window.getSelection();

    if(!span) {
      const startIndex = selection.anchorOffset < selection.focusOffset ? selection.anchorOffset : selection.focusOffset;
      const endIndex = selection.anchorOffset < selection.focusOffset ? selection.focusOffset : selection.anchorOffset;
      const textContent = selection.anchorNode.textContent;
      const style = selection.anchorNode.parentNode.style.cssText;

      //Selected the initial part of the text
      if(startIndex === 0) {
        const newSpan = document.createElement('span');
        const nextSpan = document.createElement('span');
        
        newSpan.innerHTML = textContent.slice(0, endIndex);
        nextSpan.innerHTML = textContent.slice(endIndex, textContent.length);

        newSpan.style.cssText = style;
        nextSpan.style.cssText = style;

        return [undefined, newSpan, nextSpan];
      } 
      //Selected the final part of the text
      else if(endIndex === textContent.length) {
        const prevSpan = document.createElement('span');
        const newSpan = document.createElement('span');
        
        prevSpan.innerHTML = textContent.slice(0, startIndex);
        newSpan.innerHTML = textContent.slice(startIndex, textContent.length);

        prevSpan.style.cssText = style;
        newSpan.style.cssText = style;

        return [prevSpan, newSpan, undefined];
      } 
      //Selected the middle part of the text
      else {
        console.log(style);
        const prevSpan = document.createElement('span');
        const newSpan = document.createElement('span');
        const nextSpan = document.createElement('span');
        
        prevSpan.innerHTML = textContent.slice(0, startIndex);
        newSpan.innerHTML = textContent.slice(startIndex, endIndex);
        nextSpan.innerHTML = textContent.slice(endIndex, textContent.length);

        prevSpan.style.cssText = style;
        newSpan.style.cssText = style;
        nextSpan.style.cssText = style;

        return [prevSpan, newSpan, nextSpan];
      }
    } else {
      const textContent = span.textContent;

      const firstSpan = document.createElement('span');
      const lastSpan = document.createElement('span');
      
      firstSpan.innerHTML = textContent.slice(0, splitIndex);
      lastSpan.innerHTML = textContent.slice(splitIndex, textContent.length);

      firstSpan.style.cssText = span.style.cssText;
      lastSpan.style.cssText = span.style.cssText;

      return [firstSpan, lastSpan];
    }
  }

  const handleMenuClick = (event, option) => {
    event.preventDefault();
    const target = event.target;

    if(option === options.title) {
      const selection = window.getSelection();
      const div = selection.anchorNode.tagName === 'DIV' ? selection.anchorNode : selection.anchorNode.parentNode.parentNode;

      if(div.style.fontSize === '2rem') {
        div.style.fontSize = '';
        div.style.fontWeight = '';
      } else {
        div.style.fontSize = '2rem';
        div.style.fontWeight = 'bold';
      }
    } else if(option === options.bold || option === options.italic || option === options.underline) {
      const selection = window.getSelection();

      if(!selection.isCollapsed) {      
        //Only one element is selected
        if(selection.anchorNode === selection.focusNode) {
          const startIndex = selection.anchorOffset < selection.focusOffset ? selection.anchorOffset : selection.focusOffset;
          const endIndex = selection.anchorOffset < selection.focusOffset ? selection.focusOffset : selection.anchorOffset;
          
          const originalSpan = selection.anchorNode.parentNode;
          const div = originalSpan.parentNode;

          const textContent = selection.anchorNode.textContent;
          let prevSpan;
          let newSpan;
          let nextSpan;

          //The whole text is selected
          if(startIndex === 0 && endIndex === textContent.length) {
            newSpan = originalSpan;
            stylizeSpan(newSpan, option);
          } else {
            const spans = splitSpan();

            prevSpan = spans[0];
            newSpan = spans[1];
            nextSpan = spans[2];

            stylizeSpan(newSpan, option);

            div.replaceChild(prevSpan ? prevSpan : newSpan, originalSpan);
            prevSpan ? prevSpan.after(newSpan) : null;
            nextSpan ? newSpan.after(nextSpan) : null;
          }

          const prevSibling = newSpan.previousSibling;
          const nextSibling = newSpan.nextSibling;
          let startSelect = 0;
          let endSelect = newSpan.innerHTML.length;

          if(prevSibling && compareStyles(prevSibling.style, newSpan.style)) {
            startSelect = prevSibling.innerHTML.length;
            endSelect += startSelect;

            newSpan.innerHTML = `${prevSibling.innerHTML}${newSpan.innerHTML}`;
            prevSibling.remove();
          }

          if(nextSibling && compareStyles(nextSibling.style, newSpan.style)) {
            newSpan.innerHTML = `${newSpan.innerHTML}${nextSibling.innerHTML}`;
            nextSibling.remove();
          }

          const range = document.createRange();
          range.setStart(newSpan.firstChild, startSelect);
          range.setEnd(newSpan.firstChild, endSelect);

          selection.removeAllRanges();
          selection.addRange(range);
        } 
        //More than one element is selected
        else {
          let startIndex;
          let endIndex;
          
          let firstElement;
          let lastElement;
          
          if(checkSelectDir(selection)) {
            startIndex = selection.anchorOffset;
            endIndex = selection.focusOffset;
            
            firstElement = selection.anchorNode.parentNode;
            lastElement = selection.focusNode.parentNode;
          } else {
            startIndex = selection.focusOffset;
            endIndex = selection.anchorOffset;
            
            firstElement = selection.focusNode.parentNode;
            lastElement = selection.anchorNode.parentNode;
          }
          
          let newElements = [];
          let elements = [firstElement];
          let disableDelete = !checkOption(firstElement, option)
          let sibling = firstElement.nextSibling;
          let div = firstElement.parentNode;

          while(sibling && sibling !== lastElement) {
            if(!disableDelete && !checkOption(sibling, option))
              disableDelete = true;

            elements.push(sibling);
            sibling = sibling.nextSibling;
          }

          elements.push(lastElement);
          if(!disableDelete && !checkOption(sibling, option))
              disableDelete = true;

          let startContainer;
          let endContainer;
          let startOffset = 0;
          let endOffset;

          //First selected element
          if(startIndex === 0) {
            stylizeSpan(firstElement, option, disableDelete);
            startContainer = firstElement;
            newElements.push(firstElement);
          } else {
            const spans = splitSpan(firstElement, startIndex);
            
            stylizeSpan(spans[1], option, disableDelete);
            newElements.push(spans[1]);
            startContainer = spans[1];

            div.replaceChild(spans[0], firstElement);
            spans[0].after(spans[1]);
          }
          
          //Selected middle elements
          for(let i=1; i<elements.length-1; i++) {
            stylizeSpan(elements[i], option, disableDelete);
            newElements.push(elements[i]);
          }
          
          //Last selected element
          if(endIndex === selection.focusNode.textContent.length) {
            stylizeSpan(lastElement, option, disableDelete);
            endContainer = lastElement;
            endOffset = lastElement.innerHTML.length;
            newElements.push(lastElement);
          } else {
            const spans = splitSpan(lastElement, endIndex);
            
            stylizeSpan(spans[0], option, disableDelete);
            endContainer = spans[0];
            newElements.push(spans[0]);
            endOffset = spans[0].innerHTML.length;

            div.replaceChild(spans[0], lastElement);
            spans[0].after(spans[1]);
          }

          const prevSibling = newElements[0].previousSibling;
          const nextSibling = newElements[newElements.length-1].nextSibling;

          if(prevSibling && compareStyles(prevSibling.style, newElements[0].style)) {
            startOffset = prevSibling.innerHTML.length;
            newElements[0].innerHTML = `${prevSibling.innerHTML}${newElements[0].innerHTML}`;
            prevSibling.remove();
          }

          if(nextSibling && compareStyles(nextSibling.style, newElements[newElements.length-1].style)) {
            newElements[newElements.length-1].innerHTML = `${newElements[newElements.length-1].innerHTML}${nextSibling.innerHTML}`;
            nextSibling.remove();
          }

          let auxFirst = 0;
          for(let i=0; i<newElements.length-1; i++) {
            if(compareStyles(newElements[i].style, newElements[i+1].style)) {
              if(i === newElements.length-2)
                endOffset += newElements[i].innerHTML.length;

              if(i === auxFirst) {
                startContainer = newElements[i+1]
                auxFirst++;
              }

              newElements[i+1].innerHTML = `${newElements[i].innerHTML}${newElements[i+1].innerHTML}`;
              newElements[i].remove();
            }
          }

          const range = document.createRange();
          range.setStart(startContainer.firstChild, startOffset);
          range.setEnd(endContainer.firstChild, endOffset);

          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }

  const handleKeyDown = (event) => {
    const target = event.target;

    if(event.keyCode === 13) {
      event.preventDefault();

      const selection = window.getSelection();
      if(!selection.anchorNode.tagName) {
        if(selection.anchorNode.parentNode.tagName === 'DIV')
          return;
      }

      const newLine = document.createElement('div');
      newLine.contentEditable = true;
      newLine.onkeydown = (e) => handleKeyDown(e);
      newLine.onkeyup = (e) => handleKeyUp(e);
      newLine.onpaste = (e) => handlePaste(e);

      target.after(newLine);

      if(selection.anchorNode.tagName !== 'DIV') {
        const selectedSpan = selection.anchorNode.parentNode
        const div = selectedSpan.parentNode;
        const lastChild = div.childNodes[div.childNodes.length-1];
          
        if(!(selection.isCollapsed && selectedSpan === lastChild && selection.anchorOffset === lastChild.innerHTML.length)) {
          if(selection.isCollapsed && selectedSpan === div.firstChild && selection.anchorOffset === 0) {
            newLine.innerHTML = div.innerHTML;
            div.childNodes.forEach(span => span.remove());
          } else {
            let spans = splitSpan(selectedSpan, selection.anchorOffset);
            let sibling = selectedSpan.nextSibling;

            div.replaceChild(spans[0], selectedSpan);
            newLine.appendChild(spans[1].cloneNode(true));

            let aux;
            while(sibling) {
              newLine.appendChild(sibling.cloneNode(true));

              aux = sibling;
              sibling = sibling.nextSibling;
              aux.remove();
            }
          }
        }
      }
      newLine.focus();
    } else if(event.keyCode === 8) {
       if(!target.innerHTML && target.parentNode.childElementCount > 1) {
        event.preventDefault();

        let sibling;
        if(target.previousSibling)
          sibling = target.previousSibling;
        else
          sibling = target.nextSibling;

        sibling.focus();
        target.remove();

        const range = document.createRange();
        const selection = window.getSelection();

        range.selectNode(sibling);
        range.collapse();
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        const selection = window.getSelection();
        const div = selection.anchorNode.parentNode.parentNode;
        
        if(selection.isCollapsed && selection.anchorNode.parentNode === div.firstChild && selection.anchorOffset === 0) {
          const prevSibling = div.previousSibling;
          if(prevSibling) {
            event.preventDefault();

            const spans = div.children;
            const prevLastChild = prevSibling.childNodes[prevSibling.childNodes.length-1];

            let i = 0;
            if(spans[0] && compareStyles(spans[0].style, prevLastChild.style)) {
              i = 1;
              prevLastChild.innerHTML = `${prevLastChild.innerHTML}${spans[0].innerHTML}`;
            }

            for(; i<spans.length; i++) {
              prevSibling.appendChild(spans[i].cloneNode(true));
            };
            div.remove();
          }
        }
      }
    } else {
      if(target.innerHTML.length === 1) {
        const selection = window.getSelection();
        const range = document.createRange();
        
        const span = document.createElement('span');
        range.selectNode(selection.anchorNode);
        range.surroundContents(span);

        range.selectNode(span);
        range.collapse();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  const handleKeyUp = (event) => {
    const target = event.target;

    if(event.keyCode === 8) {
      if(target.firstChild.tagName === 'BR') {
        target.innerHTML = '';
      }
    }

    if(target.innerHTML.length > 0 && target.innerHTML.length <= 2) {
      const span = document.createElement('span');
      const range = document.createRange();
      const selection = window.getSelection();
      
      range.selectNode(target.childNodes[0]);
      range.surroundContents(span);

      range.selectNode(span);
      range.collapse();
      selection.removeAllRanges();
      selection.addRange(range);

      span.focus();
    }
  }

  const handlePaste = (event) => {
    event.preventDefault();

    const selection = window.getSelection();
    const data = event.clipboardData.getData('text');
    const span = document.createElement('span');

    span.innerHTML = data;

    if(selection.anchorNode.tagName === 'DIV') {
      selection.anchorNode.appendChild(span);

      const range = document.createRange();
      range.selectNode(span);
      range.collapse();

      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      if(selection.isCollapsed) {
        const selectedSpan = selection.anchorNode.parentNode;
        const anchorOffset = selection.anchorOffset;

        selectedSpan.innerHTML = `${selectedSpan.innerHTML.slice(0, anchorOffset)}${data}${selectedSpan.innerHTML.slice(selection.anchorOffset, selectedSpan.innerHTML.length)}`;
      
        const range = document.createRange();
        range.setStart(selectedSpan.firstChild, 0);
        range.setEnd(selectedSpan.firstChild, anchorOffset+data.length);
        range.collapse();

        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        let startIndex;
        let endIndex;
        
        let firstElement;
        let lastElement;
        
        if(checkSelectDir(selection)) {
          startIndex = selection.anchorOffset;
          endIndex = selection.focusOffset;
          
          firstElement = selection.anchorNode.parentNode;
          lastElement = selection.focusNode.parentNode;
        } else {
          startIndex = selection.focusOffset;
          endIndex = selection.anchorOffset;
          
          firstElement = selection.focusNode.parentNode;
          lastElement = selection.anchorNode.parentNode;
        }

        const div = firstElement.parentNode;
        let sibling = firstElement.nextSibling;

        firstElement.innerHTML = `${firstElement.innerHTML.slice(0, startIndex)}${data}`;

        let aux;
        while(sibling && sibling !== lastElement) {
          aux = sibling;
          sibling = sibling.nextSibling;
          aux.remove();
        }

        if(endIndex === lastElement.innerHTML.length)
          lastElement.remove();
        else
          lastElement.innerHTML = `${lastElement.innerHTML.slice(endIndex, lastElement.innerHTML.length)}`;
      
        const range = document.createRange();
        range.setStart(firstElement.firstChild, 0);
        range.setEnd(firstElement.firstChild, startIndex+data.length);
        range.collapse();

        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  return (
    <PageContainer>
      <MainContainer>
        <Menu onMenuClick={handleMenuClick}/>
          <Content id='content_wrapper'>
            <div 
              contentEditable={true} 
              onKeyDown={(e) => handleKeyDown(e)} 
              onKeyUp={(e) => handleKeyUp(e)} 
              onPaste={(e) => handlePaste(e)}
            />
          </Content>
      </MainContainer>
        </PageContainer>
    );
}