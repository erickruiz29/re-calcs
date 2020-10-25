import React, {FormEvent, useState} from 'react';
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
    perSqFt = "$/Sq.Ft.",
    perMonth = "$/Month",
    perSqMeter = "$/Sq.Meter",
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
/*
class InputClassObj {
}
class BuildingDimensions implements InputClassObj {
}
class RentFacts implements InputClassObj {
}
class Incentives implements InputClassObj {
}
class Commissions implements InputClassObj {
}
class TenantImprovementAllowance implements InputClassObj {
}*/

class RentData {
    periodTo: number | Date = 1
    periodFrom: number | Date = 1
    monthsLength: number = 1
    monthlyBaseRent: number = 0.0
    monthlyRentPerSqFt: number = 0.0
    totalRentPerPeriod: number = 0.0
}

class NnnCalculatorInputs {
    unitSelect: BuildingSizeUnit = BuildingSizeUnit.squareFeet
    totalSize: InputElObj = new InputElObj(`Size of Property (${this.unitSelect})`, "totalSize", "100000");
    rentedSize: InputElObj = new InputElObj(`Amount Renting (${this.unitSelect})`, "rentedSize", "10000");
    rentType: RentType = RentType.perSqFt
    leaseStartDate?: Date = new Date() // TODO implement date selector
    initialRent: InputElObj = new InputElObj(`Initial Rent (${this.rentType})`, "initialRent", "1.00");
    escalationFreqInMonths: InputElObj = new InputElObj("Escalation Frequency In Months", "escalationFreqInMonths", "12");
    escalationAmt: InputElObj = new InputElObj("Escalation Amount", "escalationAmt", "1.03");
    escalationType: EscalationType = EscalationType.percentage
    termLengthInMonths: InputElObj = new InputElObj("Term Length In Months", "termLengthInMonths", "60");
    incentiveType: IncentiveType = IncentiveType.freeRent; // TODO implement dropdown
    discountPercent: InputElObj = new InputElObj("Discount Percent", "discountPercent", "100");
    discountLength: InputElObj = new InputElObj("Discount Length", "discountLength", "1");
    escalationOption: EscalationOption = EscalationOption.option1 // TODO implement dropdown
    listingCommision: InputElObj = new InputElObj("Listing Commission", "listingCommission", "2.5");
    procuringCommission: InputElObj = new InputElObj("Procuring Commission", "procuringCommission", "2.5");
    tiaType: TIAType = TIAType.perSqFt
    tia: InputElObj = new InputElObj(`Tenant Improvement Allowance (${this.tiaType})`, "tia", "5.00");

    getRentSchedule(): RentData[] {
        const data: RentData[] = [];

        // Rent discount is in the beginning
        if (this.escalationOption === EscalationOption.option1) {
            const curData = new RentData();
            let currentRentPerSqFt = parseInt(this.initialRent.getValue());
            const currentRentedSize = parseInt(this.rentedSize.getValue());
            const escalationAmount = parseFloat(this.escalationAmt.getValue());
            curData.periodFrom = 1
            curData.periodTo = parseInt(this.discountLength.getValue())
            curData.monthsLength = curData.periodFrom - curData.periodTo + 1
            curData.monthlyBaseRent = parseInt(this.initialRent.getValue());
            curData.monthlyRentPerSqFt = 0;
            curData.totalRentPerPeriod = 0;

            data.push(curData);

            let currentMonth = curData.periodTo + 1;

            while (currentMonth < parseInt(this.termLengthInMonths.getValue())) {
                const moreData = new RentData();
                // Coming from adding a discount; (1-0) % 12 == 0; 13-1 % 12 == 0; }=> start of a period
                if ((currentMonth - 1) % 12 !== 0) {
                    moreData.periodFrom = currentMonth;
                    moreData.periodTo = currentMonth + (12 - (currentMonth % 12));
                } else {
                    currentRentPerSqFt = this.escalationType === EscalationType.fixed ?
                                        currentRentPerSqFt + escalationAmount :
                                        currentRentPerSqFt * escalationAmount;

                    moreData.periodFrom = currentMonth;
                    moreData.periodTo = currentMonth + 11;
                }
                    moreData.monthsLength = moreData.periodTo - moreData.periodFrom + 1;
                    moreData.monthlyBaseRent = currentRentPerSqFt * currentRentedSize;
                    moreData.monthlyRentPerSqFt = currentRentPerSqFt;
                    moreData.totalRentPerPeriod = moreData.monthsLength * moreData.monthlyBaseRent;
                    data.push(moreData);
                currentMonth = moreData.periodTo + 1;
            }
        }
        return data;
    }
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
    inputRef: React.RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();
    value: string = ""

    constructor(displayName: string, id:string, defaultValue?: string, placeholder?: string, inputType?: InputType, inputSize?: InputGroupType, inputRef?: React.RefObject<HTMLInputElement>) {
        this.displayName = displayName;
        this.id = id;
        this.defaultValue = defaultValue !== undefined ? defaultValue : this.defaultValue;
        this.inputType = inputType !== undefined ? inputType : this.inputType;
        this.placeholder = placeholder !== undefined ? placeholder : this.placeholder;
        this.inputSize = inputSize !== undefined ? inputSize : this.inputSize;
        this.inputRef = inputRef !== undefined ? inputRef : this.inputRef;
    }

    public getValue(): string {
        this.validationFn()
        this.value = this.inputRef?.current?.value?? ""
        return this.value;
    }
}

interface InputGroupState {
    inputValue: string
}

