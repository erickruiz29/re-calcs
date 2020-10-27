import React, {FormEvent} from 'react';
import * as Styled from "../ui/Input/styles";
import {Content, InputGroupType, InputWrapper} from "../ui/Input/styles";
import {Container} from "../ui/Container/styles";
import {Button} from "../ui/Button/styles";
import TitleSection from "../ui/TitleSection";
import {Link} from "gatsby";

function typedKeys<T>(o: T): (keyof T)[] {
    // type cast should be safe because that's what really Object.keys() does
    return Object.keys(o) as (keyof T)[];
}

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

class RentData {
    periodTo: number | Date = 1
    periodFrom: number | Date = 1
    monthsLength: number = 1
    monthlyBaseRent: number = 0.0
    monthlyRentPerSqFt: number = 0.0
    totalRentPerPeriod: number = 0.0
}

interface ICalcData {
    unitSelect: BuildingSizeUnit
    rentType: RentType
    leaseStartDate?: Date
    escalationType: EscalationType
    incentiveType: IncentiveType // TODO implement dropdown
    escalationOption: EscalationOption // TODO implement dropdown
    // TODO get units for Expenses
    tiaType: TIAType
    totalSize?: number
    rentedSize?: number
    initialRent?: number
    escalationFreqInMonths?: number
    escalationAmt?: number
    termLengthInMonths?: number
    discountPercent?: number
    discountLength?: number
    managementFeePercentage?: number
    commonAreaMaintenance?: number
    insurance?: number
    taxes?: number
    listingCommission?: number
    procuringCommission?: number
    tia?: number
}
// Makes ICalcData required
interface ValidatedCalcData extends ICalcData{
    commonAreaMaintenance: number;
    discountLength: number;
    discountPercent: number;
    escalationAmt: number;
    escalationFreqInMonths: number;
    initialRent: number;
    insurance: number;
    managementFeePercentage: number ;
    listingCommission: number;
    procuringCommission: number ;
    rentedSize: number;
    taxes: number;
    termLengthInMonths: number;
    tia: number ;
    totalSize: number;
}

class DefaultCalcData implements ValidatedCalcData {
    commonAreaMaintenance: number = 30000;
    discountLength: number = 1;
    discountPercent: number = 100;
    escalationAmt: number = 1.03;
    escalationFreqInMonths: number = 12;
    initialRent: number = 1.00;
    insurance: number = 30000;
    managementFeePercentage: number = 1.03;
    listingCommission: number = 0.025;
    procuringCommission: number = 0.025;
    rentedSize: number = 10000;
    taxes: number = 60000;
    termLengthInMonths: number = 60;
    tia: number = 50000;
    totalSize: number = 100000;
    escalationOption: EscalationOption = EscalationOption.option1;
    escalationType: EscalationType = EscalationType.percentage;
    incentiveType: IncentiveType = IncentiveType.freeRent;
    rentType: RentType = RentType.perSqFt;
    tiaType: TIAType = TIAType.fixed;
    unitSelect: BuildingSizeUnit = BuildingSizeUnit.squareFeet;
}

class InputGroup extends React.Component {
    private displayName: string;
    private id: string;
    private value: string;
    private onUpdate: (ev:FormEvent<HTMLInputElement>) => string;

    constructor(props: InputGroupProps) {
        super(props);
        this.displayName = props.displayName
        this.id = props.id
        this.value = props.stateValue
        this.onUpdate = props.onUpdate
    }

    render(): React.ReactNode {
        return (
            <Styled.InputGroup inputGroupType={InputGroupType.half}>
                <Styled.Label>
                    {this.displayName}
                </Styled.Label>
                <Styled.Input id={this.id} type={"text"} value={this.value} onChange={(ev: FormEvent<HTMLInputElement>) => { this.value = this.onUpdate(ev)}} />
            </Styled.InputGroup>
        );
    }
}

interface NnnCalcState {
    preparedOutput: JSX.Element
    calcInputData: ICalcData
}

interface calcInput {
    stateValue: string
    displayName: string
    id: string
}

interface InputGroupProps extends calcInput {
    onUpdate: (ev:FormEvent<HTMLInputElement>) => string
}

