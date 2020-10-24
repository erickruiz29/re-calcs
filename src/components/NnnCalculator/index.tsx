import React from 'react';
import TitleSection from "../ui/TitleSection";
import * as Styled from "../ui/Input/styles";
import {InputGroupType, InputWrapper} from "../ui/Input/styles";
import Container from "../ui/Container";
import Button from "../ui/Button";
import {Link} from "gatsby";
import TextInput from "../ui/Input";

interface Props {
    calcName: string;
}

/* This is commented out because it will be for future use, but adding in now for visibility
interface ExcelTabs {
    basicInfo: BasicInfo
    baseRent: BaseRent
    rentIncentives: RentIncentives
    rentTable: rentTable
    expenses: Expenses
    commissions: Commissions
    tenantImprovementAllowance: TenantImprovementAllowance
    leaseAnalysis: leaseAnalysis
}
 */
enum BuildingSizeUnit {
    squareFeet = 0,
    squareMeters = 1
}

enum RentEntryFreq {
    monthly = 0,
    yearly = 1
}

enum RentType {
    perSqFt = 0,
    perMonth = 1
}

enum EscalationType {
    percentage,
    fixed
}

enum TIAType {
    perSqFt,
    fixed
}

// TODO Needs better naming/description for options
enum EscalationOption {
    option1 = "Option 1",
    option2 = "Option 2",
    option3 = "Option 3"
}

enum IncentiveType {
    freeRent,
    discount
}

interface BuildingDimensions {
    totalSize: number
    rentedSize: number
    unitSelect: BuildingSizeUnit
}

interface RentFacts {
    leaseStartDate?: Date
    startRent: number
    startRentType: RentType
    escalationFreqInMonths: number
    escalationAmt: number
    escalationType: EscalationType
    termLengthInMonths: number
}

interface Incentives {
    incentiveType: IncentiveType
    discountPercent: number
    discountMonths: number
    escalationOption: EscalationOption
}

interface Commissions {
    listingCommision: number
    procuringCommission: number
}

interface TenantImprovementAllowance {
    tiaType: TIAType
    tiaAmount: number
}

interface CalculatorInputs {
    bldgDims: BuildingDimensions
    rentEntryFreq: RentEntryFreq
    rentFacts: RentFacts
    incentives: Incentives
    commissions: Commissions
    tia: TenantImprovementAllowance
}

/*const getJsxFromObject = (obj: Object): JSX.Element {
    let jsx = (<> </>)
    for (const key in Object.keys(obj)) {
        getElementFromVar(key, obj[key])
    }
}

const getElementFromVar = (name: string, part: Object): JSX.Element {
    switch (typeof part) {
        case "number":
            return <TextInput labelText={} inputGroupSize={}
            break;
    }
}*/

// Adding this as an example of how to create a class component
export class NnnCalculator extends React.PureComponent {
    private input1 = React.createRef<HTMLInputElement>();
    private input2 = React.createRef<HTMLInputElement>();
    private input3 = React.createRef<HTMLInputElement>();
    private input4 = React.createRef<HTMLInputElement>();
    private output = React.createRef<HTMLDivElement>();
    private element: JSX.Element;

    constructor(public props: Props) {
        super(props);

        this.element = (<Container section={false}>
            <TitleSection title={"Real Estate Calculator"} subtitle={this.props.calcName} />
            <Styled.Content>
                <InputWrapper>
                    <TextInput labelText={"First Input"} inputRef={this.input1} inputGroupSize={InputGroupType.half}> </TextInput>
                    <TextInput labelText={"Second Input"} inputRef={this.input2} inputGroupSize={InputGroupType.half}> </TextInput>
                    <TextInput labelText={"Third Input"} inputRef={this.input3} inputGroupSize={InputGroupType.half}> </TextInput>
                    <TextInput labelText={"Fourth Input"} inputRef={this.input4} inputGroupSize={InputGroupType.half}> </TextInput>
                </InputWrapper>
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
        this.addOnInputListener(this.input4)
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
