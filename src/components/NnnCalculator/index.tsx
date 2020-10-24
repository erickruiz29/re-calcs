import React from 'react';
import {Content, InputGroupType, InputWrapper} from "../ui/Input/styles";
import {ObjectType} from "../../helpers/definitions";
import {InputLabelGroup} from "../ui/Input";
import {Container} from "../ui/Container/styles";
import * as Styled from '../ui/Input/styles'
import {Button} from "../ui/Button/styles";
import TitleSection from "../ui/TitleSection";
import {Link} from "gatsby";

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

class BuildingDimensions {
    totalSize: number = 1000
    rentedSize: number = 1000
    unitSelect: BuildingSizeUnit = BuildingSizeUnit.squareFeet
}

class RentFacts {
    leaseStartDate?: Date = new Date()
    startRent: number = 0
    startRentType: RentType = RentType.perSqFt
    escalationFreqInMonths: number = 12
    escalationAmt: number = 0.3
    escalationType: EscalationType = EscalationType.percentage
    termLengthInMonths: number = 12
}

class Incentives {
    incentiveType: IncentiveType = IncentiveType.freeRent;
    discountPercent: number = 0.0
    discountMonths: number = 0
    escalationOption: EscalationOption = EscalationOption.option1
}

class Commissions {
    listingCommision: number = 0.0
    procuringCommission: number = 0.0
}

class TenantImprovementAllowance {
    tiaType: TIAType = TIAType.perSqFt
    tiaAmount: number = 0
}

class CalculatorInputs {
    bldgDims = new BuildingDimensions()
    rentEntryFreq = RentEntryFreq.monthly
    rentFacts = new RentFacts()
    incentives = new Incentives()
    commissions = new Commissions()
    tia = new TenantImprovementAllowance()
}

const getJsxFromObject = (obj: ObjectType): JSX.Element => {
    const buffer:JSX.Element[] = [];

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            const el = getElementFromVar(prop, obj[prop])
            if (el !== null) {
                buffer.push(el);
            }
        }
    }

    return (<>{buffer}</>);
}

const getElementFromVar = (name: string, part: Object | undefined): JSX.Element | null => {
    console.log(`${name}: ${part}`)
    if (part === undefined) {
        return null;
    }
    switch (typeof part) {
        case "number":
            return (<InputLabelGroup labelText={name} inputGroupSize={InputGroupType.half} type={"text"} placeholder={(part as number).toString()}></InputLabelGroup>)
        case "string":
            return (<InputLabelGroup labelText={name} inputGroupSize={InputGroupType.half} type={"text"} placeholder={part as string}></InputLabelGroup>);
        case "object":
            return getJsxFromObject(part);
    }
    return null;
}

// Adding this as an example of how to create a class component
export class NnnCalculator extends React.PureComponent {
    private output = React.createRef<HTMLDivElement>();
    private element: JSX.Element;
    private inputs: JSX.Element;

    constructor(public props: Props) {
        super(props);
        const calcInputs = new CalculatorInputs()
        this.inputs = getJsxFromObject(calcInputs);

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
