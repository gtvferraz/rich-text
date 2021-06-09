import { useEffect, useState } from 'react';
import styled from 'styled-components'

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    cursor: text;
    height: 100%;
    margin-top: 2rem;

    &:focus {
        outline: none;
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

export const Content = () => {
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
        }
    }, [content]);

    const handleKeyDownContainer = (event) => {
        if(event.keyCode === 37) {
            if(document.getElementById(`row_${currentLine}`).selectionStart === 0)
                event.preventDefault();
        } else if(event.keyCode === 38) {
            event.preventDefault();
        } else if(event.keyCode === 39) {
            const input = document.getElementById(`row_${currentLine}`);
            if(input.selectionStart === input.value.length)
                event.preventDefault();
        } else if(event.keyCode === 40) {
            event.preventDefault();
        }
    }

    const handleKeyDownInput = (event, index) => { 
        if(selectionStart !== -1 && event.keyCode !== 38 && event.keyCode !== 40)
            setSelectionStart(-1);

        if(event.keyCode === 8) { //BACKSPACE
            if(content[index] === '') {
                let i;
                let prevContent = [...content];
                for(i=index; i<content.length-1; i++)
                    prevContent[i] = content[i+1];
                prevContent.pop();

                if(index > 0) {
                    document.getElementById(`row_${index-1}`).focus();
                    setCurrentLine(index-1);
                }
                setContent(prevContent);
                setCountLines(countLines-1);
                setContentStatus((prevStatus) => ({
                    ...prevStatus,
                    removeLine: true
                }));
            }
        } else if(event.keyCode === 13) { //ENTER
            let prevContent = [...content];
            prevContent.push('');

            if(currentLine !== prevContent.length-2) {
                let i;
                for(i=prevContent.length-1; i>currentLine; i--) {
                    prevContent[i] = prevContent[i-1];
                }
                prevContent[currentLine+1] = '';
            }

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
            if(event.target.selectionStart === event.target.value.length && index < countLines-1) {
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

    const handleChange = (event, index) => {
        if(!contentStatus.removeLine) {
            let prevContent = [...content];
            prevContent[index] = event.target.value;
            setContent(prevContent);
        } else {
            setContentStatus((prevStatus) => ({
                ...prevStatus,
                removeLine: false
            }));
        }
    }

    const title = () => {
        console.log("Titulo");
    }

    return (
        <ContentContainer tabIndex='0' onClick={() => handleClickContainer()} onKeyDown={(event) => handleKeyDownContainer(event)}>
        {content.map((row, index) => {
            return <Input id={`row_${index}`} key={`row_${index}`} type='text' autoComplete='off' value={row} 
                onClick={(event) => handleClickInput(event, index)} onChange={(event) => handleChange(event, index)} onKeyDown={(event) => handleKeyDownInput(event, index)}/>
        })}
        </ContentContainer>
    );
}

export default Content;