class InputGroup extends React.PureComponent {
    private placeholder: string;
    private defaultValue: string;
    private displayName: string;
    private id: string;
    private inputType: InputType;
    private inputSize: InputGroupType;
    private inputRef: React.RefObject<HTMLInputElement> | null;
    state: InputGroupState

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
        this.state = {inputValue: this.defaultValue}
    }

    validationFn(): void {}

    componentDidMount() {
        this.setState({inputValue: this.defaultValue});
    }
    handleChange = (e: FormEvent<HTMLInputElement>) => {
        this.setState({inputValue: e.currentTarget.value});
    }

    onInputFn(ev:FormEvent<HTMLInputElement>): void {
        if (this.inputRef !== null && this.inputRef.current !== null) {
            console.log(`Input detected, shouldve updated`);
            this.inputRef.current.value = ev.currentTarget.value;
        } else {
            console.log(`Input detected, but inputRef is null`);
        }
    }

    render(): React.ReactNode {
        return (
            <Styled.InputGroup inputGroupType={this.inputSize}>
                <Styled.Label>
                    {this.displayName}
                </Styled.Label>
                <Styled.Input id={this.id} type={this.inputType} ref={this.inputRef} placeholder={this.placeholder} onChange={() => {this.validationFn()}}
                              onInput={(ev:FormEvent<HTMLInputElement>) => { this.handleChange(ev) }} value={this.state.inputValue} />
            </Styled.InputGroup>
        );
    }
}

const getInputJsxFromObject = (obj: InputElObj | ObjectType): JSX.Element[] => {
    const buffer:JSX.Element[] = [];

    for (let val of Object.values(obj)) {
        if ((val as InputElObj).displayName !== undefined) {
            buffer.push(getInputJsx(val as InputElObj));
        }
    }

    return (buffer);
}

const getInputJsx = (props: InputElObj): JSX.Element => {
    return (<InputGroup key={`inputGroup_${props.id}`} {...props}/>)
}

interface NnnCalcState {
    preparedOutput: JSX.Element
}

// Adding this as an example of how to create a class component
export class NnnCalculator extends React.Component {
    private output = React.createRef<HTMLDivElement>();
    private inputs: JSX.Element[];
    private calcInputs: NnnCalculatorInputs;
    state: NnnCalcState

    constructor(public props: Props) {
        super(props);
        this.calcInputs = new NnnCalculatorInputs()
        this.inputs = getInputJsxFromObject(this.calcInputs);
        this.state = {
            preparedOutput: <div>What the...</div>
        }
    }

    // Anything in this function happens after the Elements are added to the DOM
    // i.e. the refs are added to `input1`, `input2`, ect.
    componentDidMount() {
        this.setState({ preparedOutput: <>Wah</> })
    }

    async prepareOutput(): Promise<JSX.Element> {
        const rentData = this.calcInputs.getRentSchedule();
        let outText: JSX.Element[] = [];
        let totalRent = 0.0;
        const localeOptions = { style: 'currency', currency: 'USD', minimumIntegerDigits: 1, minimumFractionDigits: 2, maximumFractionDigits: 2, };
        rentData.forEach((data, index) => {
            const row = (
                <tr key={index}>
                    <td>{data.periodFrom}</td>
                    <td>{data.periodTo}</td>
                    <td>{data.monthsLength}</td>
                    <td>{data.monthlyRentPerSqFt.toLocaleString("en-US", localeOptions)}</td>
                    <td>{data.monthlyBaseRent.toLocaleString("en-US", localeOptions)}</td>
                    <td>{data.totalRentPerPeriod.toLocaleString("en-US", localeOptions)}</td>
                </tr>
            )
            outText.push(row);
            totalRent += data.totalRentPerPeriod;
        })
        console.log(totalRent)
        return (
            <table style={{width: "100%"}}>
                <tbody>
                    <tr>
                        <td>Period From:</td>
                        <td>Period To:</td>
                        <td>Months Length:</td>
                        <td>Monthly Rent Per SqFt:</td>
                        <td>Monthly Base Rent:</td>
                        <td>Total Rent Per Period:</td>
                    </tr>
                    {outText}
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>Total Rent for Term:</td>
                        <td>{totalRent.toLocaleString("en-US", localeOptions)}</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    submitFn = () => {
        const sharePercent = parseFloat(this.calcInputs.rentedSize.getValue()) / parseFloat(this.calcInputs.totalSize.getValue());
        const monthlyRent = parseFloat(this.calcInputs.initialRent.getValue())

        const totalRentMonths = parseInt(this.calcInputs.termLengthInMonths.getValue()) + (this.calcInputs.escalationOption === EscalationOption.option2 ? 1 : 0);

        const out = this.prepareOutput();

        out.then((val) => {
            console.log(val);
            console.log(this.state.preparedOutput);
            this.setState({preparedOutput: val});
            console.log(this.state.preparedOutput);
        });
    }

    // Need render function in order for class component to work
    render() {
        return (<Container section={false}>
            <TitleSection title={"Real Estate Calculator"} subtitle={this.props.calcName} />
            <Content>
                <InputWrapper>
                    {this.inputs}
                </InputWrapper>

                <Link to={"#"} onClick={(ev) => { ev.preventDefault(); this.submitFn() }}>
                    <Button primary>{"Calculator"}</Button>
                </Link>

                <span ref={this.output} style={{display: "block"}}>{this.state.preparedOutput}</span>
            </Content>
        </Container>)
    }
}
