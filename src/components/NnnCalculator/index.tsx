import React from 'react';
import * as Styled from "../ui/Input/styles";
import {Content, InputGroupType, InputWrapper} from "../ui/Input/styles";
import {ObjectType} from "../../helpers/definitions";
import {Container} from "../ui/Container/styles";
import {Button} from "../ui/Button/styles";
import TitleSection from "../ui/TitleSection";
import {Link} from "gatsby";

interface Props {
    calcName: string;
}

enum BuildingSizeUnit {
    squareFeet = "Square Feet",
    squareMeters = "Square Meters"
}

enum RentEntryFreq {
    monthly = "Monthly",
    yearly = "Yearly"
}

enum RentType {
    perSqFt = "Per Square Foot",
    perMonth = "A Month"
}

enum EscalationType {
    percentage= "Percentage",
    fixed = "Fixed"
}

enum TIAType {
    perSqFt= "Per Square Foot",
    fixed = "Dollar Amount"
}

// TODO Needs better naming/description for options
enum EscalationOption {
    option1 = "Option 1",
    option2 = "Option 2",
    option3 = "Option 3"
}

enum IncentiveType {
    freeRent = "Free Rent",
    discount = "Discount"
}

class InputClassObj {
}

class BuildingDimensions implements InputClassObj {
    unitSelect: BuildingSizeUnit = BuildingSizeUnit.squareFeet
    totalSize: InputElObj = new InputElObj(`Size of Property (${this.unitSelect})`, "totalSize", "10000");
    rentedSize: InputElObj = new InputElObj(`Amount Renting (${this.unitSelect})`, "rentedSize", "1000");
}

class RentFacts implements InputClassObj {
    leaseStartDate?: Date = new Date() // TODO implement date selector
    initialRent: InputElObj = new InputElObj("Initial Rent", "initialRent", "12");
    rentType: RentType = RentType.perSqFt
    escalationFreqInMonths: InputElObj = new InputElObj("Escalation Frequency In Months", "escalationFreqInMonths", "12");
    escalationAmt: InputElObj = new InputElObj("Escalation Amount", "escalationAmt", "0.3");
    escalationType: EscalationType = EscalationType.percentage
    termLengthInMonths: InputElObj = new InputElObj("Term Length In Months", "termLengthInMonths", "12");
}

class Incentives implements InputClassObj {
    incentiveType: IncentiveType = IncentiveType.freeRent; // TODO implement dropdown
    discountPercent: InputElObj = new InputElObj("Discount Percent", "discountPercent", "100");
    discountLength: InputElObj = new InputElObj("Discount Length", "discountLength", "1");
    escalationOption: EscalationOption = EscalationOption.option1 // TODO implement dropdown
}

class Commissions implements InputClassObj {
    listingCommision: InputElObj = new InputElObj("Listing Commission", "listingCommission", "2.5");
    procuringCommission: InputElObj = new InputElObj("Procuring Commission", "procuringCommission", "2.5");
}

class TenantImprovementAllowance implements InputClassObj {
    tiaType: TIAType = TIAType.perSqFt
    tia: InputElObj = new InputElObj(`Tenant Improvement Allowance (${this.tiaType})`, "tia", "5.00");
}

class CalculatorInputs {
    bldgDims: InputClassObj = new BuildingDimensions()
    rentEntryFreq = RentEntryFreq.monthly
    rentFacts: InputClassObj = new RentFacts()
    incentives: InputClassObj = new Incentives()
    commissions: InputClassObj= new Commissions()
    tia: InputClassObj = new TenantImprovementAllowance()
}

enum InputType {
    text = "text",
    select = "select",
    slider = "slider"
}

class InputElObj  {
    displayName: string = ""
    id: string = ""
    inputType: InputType = InputType.text
    validationFn: () => void = () => {}
    placeholder: string = ""
    defaultValue: string = ""
    inputSize: InputGroupType = InputGroupType.half
    inputRef: React.RefObject<HTMLInputElement> | null = null

