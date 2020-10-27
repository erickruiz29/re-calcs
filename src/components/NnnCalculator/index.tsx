import React, {FormEvent} from 'react';
import * as Styled from "../ui/Input/styles";
import {Content, InputGroupType, InputWrapper} from "../ui/Input/styles";
import {Container} from "../ui/Container/styles";
import {Button} from "../ui/Button/styles";
import TitleSection from "../ui/TitleSection";
import {Link} from "gatsby";
import EventEmitter from "events";

export function typedKeys<T>(o: T): (keyof T)[] {
    // type cast should be safe because that's what really Object.keys() does
    return Object.keys(o) as (keyof T)[];
}

export function getStringOrEmpty(input: number | undefined): string {
    return input?.toString() ?? "";
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
    private min: string;
    private max: string;

    constructor(props: InputGroupProps) {
        super(props);
        this.displayName = props.displayName
        this.id = props.id
        this.value = props.stateValue
        this.onUpdate = props.onUpdate
        this.min = props.min !== undefined ? props.min : ""
        this.max = props.max !== undefined ? props.max : ""
    }

    render(): React.ReactNode {
        return (
            <Styled.InputGroup inputGroupType={InputGroupType.half}>
                <Styled.Label>
                    {this.displayName}
                </Styled.Label>
                <Styled.Input data-validation-min={this.min} data-validation-max={this.max} id={this.id} type={"text"} value={this.value} onChange={(ev: FormEvent<HTMLInputElement>) => { this.value = this.onUpdate(ev)}} />
            </Styled.InputGroup>
        );
    }
}

interface NnnCalcState {
    preparedOutput: JSX.Element
    calcInputData: ICalcData
    errors: InputError
    errorOutput: JSX.Element
}

interface calcInput {
    stateValue: string
    displayName: string
    id: string
    max?: string
    min?: string
}

interface InputGroupProps extends calcInput {
    onUpdate: (ev:FormEvent<HTMLInputElement>) => string
}

enum ErrorType {
    minErr,
    maxErr,
    emptyErr,
    intOnlyErr,
}

class InputError extends Map<string, Error[]> {}

class Error {
    errorMessage: string

    constructor(private inputName: string, private value: string, private errorType?: ErrorType) {
        this.errorMessage = this.getErrorMessage()
    }

