import styled from 'styled-components'
import Menu from '../src/components/Menu'

const Page_Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
`

const Main_container = styled.div`
  width: 840px;
  height: 50vh;
  margin-top: 5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px -10px black;

  @media only screen and (max-width: 1050px) {
    width: calc(80vw - 2rem);
  }
`

export default function Home() {
  return (
    <Page_Container>
      <Main_container>
        <Menu />
      </Main_container>
    </Page_Container>
  );
}
