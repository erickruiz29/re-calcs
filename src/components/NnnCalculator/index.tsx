import React from 'react';
import TitleSection from "../ui/TitleSection";
import * as Styled from "../ui/Banner/styles";
import Container from "../ui/Container";
import Button from "../ui/Button";
import {Link} from "gatsby";

interface Props {
    calcName: string;
}

// Adding this as an example of how to create a class component
export class NnnCalculator extends React.PureComponent {
    private input1 = React.createRef<HTMLInputElement>();
    private input2 = React.createRef<HTMLInputElement>();
    private input3 = React.createRef<HTMLInputElement>();
    private output = React.createRef<HTMLDivElement>();
    private element: JSX.Element;

    constructor(public props: Props) {
        super(props);

        this.element = (<Container section>
            <TitleSection title={"Real Estate Calculator"} subtitle={this.props.calcName} />
            <Styled.Content>
                <Styled.Input ref={this.input1} type={"text"}/>
                <Styled.Input ref={this.input2} type={"text"}/>
                <Styled.Input ref={this.input3} type={"text"}/>
                <span ref={this.output} style={{display: "block"}}> </span>

                <Link to={"#"} onClick={(ev) => { ev.preventDefault(); this.submitFn() }}>
                    <Button primary>{"Calculator"}</Button>
                </Link>
            </Styled.Content>
        </Container>);
    }

    // Anything in this function happens after the Elements are added to the DOM
    // i.e. the refs are added to `input1`, `input2`, ect.
    componentDidMount() {
        this.init()
    }

    addOnInputListener(ref: React.RefObject<HTMLInputElement>): void {
        if (ref.current !== null && ref.current.oninput === null) {
            ref.current.oninput = () => { this.submitFn() }
        }
    }

    init(): void {
        this.addOnInputListener(this.input1)
        this.addOnInputListener(this.input2)
        this.addOnInputListener(this.input3)
    }

    submitFn = () => {
        if (this.output.current !== null) {
            this.output.current.innerText = ""
            if (this.input1.current?.value.trim() === "") {
                this.output.current.innerText += "Input 1 is empty\n"
            }
            if (this.input2.current?.value.trim() === "") {
                this.output.current.innerText += "Input 2 is empty\n"
            }
            if (this.input3.current?.value.trim() === "") {
                this.output.current.innerText += "Input 3 is empty\n"
            }
            if (this.output.current.innerText === "") {
                this.output.current.innerText = `${this.input1.current?.value} ${this.input2.current?.value} ${this.input3.current?.value}`
            }
        }
    }

    // Need render function in order for class component to work
    render() {
        return this.element
    }
}