    getErrorMessage(): string {
        let errorPart = `${this.inputName} `
        switch (this.errorType) {
            case undefined:
                errorPart += `has encountered an error!`
                break;
            case ErrorType.intOnlyErr:
                errorPart += `only allows integers (no decimal)!`
                break
            case ErrorType.emptyErr:
                errorPart += `cannot be empty!`
                break
            case ErrorType.maxErr:
                errorPart += `value is above max value: ${this.value}`
                break
            case ErrorType.minErr:
                errorPart += `value is below min value: ${this.value}`
                break
        }
        return errorPart
    }
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
            errors: new InputError(),
            errorOutput: <div></div>
        }

        this.calcInputs = [
            {stateValue: getStringOrEmpty(this.state.calcInputData.totalSize), displayName: "Size of Property (TODOUNITSELECT)", id: "totalSize", min: "0", max: "100000000" },
            {stateValue: getStringOrEmpty(this.state.calcInputData.rentedSize), displayName: "Amount Renting (TODOUNITSELECT)", id: "rentedSize", min: "0", max: `${this.state.calcInputData.totalSize}` },
            {stateValue: getStringOrEmpty(this.state.calcInputData.initialRent), displayName: "Initial Rent (TODOUNITSELECT)", id: "initialRent", min: "1", max: "100000000" },
            {stateValue: getStringOrEmpty(this.state.calcInputData.escalationFreqInMonths), displayName: "Escalation Frequency In Months", id: "escalationFreqInMonths", min: "1", max: `${this.state.calcInputData.termLengthInMonths}` },
            {stateValue: getStringOrEmpty(this.state.calcInputData.escalationAmt), displayName: "Escalation Amount", id: "escalationAmt", min: "0"}, // TODO find max
            {stateValue: getStringOrEmpty(this.state.calcInputData.termLengthInMonths), displayName: "Term Length In Months", id: "termLengthInMonths", min: "1" },
            {stateValue: getStringOrEmpty(this.state.calcInputData.discountPercent), displayName: "Discount Percent", id: "discountPercent", min: "1", max: "100" },
            {stateValue: getStringOrEmpty(this.state.calcInputData.discountLength), displayName: "Discount Length", id: "discountLength", min: "1", max: `${this.state.calcInputData.termLengthInMonths}` },
            {stateValue: getStringOrEmpty(this.state.calcInputData.managementFeePercentage), displayName: "Management Fee Percentage", id: "managementFeePercentage", min: "0", max: "100" },
            {stateValue: getStringOrEmpty(this.state.calcInputData.commonAreaMaintenance), displayName: "Common Area Maintenance", id: "commonAreaMaintenance", min: "0", max: "100" },
            {stateValue: getStringOrEmpty(this.state.calcInputData.insurance), displayName: "Insurance", id: "insurance", min: "0" },
            {stateValue: getStringOrEmpty(this.state.calcInputData.taxes), displayName: "Taxes", id: "taxes", min: "0"},
            {stateValue: getStringOrEmpty(this.state.calcInputData.listingCommission), displayName: "Listing Commission", id: "listingCommission", min: "0", max: "100" },
            {stateValue: getStringOrEmpty(this.state.calcInputData.procuringCommission), displayName: "Procuring Commission", id: "procuringCommission", min: "0", max: "100" },
            {stateValue: getStringOrEmpty(this.state.calcInputData.tia), displayName: "Tenant Improvement Allowance (TODOUNITSELECT)", id: "tia", min: "0" },
        ]
    }

    // Anything in this function happens after the Elements are added to the DOM
    // i.e. the refs are added to `input1`, `input2`, ect.
    componentDidMount() {
        this.setState({ preparedOutput: <>Wah</> })
    }

    // TODO have ErrorClass return value
    validateInput(target: EventTarget & HTMLInputElement, min?: number, max?: number): number | Error[] | undefined {
        let errors: Error[] = [];
        const val = target.value.trim()
        if (val !== "") {
            try {
                const retVal = parseFloat(val);

                if (isNaN(retVal)) {
                    errors.push(new Error(target.id, "", ErrorType.intOnlyErr));
                }
                if (min !== undefined && min > retVal) {
                    errors.push(new Error(target.id, min.toString(), ErrorType.minErr))
                }

                if (max !== undefined && max < retVal) {
                    errors.push(new Error(target.id, max.toString(), ErrorType.maxErr));
                }

                return errors.length > 0 ? errors : retVal;
            } catch (e) {}
        }
        errors.push(new Error(target.id, "", ErrorType.emptyErr));
        return errors;
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

    getErrorOutput(error: InputError): JSX.Element {
        let errors:Error[] = [];
            error.forEach((val) => {
                val.forEach((err) => {
                    errors.push(err);
                })
            })
        return errors.length > 0 ? (<div>
            Please fix the following errors:
            <ul style={{listStyle: "inside"}}>
                {
                    errors.map((err) => {
                        return <li key={err.getErrorMessage()} style={{color: "red"}}>{err.getErrorMessage()}</li>
                    })
                }
            </ul>
        </div>) : <></>;
    }

    getValidationAttrOrUndefined(target: HTMLInputElement, validationAttrName: string): number | undefined {
        const attr = target.attributes.getNamedItem(validationAttrName)
        return attr !== null ? parseInt(attr.value) : undefined
    }

    validateInputsUpdateState(currentTarget: HTMLInputElement): string {
        const validationMin = this.getValidationAttrOrUndefined(currentTarget, "data-validation-min")
        const validationMax = this.getValidationAttrOrUndefined(currentTarget, "data-validation-max")
        const numOrError = this.validateInput(currentTarget, validationMin, validationMax);
        let updatedCalcData = {...this.state.calcInputData}
        let errorOutput = <></>
        let errors: InputError = new InputError(this.state.errors)

        if (numOrError instanceof Array) {
            errors.set(currentTarget.id, numOrError)
        } else {
            updatedCalcData = this.getUpdatedInputCalcData(currentTarget.id, numOrError);
        }

        errorOutput = this.getErrorOutput(errors);

        const updateState = {...this.state, calcInputData: {...updatedCalcData}, errors: errors, errorOutput: errorOutput}
        this.setState(updateState);

        return (numOrError instanceof Array) ? currentTarget.value : numOrError !== undefined ? numOrError.toString() : "";
    }

    submitFn = () => {
        const inputs = document.querySelectorAll("input")

        inputs.forEach((input) => {
            this.validateInputsUpdateState(input);
        })

        if (this.state.errors.size > 0) {
            this.setState({...this.state, calcInputData: {...this.state.calcInputData}, errors: this.state.errors, errorOutput: this.getErrorOutput(this.state.errors)});
        } else {
            this.prepareOutput().then((val) => {
                this.setState({...this.state, calcInputData: {...this.state.calcInputData}, errors: this.state.errors, preparedOutput: val});
            });
        }
    }

    // Need render function in order for class component to work
    render() {
        return (<Container section={false}>
            <TitleSection title={"Real Estate Calculator"} subtitle={this.props.calcName} />
            <Content>
                <div style={{marginBottom: "20px"}}>
                    <span style={{display: "block"}}>{this.state.errorOutput}</span>
                </div>
                <InputWrapper>
                    {
                        this.calcInputs.map((props: calcInput) => {
                            const inputProps: InputGroupProps = {...props, onUpdate: (ev: FormEvent<HTMLInputElement>) => { return this.validateInputsUpdateState(ev.currentTarget) }}
                            return (<InputGroup key={inputProps.id} {...inputProps} />)
                        })
                    }
                </InputWrapper>

                <Link to={"#"} onClick={(ev) => { ev.preventDefault(); this.submitFn() }}>
                    <Button primary>{"Calculator"}</Button>
                </Link>

                <span style={{display: "block"}}>{this.state.preparedOutput}</span>
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