// Adding this as an example of how to create a class component
export class NnnCalculator extends React.Component {
    private output = React.createRef<HTMLDivElement>();
    private calcInputs: calcInput[];
    state: NnnCalcState

    constructor(public props: Props) {
        super(props);
        this.state = {
            preparedOutput: <div>What the...</div>,
            calcInputData: new DefaultCalcData(),
        }

        this.calcInputs = [
            {stateValue: this.state.calcInputData.totalSize?.toString() ?? "", displayName: "Size of Property (TODOUNITSELECT)", id: "totalSize" },
            {stateValue: this.state.calcInputData.rentedSize?.toString() ?? "", displayName: "Amount Renting (TODOUNITSELECT)", id: "rentedSize" },
            {stateValue: this.state.calcInputData.initialRent?.toString() ?? "", displayName: "Initial Rent (TODOUNITSELECT)", id: "initialRent" },
            {stateValue: this.state.calcInputData.escalationFreqInMonths?.toString() ?? "", displayName: "Escalation Frequency In Months", id: "escalationFreqInMonths" },
            {stateValue: this.state.calcInputData.escalationAmt?.toString() ?? "", displayName: "Escalation Amount", id: "escalationAmt" },
            {stateValue: this.state.calcInputData.termLengthInMonths?.toString() ?? "", displayName: "Term Length In Months", id: "termLengthInMonths" },
            {stateValue: this.state.calcInputData.discountPercent?.toString() ?? "", displayName: "Discount Percent", id: "discountPercent" },
            {stateValue: this.state.calcInputData.discountLength?.toString() ?? "", displayName: "Discount Length", id: "discountLength" },
            {stateValue: this.state.calcInputData.managementFeePercentage?.toString() ?? "", displayName: "Management Fee Percentage", id: "managementFeePercentage" },
            {stateValue: this.state.calcInputData.commonAreaMaintenance?.toString() ?? "", displayName: "Common Area Maintenance", id: "commonAreaMaintenance" },
            {stateValue: this.state.calcInputData.insurance?.toString() ?? "", displayName: "Insurance", id: "insurance" },
            {stateValue: this.state.calcInputData.taxes?.toString() ?? "", displayName: "Taxes", id: "taxes" },
            {stateValue: this.state.calcInputData.listingCommission?.toString() ?? "", displayName: "Listing Commission", id: "listingCommission" },
            {stateValue: this.state.calcInputData.procuringCommission?.toString() ?? "", displayName: "Procuring Commission", id: "procuringCommission" },
            {stateValue: this.state.calcInputData.tia?.toString() ?? "", displayName: "Tenant Improvement Allowance (TODOUNITSELECT)", id: "tia" },
        ]
    }

    // Anything in this function happens after the Elements are added to the DOM
    // i.e. the refs are added to `input1`, `input2`, ect.
    componentDidMount() {
        this.setState({ preparedOutput: <>Wah</> })
    }

    validateInputs(val: string, min?: number, max?: number): number | undefined {
        if (val.trim() !== "") {
            try {
                const retVal = parseFloat(val);
                return isNaN(retVal) ? undefined : retVal;
            } catch (e) {}
        }
        return undefined;
    }

    getUpdatedInputCalcData(key: string, val: number | undefined): ICalcData {
        const updateState = {...this.state.calcInputData}
        // @ts-ignore
        updateState[key] = val;
        return updateState
    }

    getUpdatedValidatedData(): ValidatedCalcData | undefined {
        const updatedInputData = {...this.state.calcInputData};
        let shouldReturnData = true

        typedKeys(updatedInputData).forEach((key) => {
            // @ts-ignore
            const inputVal = updatedInputData[key];
            if (inputVal === undefined) {
                shouldReturnData = false
                return;
            }
        })
        try {
            return shouldReturnData ? this.state.calcInputData as ValidatedCalcData : undefined;
        } catch (e) {
            // TODO error log
            return undefined
        }
    }

    validateInputsUpdateState(ev: FormEvent<HTMLInputElement>): string {
        const num = this.validateInputs(ev.currentTarget.value.trim());
        const updatedCalcData = this.getUpdatedInputCalcData(ev.currentTarget.id, num);
        const updateState = {...this.state, calcInputData: {...updatedCalcData}}
        this.setState(updateState);
        return num !== undefined ? num.toString() : "";
    }

