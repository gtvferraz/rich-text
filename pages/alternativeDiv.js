import styled from 'styled-components'
import { useEffect, useState } from 'react';

//import Menu from '../src/components/Menu'
//import Content from '../src/components/Content'

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

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    cursor: text;
    height: 100%;
    margin-top: 2rem;

    &:focus {
        outline: none;
    }

    .paragraph {
        height: 1.2rem;
        border: 0;
        padding: 0;
        font-size: 1rem;
        line-height: 1.2rem;
        text-indent: 1rem;
        font-family: 'Roboto', sans-serif;

        &:focus {
            outline: none;
        }
    }
`;

const Paragraph = styled.p`
    min-height: 1.2rem;
    margin: 0;
    padding: 0;
    text-indent: 1rem;
    line-height: 1.2rem;
    overflow-wrap: break-word;
    font-family: 'Roboto', sans-serif;
`;

const Input = styled.input`
    height: 1.2rem;
    border: 0;
    padding: 0;
    font-size: 1rem;
    line-height: 1.2rem;
    text-indent: 1rem;
    font-family: 'Roboto', sans-serif;

    &:focus {
        outline: none;
    }
`;

export const Menu = (props) => {
    const options = {
        title: 0
    }

    const handleClick = (option) => {
        props.onMenuClick(option);
    }

    return (
        <MenuContainer>
            <TitleIcon onClick={(event) => handleClick(options.title)}/>
            <BoldIcon />
            <ItalicIcon />
            <CodeIcon />
            <ItemizeIcon />
            <UnderlineIcon />
            <QuotesIcon />
            <LinkIcon />
        </MenuContainer>
    );
}

export default function Home() {
    const [content, setContent] = useState(['']);
    const [currentLine, setCurrentLine] = useState(0);
    const [countLines, setCountLines] = useState(1);
    const [selectionStart, setSelectionStart] = useState(-1);
    const [contentStatus, setContentStatus] = useState({
        breakLine: false,
        removeLine: false
    });

    useEffect(() => {
        document.getElementById(`row_0`).focus();
    }, []);

    useEffect(() => {
        if(contentStatus.breakLine) {
            document.getElementById(`row_${currentLine}`).focus();
            setContentStatus((prevStatus) => ({
                ...prevStatus,
                breakLine: false
            }));
            console.log(content);
            content.forEach((element, index) => {
                document.getElementById(`row_${index}`).innerHTML = element;
            })
        }

    }, [content]);

    const handleKeyDownContainer = (event) => {
        if(event.keyCode === 13) {
            event.preventDefault();
        } else if(event.keyCode === 37) {
            if(document.getElementById(`row_${currentLine}`).selectionStart === 0)
                event.preventDefault();
        } else if(event.keyCode === 38) {
            event.preventDefault();
        } else if(event.keyCode === 39) {
            const input = document.getElementById(`row_${currentLine}`);
            if(input.selectionStart === input.innerHTML.length)
                event.preventDefault();
        } else if(event.keyCode === 40) {
            event.preventDefault();
        }
    }

    const handleKeyDownInput = (event, index) => { 
        if(selectionStart !== -1 && event.keyCode !== 38 && event.keyCode !== 40)
            setSelectionStart(-1);

        if(event.keyCode === 8) { //BACKSPACE
            if(countLines > 1 && document.getElementById(`row_${index}`).selectionStart === 0) {
                let i;
                let prevContent = [...content];

                if(index > 0)
                prevContent[index-1] = prevContent[index-1].concat(prevContent[index]);

                for(i=index; i<content.length-1; i++)
                    prevContent[i] = content[i+1];
                prevContent.pop();

                if(index > 0) {
                    document.getElementById(`row_${index-1}`).focus();
                    setCurrentLine(index-1);
                }
                
                setCountLines(countLines-1);
                setContent(prevContent);
                setContentStatus((prevStatus) => ({
                    ...prevStatus,
                    removeLine: true
                }));
            }
        } else if(event.keyCode === 13) { //ENTER
            let prevContent = [...content];
            prevContent.push('');

            let i;
            for(i=prevContent.length-1; i>index; i--) {
                prevContent[i] = prevContent[i-1];
            }
            let inputSelectionStart = document.getElementById(`row_${index}`).selectionStart;
            console.log(inputSelectionStart);
            if(inputSelectionStart < content[index].length) {
                prevContent[index] = content[index].slice(0, inputSelectionStart);
                prevContent[index+1] = content[index].slice(inputSelectionStart, content[index].length);
            }
            else
                prevContent[index+1] = '';

            setContent(prevContent);
            setCountLines(countLines+1)
            setCurrentLine(currentLine+1); 
            setContentStatus((prevStatus) => ({
                ...prevStatus,
                breakLine: true
            }));
        } else if(event.keyCode === 37) { //LEFT ARROW
            if(event.target.selectionStart === 0 && index > 0) {
                const previousInput = document.getElementById(`row_${index-1}`);
                previousInput.focus();
                previousInput.selectionStart = content[index-1].length;
                previousInput.selectionEnd = content[index-1].length;
                setCurrentLine(index-1);
            }
        } else if(event.keyCode === 38) { //UP ARROW
            if(index > 0) {
                const previousInput = document.getElementById(`row_${index-1}`);
                previousInput.focus();
                if(selectionStart === -1) {
                    const currentStart = document.getElementById(`row_${index}`).selectionStart;
                    previousInput.selectionStart = currentStart;
                    previousInput.selectionEnd = currentStart;
                    setSelectionStart(currentStart);
                } else {
                    previousInput.selectionStart = selectionStart;
                    previousInput.selectionEnd = selectionStart;
                }
                setCurrentLine(index-1);
            }
        } else if(event.keyCode === 39) { //RIGHT ARROW
            if(event.target.selectionStart === event.target.innerHTML.length && index < countLines-1) {
                const nextInput = document.getElementById(`row_${index+1}`);
                nextInput.focus();
                nextInput.selectionStart = 0;
                nextInput.selectionEnd = 0;
                setCurrentLine(index+1);
            }
        } else if(event.keyCode === 40) { //DOWN ARROW
            if(index < countLines-1) {
                const nextInput = document.getElementById(`row_${index+1}`);
                nextInput.focus();
                if(selectionStart === -1) {
                    const currentStart = document.getElementById(`row_${index}`).selectionStart;
                    nextInput.selectionStart = currentStart;
                    nextInput.selectionEnd = currentStart;
                    setSelectionStart(currentStart);
                } else {
                    nextInput.selectionStart = selectionStart;
                    nextInput.selectionEnd = selectionStart;
                }
                setCurrentLine(index+1);
            }
        }
    }

    const handleClickInput = (event, index) => {
        event.stopPropagation();
        setCurrentLine(index);

        if(selectionStart !== -1 && event.keyCode !== 38)
            setSelectionStart(-1);
    }

    const handleClickContainer = () => {
        setCurrentLine(countLines-1);
        document.getElementById(`row_${countLines-1}`).focus();

        if(selectionStart !== -1 && event.keyCode !== 38)
            setSelectionStart(-1);
    }

    const handleKeyUp = (event, index) => {
        if(!contentStatus.removeLine) {
            let prevContent = [...content];
            prevContent[index] = event.target.innerHTML;
            setContent(prevContent);
        } else {
            setContentStatus((prevStatus) => ({
                ...prevStatus,
                removeLine: false
            }));
        }
    }

    const onMenuClick = (option) => {
        console.log(option);
    }

    return (
        <PageContainer>
            <MainContainer>
                <Menu onMenuClick={onMenuClick}/>
                <ContentContainer tabIndex='0' onClick={() => handleClickContainer()} onKeyDown={(event) => handleKeyDownContainer(event)}>
                    {content.map((row, index) => {
                        return <div id={`row_${index}`} class='paragraph' key={`row_${index}`} contentEditable='true' type='text' autoComplete='off' onClick={(event) => handleClickInput(event, index)} onKeyUp={(event) => handleKeyUp(event, index)} onKeyDown={(event) => handleKeyDownInput(event, index)} />
                    })}
                </ContentContainer>
            </MainContainer>
        </PageContainer>
    );
}
