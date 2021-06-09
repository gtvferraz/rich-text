import styled from 'styled-components'

import TitleIcon from "../../assets/icons/title.svg";
import BoldIcon from "../../assets/icons/bold.svg";
import ItalicIcon from "../../assets/icons/italic.svg";
import CodeIcon from "../../assets/icons/code.svg";
import ItemizeIcon from "../../assets/icons/itemize.svg";
import UnderlineIcon from "../../assets/icons/underline.svg";
import QuotesIcon from "../../assets/icons/quotes.svg";
import LinkIcon from "../../assets/icons/link.svg";

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

export default Menu;