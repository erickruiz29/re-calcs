import React from 'react';
import TitleSection from "../ui/TitleSection";
import * as Styled from "../ui/Banner/styles";
import Container from "../ui/Container";
import Button from "../ui/Button";
import {Link} from "gatsby";

interface Props {
    calcName: string;
}

const input1 = React.createRef<HTMLInputElement>();
const input2 = React.createRef<HTMLInputElement>();
const input3 = React.createRef<HTMLInputElement>();
const output = React.createRef<HTMLDivElement>();

const submitFn = () => {
    if (output.current !== null) {
        output.current.innerText = ""
        if (input1.current?.value.trim() === "") {
            output.current.innerText += "Input 1 is empty\n"
        }
        if (input2.current?.value.trim() === "") {
            output.current.innerText += "Input 2 is empty\n"
        }
        if (input3.current?.value.trim() === "") {
            output.current.innerText += "Input 3 is empty\n"
        }
        if (output.current.innerText === "") {
            output.current.innerText = `${input1.current?.value} ${input2.current?.value} ${input3.current?.value}`
        }
    }
}

const NnnCalculator: React.FC<Props> = ({ calcName }) => (
    <Container section>
        <TitleSection title={"Real Estate Calculator"} subtitle={calcName} />
        <Styled.Content>
            <Styled.Input ref={input1} type={"text"}/>
            <Styled.Input ref={input2} type={"text"}/>
            <Styled.Input ref={input3} type={"text"}/>
            <div ref={output}></div>

            <Link to={"#"} onClick={(ev) => { ev.preventDefault(); submitFn() }}>
                <Button primary>{"Calculator"}</Button>
            </Link>
        </Styled.Content>
    </Container>
);

export default NnnCalculator;