    constructor(displayName: string, id:string, defaultValue?: string, placeholder?: string, inputType?: InputType, inputSize?: InputGroupType, inputRef?: React.RefObject<HTMLInputElement>) {
        this.displayName = displayName;
        this.id = id;
        this.defaultValue = defaultValue !== undefined ? defaultValue : this.defaultValue;
        this.inputType = inputType !== undefined ? inputType : this.inputType;
        this.placeholder = placeholder !== undefined ? placeholder : this.placeholder;
        this.inputSize = inputSize !== undefined ? inputSize : this.inputSize;
        this.inputRef = inputRef !== undefined ? inputRef : this.inputRef;
    }
}

class InputGroup extends React.PureComponent {
    private placeholder: string;
    private defaultValue: string;
    private displayName: string;
    private id: string;
    private inputType: InputType;
    private inputSize: InputGroupType;
    private inputRef: React.RefObject<HTMLInputElement> | null;

    constructor(props: InputElObj) {
        super(props);
        this.displayName = props.displayName
        this.id = props.id
        this.inputType = props.inputType
        this.validationFn = props.validationFn
        this.placeholder = props.placeholder
        this.defaultValue = props.defaultValue
        this.inputSize = props.inputSize !== undefined ? props.inputSize : InputGroupType.full
        this.inputRef = props.inputRef
    }

    validationFn(): void {}

    render(): React.ReactNode {
        return (
            <Styled.InputGroup inputGroupType={this.inputSize}>
                <Styled.Label>
                    {this.displayName}
                </Styled.Label>
                <Styled.Input id={this.id} type={this.inputType} ref={this.inputRef} placeholder={this.placeholder} onChange={() => {this.validationFn()}} value={this.defaultValue} />
            </Styled.InputGroup>
        );
    }
}

const getInputJsxFromObject = (obj: InputClassObj | InputElObj | ObjectType): JSX.Element[] => {
    const buffer:JSX.Element[] = [];

    for (let val of Object.values(obj)) {
        if ((val as InputElObj).displayName !== undefined) {
            buffer.push(getInputJsx(val as InputElObj));
        } else {
            let inputObj: InputClassObj | undefined = undefined

            try {
                inputObj = val as InputClassObj
            } catch (e) {}

            if (inputObj !== undefined && typeof(inputObj) === "object") {
                buffer.push(...getInputJsxFromObject(inputObj));
            }
        }
    }

    return (buffer);
}

const getInputJsx = (props: InputElObj): JSX.Element => {
    return (<InputGroup key={`inputGroup_${props.id}`} {...props}/>)
}

// Adding this as an example of how to create a class component
export class NnnCalculator extends React.PureComponent {
    private output = React.createRef<HTMLDivElement>();
    private element: JSX.Element;
    private inputs: JSX.Element[];

    constructor(public props: Props) {
        super(props);
        const calcInputs = new CalculatorInputs()
        this.inputs = getInputJsxFromObject(calcInputs);

        this.element = (<Container section={false}>
            <TitleSection title={"Real Estate Calculator"} subtitle={this.props.calcName} />
            <Content>
                <InputWrapper>
                    {this.inputs}
                </InputWrapper>
                <span ref={this.output} style={{display: "block"}}> </span>

                <Link to={"#"} onClick={(ev) => { ev.preventDefault(); this.submitFn() }}>
                    <Button primary>{"Calculator"}</Button>
                </Link>
            </Content>
        </Container>);
    }

    // Anything in this function happens after the Elements are added to the DOM
    // i.e. the refs are added to `input1`, `input2`, ect.
    componentDidMount() {
        this.init()
    }

    addOnInputListener(ref: React.RefObject<HTMLInputElement>): void {
    }

    init(): void {
    }

    submitFn = () => {
        if (this.output.current !== null) {
            this.output.current.innerText = ""
        }
    }

    // Need render function in order for class component to work
    render() {
        return this.element
    }
}