    submitFn = () => {
        this.prepareOutput().then((val) => {
            this.setState({preparedOutput: val});
        });
    }

    // Need render function in order for class component to work
    render() {
        return (<Container section={false}>
            <TitleSection title={"Real Estate Calculator"} subtitle={this.props.calcName} />
            <Content>
                <InputWrapper>
                    {
                        this.calcInputs.map((props: calcInput) => {
                            const inputProps: InputGroupProps = {...props, onUpdate: this.validateInputsUpdateState}
                            return (<InputGroup key={inputProps.id} {...inputProps} />)
                        })
                    }
                </InputWrapper>

                <Link to={"#"} onClick={(ev) => { ev.preventDefault(); this.submitFn() }}>
                    <Button primary>{"Calculator"}</Button>
                </Link>

                <span ref={this.output} style={{display: "block"}}>{this.state.preparedOutput}</span>
            </Content>
        </Container>)
    }


    /*********************************************************************
     *
     *                      Business Logic Below:
     *
     *********************************************************************/
    getRentSchedule(): RentData[] {
        const data: RentData[] = [];
        const validatedCalcData = this.getUpdatedValidatedData()

        if (validatedCalcData === undefined) {
            return [];
        }

        // Rent discount is in the beginning
        if (validatedCalcData.escalationOption === EscalationOption.option1) {
            const curData = new RentData();
            let currentRentPerSqFt = validatedCalcData.initialRent
            const currentRentedSize = validatedCalcData.rentedSize
            const escalationAmount = validatedCalcData.escalationAmt
            curData.periodFrom = 1
            curData.periodTo = validatedCalcData.discountLength
            curData.monthsLength = curData.periodFrom - curData.periodTo + 1
            curData.monthlyRentPerSqFt = 0;
            curData.monthlyBaseRent = 0;
            curData.totalRentPerPeriod = 0;

            data.push(curData);

            let currentMonth = curData.periodTo + 1;

            while (currentMonth < validatedCalcData.termLengthInMonths) {
                const moreData = new RentData();
                // Coming from adding a discount; (1-0) % 12 == 0; 13-1 % 12 == 0; }=> start of a period
                if ((currentMonth - 1) % 12 !== 0) {
                    moreData.periodFrom = currentMonth;
                    moreData.periodTo = currentMonth + (12 - (currentMonth % 12));
                } else {
                    currentRentPerSqFt = validatedCalcData.escalationType === EscalationType.fixed ?
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

    async prepareOutput(): Promise<JSX.Element> {
        const rentData = this.getRentSchedule();
        const validatedCalcData = this.getUpdatedValidatedData()
        if (validatedCalcData === undefined) {
            return (<div>Validated Data is incorrect!</div>);
        }

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

        const percentRented = validatedCalcData.rentedSize / validatedCalcData.totalSize
        // Expenses calculation:
        const cam = validatedCalcData.commonAreaMaintenance;
        const annualCam = cam * percentRented


        return (
            <>
                <h1>Rent Table</h1>
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
                <h1>Expenses</h1>
                <table>
                    <tbody>
                    <tr>
                        <th>Monthly Expenses</th>
                        <th>Building/Project Annual Total</th>
                        <th>Pro-Rata Annual Total</th>
                        <th>Building/Project Monthly Total</th>
                        <th>Pro-Rata Monthly Total</th>
                        <th>Monthly Per Sq. Ft.</th>
                    </tr>
                    <tr>
                        <td>Common Area Maintenance (CAM)</td>
                        <td>{cam.toLocaleString("en-US", localeOptions)}</td>
                        <td>{annualCam.toLocaleString("en-US", localeOptions)}</td>
                        <td>{(cam / 12.0).toLocaleString("en-US", localeOptions)}</td>
                        <td>{((cam / 12.0) * percentRented).toLocaleString("en-US", localeOptions)}</td>
                        <td>{((((cam / 12.0) * percentRented)) / validatedCalcData.rentedSize).toLocaleString("en-US", localeOptions)}</td>
                    </tr>
                    </tbody>
                </table>
            </>
        )
    }
}
