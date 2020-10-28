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

export function formatMoney(input: number): string {
    const localeOptions = { style: 'currency', currency: 'USD', minimumIntegerDigits: 1, minimumFractionDigits: 2, maximumFractionDigits: 2, };
    return input.toLocaleString("en-US", localeOptions)
}

export function formatNumber(input: number): string {
    const localOptions = { style: 'decimal', minimumIntegerDigits: 1, maximumFractionDigits: 0 };
    return input.toLocaleString("en-US", localOptions);
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

interface ICalcData {
    unitSelect: BuildingSizeUnit
    rentType: RentType
    leaseStartDate?: Date
    escalationType: EscalationType
    incentiveType: IncentiveType // TODO implement dropdown
    escalationOption: EscalationOption // TODO implement dropdown; NEED TO MAKE OPTIONAL
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
    commonAreaMaintenance: number = 40000;
    discountLength: number = 1;
    discountPercent: number = 100;
    escalationAmt: number = 1.03;
    escalationFreqInMonths: number = 12;
    initialRent: number = 1.00;
    insurance: number = 30000;
    managementFeePercentage: number = 0.03;
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

interface RentPeriodData {
    periodTo: number
    periodFrom: number
    monthsLength: number
    monthlyBaseRent: number
    totalRentPerPeriod: number
    monthlyRentPerSqFt: number
}

interface RentData {
    rentPeriodData: RentPeriodData[]
    netEffectiveRent: number
    totalNetRent: number
    totalTermLength: number
}

interface ExpenseData {
    expenseName: string
    bldgAnnual: number
    proRataAnnual: number
    bldgMonthly: number
    proRataMonthly: number
    monthlyPerUnit: number
}

interface ExpensesData {
    expensesPeriodData: ExpenseData[]
    proRataAnnualStartNetRent: number
    proRataMonthlyStartNetRent: number
    proRataAnnualGrossRent: number
    proRataMonthlyGrossRent: number
    proRataAnnualTotalExpenses: number
    proRataMonthlyTotalExpenses: number
    totalExpensesPerUnit: number
    startingNetRentPerUnit: number
    grossRentPerUnit: number

}

interface CommissionPeriodData {
    considerationAmount: number
    listingCommission: number
    procuringCommission: number
    totalCommissionPercent: number
    totalCommissionAmount: number
}

interface CommissionData {
    commissionPeriodData: CommissionPeriodData[]
    totalListingCommission: number
    totalProcuringCommission: number
    totalCommission: number
}

interface CalculatedData {
    rentData: RentData
    expensesData: ExpensesData
    commissionData: CommissionData
    proportionateShare: number
    tia: number
    turnOverCosts: number
    noiFullTerm: number
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
            {stateValue: getStringOrEmpty(this.state.calcInputData.managementFeePercentage), displayName: "Management Fee Percentage", id: "managementFeePercentage", min: "0", max: "1" },
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
    getRentData(): RentData | undefined {
        const data: RentData = {rentPeriodData: [], netEffectiveRent: 0, totalNetRent: 0, totalTermLength: 0};
        const validatedCalcData = this.getUpdatedValidatedData()

        if (validatedCalcData === undefined) {
            return undefined;
        }

        // Rent discount is in the beginning
        if (validatedCalcData.escalationOption === EscalationOption.option1) {
            data.totalTermLength = validatedCalcData.termLengthInMonths
            const curData: RentPeriodData = {
                periodFrom: 1,
                periodTo: validatedCalcData.discountLength,
                monthsLength: validatedCalcData.discountLength,
                monthlyRentPerSqFt: 0,
                monthlyBaseRent: 0,
                totalRentPerPeriod: 0,
            }
            let currentRentPerSqFt = validatedCalcData.initialRent
            const currentRentedSize = validatedCalcData.rentedSize
            const escalationAmount = validatedCalcData.escalationAmt


            data.rentPeriodData.push(curData);

            let currentMonth = curData.periodTo + 1;

            while (currentMonth < validatedCalcData.termLengthInMonths) {
                const moreData: RentPeriodData = {
                    periodFrom: 1,
                    periodTo: validatedCalcData.discountLength,
                    monthsLength: validatedCalcData.discountLength,
                    monthlyRentPerSqFt: 0,
                    monthlyBaseRent: 0,
                    totalRentPerPeriod: 0,
                }
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
                data.rentPeriodData.push(moreData);
                data.totalNetRent += moreData.totalRentPerPeriod
                currentMonth = moreData.periodTo + 1;
            }
        }
        data.netEffectiveRent = data.totalNetRent / validatedCalcData.termLengthInMonths / validatedCalcData.rentedSize;
        return data;
    }

    getCommissionData(rentData: RentData, listingCommissionPercentage: number, procuringCommissionPercentage: number): CommissionData | undefined {
        const commissionData:CommissionData = {commissionPeriodData: [], totalCommission: 0, totalProcuringCommission: 0, totalListingCommission: 0}
        rentData.rentPeriodData.forEach((val, ind) => {
            const listingComm = listingCommissionPercentage * val.totalRentPerPeriod
            const procuringComm = listingCommissionPercentage * val.totalRentPerPeriod
            const currData: CommissionPeriodData = {
                considerationAmount: val.totalRentPerPeriod,
                listingCommission: listingComm,
                procuringCommission: procuringComm,
                totalCommissionAmount: listingComm + procuringComm,
                totalCommissionPercent: listingCommissionPercentage + procuringCommissionPercentage
            }
            commissionData.commissionPeriodData.push(currData);
            commissionData.totalListingCommission += listingComm
            commissionData.totalProcuringCommission += procuringComm
        })
        commissionData.totalCommission += commissionData.totalListingCommission + commissionData.totalProcuringCommission
        return commissionData
    }

    getExpensesData(rentedSize: number, startingRentAmt: number, proportionateShare: number, managementFee: number, restExpenses: number[], restExpensesNames: string[]): ExpensesData | undefined {
        const expensesPeriodData: ExpenseData[] = []

        let proRataAnnualSum = 0
        let proRataMonthlySum = 0

        restExpenses.forEach((val, ind) => {
            const proRataMonthly = (val / 12) * proportionateShare
            expensesPeriodData.push({
                expenseName: restExpensesNames[ind],
                bldgAnnual: val,
                proRataAnnual: val * proportionateShare,
                bldgMonthly: val / 12,
                proRataMonthly: proRataMonthly ,
                monthlyPerUnit: proRataMonthly / rentedSize,
            })
            proRataMonthlySum += proRataMonthly
            proRataAnnualSum += val * proportionateShare
        })

        const managementProRateMonthly = (proRataMonthlySum + startingRentAmt * rentedSize) * managementFee

        expensesPeriodData.push({
            expenseName: "Management Fee",
            bldgAnnual: 0,
            proRataAnnual: managementProRateMonthly * 12,
            bldgMonthly: 0,
            proRataMonthly: managementProRateMonthly,
            monthlyPerUnit: managementProRateMonthly / rentedSize,
        })

        proRataMonthlySum += managementProRateMonthly
        proRataAnnualSum += managementProRateMonthly * 12

        return {
            expensesPeriodData: expensesPeriodData,
            totalExpensesPerUnit: proRataMonthlySum / rentedSize,
            grossRentPerUnit: startingRentAmt + (proRataMonthlySum / rentedSize),
            startingNetRentPerUnit: startingRentAmt,
            proRataAnnualTotalExpenses: proRataAnnualSum,
            proRataAnnualGrossRent: proRataAnnualSum + (startingRentAmt * rentedSize * 12),
            proRataAnnualStartNetRent: startingRentAmt * rentedSize * 12,
            proRataMonthlyTotalExpenses: proRataMonthlySum,
            proRataMonthlyGrossRent: proRataMonthlySum  ,
            proRataMonthlyStartNetRent: startingRentAmt * rentedSize
        }
    }

    getCalculatedData(): CalculatedData | undefined {
        const validatedData = this.getUpdatedValidatedData()
        if (validatedData === undefined) {
            return undefined
        }

        const rentData = this.getRentData();
        if (rentData === undefined) {
            return undefined
        }
        const proportionateShare = validatedData.rentedSize / validatedData.totalSize
        const commissionData = this.getCommissionData(rentData, validatedData.listingCommission, validatedData.procuringCommission);
        const expensesData = this.getExpensesData(
            validatedData.rentedSize,
            validatedData.initialRent,
            proportionateShare,
            validatedData.managementFeePercentage,
            [validatedData.commonAreaMaintenance, validatedData.insurance, validatedData.taxes],
            ["Common Area Maintenance (CAM)", "Insurance", "Taxes"]
        );

        if (commissionData === undefined || expensesData === undefined) {
            // TODO ERROR CALCULATING
            return undefined

        } else {
            const turnOverCosts = validatedData.tia + commissionData.totalCommission
            const noiFullTerm = rentData.totalNetRent - turnOverCosts
            return {
                commissionData: commissionData,
                expensesData: expensesData,
                rentData: rentData,
                noiFullTerm: noiFullTerm,
                proportionateShare: proportionateShare,
                tia: validatedData.tia,
                turnOverCosts: turnOverCosts,
            }
        }
    }

    async prepareOutput(): Promise<JSX.Element> {
        const calculatedData = this.getCalculatedData()
        const validatedCalcData = this.getUpdatedValidatedData()
        if (calculatedData === undefined || validatedCalcData === undefined) {
            return (<div style={{color: "red", fontSize: "3em"}}> "Error outputing calculated data"</div>)
        }

        const rentData = calculatedData.rentData.rentPeriodData;
        let rentDataJsx: JSX.Element[] = [];

        rentData.forEach((data, index) => {
            const row = (
                <tr key={`rentTable_${index}`}>
                    <td>{data.periodFrom}</td>
                    <td>{data.periodTo}</td>
                    <td>{data.monthsLength}</td>
                    <td>{formatMoney(data.monthlyRentPerSqFt)}</td>
                    <td>{formatMoney(data.monthlyBaseRent)}</td>
                    <td>{formatMoney(data.totalRentPerPeriod)}</td>
                </tr>
            )
            rentDataJsx.push(row);
        })

        const expensesData = calculatedData.expensesData.expensesPeriodData;
        let expensesJsx: JSX.Element[] = [];

        expensesData.forEach((data, index) => {
            const row = (
                <tr key={`expenses_${index}`}>
                    <td>{data.expenseName}</td>
                    <td>{data.bldgAnnual !== 0 ? formatMoney(data.bldgAnnual) : ""}</td>
                    <td>{formatMoney(data.proRataAnnual)}</td>
                    <td>{data.bldgMonthly !== 0 ? formatMoney(data.bldgMonthly) : ""}</td>
                    <td>{formatMoney(data.proRataMonthly)}</td>
                    <td>{formatMoney(data.monthlyPerUnit)}</td>
                </tr>
            )
            expensesJsx.push(row);
        })

        expensesJsx.push((<tr>
            <th>Total Expenses</th>
            <td> </td>
            <td>{formatMoney(calculatedData.expensesData.proRataAnnualTotalExpenses)}</td>
            <td> </td>
            <td>{formatMoney(calculatedData.expensesData.proRataMonthlyTotalExpenses)}</td>
            <td>{formatMoney(calculatedData.expensesData.totalExpensesPerUnit)}</td>
        </tr>))

        expensesJsx.push((<tr>
            <th>Starting Net Rent</th>
            <td> </td>
            <td>{formatMoney(calculatedData.expensesData.proRataAnnualStartNetRent)}</td>
            <td> </td>
            <td>{formatMoney(calculatedData.expensesData.proRataMonthlyStartNetRent)}</td>
            <td>{formatMoney(calculatedData.expensesData.startingNetRentPerUnit)}</td>
        </tr>))

        expensesJsx.push((<tr>
            <th>Gross Rent</th>
            <td> </td>
            <td>{formatMoney(calculatedData.expensesData.proRataAnnualGrossRent)}</td>
            <td> </td>
            <td>{formatMoney(calculatedData.expensesData.proRataMonthlyGrossRent)}</td>
            <td>{formatMoney(calculatedData.expensesData.grossRentPerUnit)}</td>
        </tr>))

        const commissionsData = calculatedData.commissionData.commissionPeriodData;
        let commissionJsx: JSX.Element[] = []

        commissionsData.forEach((data, index) => {
            const row = (
                <tr key={`commission_${index}`}>
                    <td>{index}</td>
                    <td>{data.considerationAmount}</td>
                    <td>{validatedCalcData.listingCommission}%</td>
                    <td>{formatMoney(data.listingCommission)}</td>
                    <td>{validatedCalcData.procuringCommission}%</td>
                    <td>{formatMoney(data.procuringCommission)}</td>
                    <td>{data.totalCommissionPercent}%</td>
                    <td>{formatMoney(data.totalCommissionAmount)}</td>
                </tr>
            )
            commissionJsx.push(row);
        })

        return (
            <>
                {/*
                *
                *   Basic Info
                *
                */}
                <div style={{height: "50px", width: "100%", display: "block"}}> </div>
                <h1 style={{fontSize: "3em", color: "#333", textAlign: "left"}}>Basic Info</h1>
                <table style={{width: "100%", textAlign: "left"}}>
                    <tbody>
                    <tr>
                        <th>Size of Building/Project:</th>
                        <th>Size of Unit Rented:</th>
                        <th>Proportionate Share:</th>
                        <th>Start Rent Amount (Per Square Feet):</th>
                        <th>Start Rent Amount (Per Month):</th>
                        <th>Escalation Frequency (Months):</th>
                        <th>Escalation Amount (%):</th>
                        <th>Total Term Length (Months):</th>
                    </tr>
                    <tr>
                        <td>{formatNumber(validatedCalcData.totalSize)}</td>
                        <td>{formatNumber(validatedCalcData.rentedSize)}</td>
                        <td>{(validatedCalcData.rentedSize / validatedCalcData.totalSize) * 100 }%</td>
                        <td>{formatMoney(validatedCalcData.initialRent)}</td>
                        <td>{formatMoney(validatedCalcData.initialRent * validatedCalcData.rentedSize)}</td>
                        <td>{validatedCalcData.escalationFreqInMonths}</td>
                        <td>{validatedCalcData.escalationAmt}</td>
                        <td>{calculatedData.rentData.totalTermLength}</td>
                    </tr>
                    </tbody>
                </table>
                {/*
                *
                *   Rent Table
                *
                */}
                <div style={{height: "50px", width: "100%", display: "block"}}> </div>
                <h1 style={{fontSize: "3em", color: "#333", textAlign: "left"}}>Rent Table</h1>
                <table style={{width: "100%", textAlign: "left"}}>
                    <tbody>
                        <tr>
                            <th>Period From:</th>
                            <th>Period To:</th>
                            <th>Months Length:</th>
                            <th>Monthly Rent Per SqFt:</th>
                            <th>Monthly Base Rent:</th>
                            <th>Total Rent Per Period:</th>
                        </tr>
                        {rentDataJsx}
                        <tr>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <th>Net Effective Rent (NER)</th>
                            <th>Total Rent for Term:</th>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>{formatMoney(calculatedData.rentData.netEffectiveRent)}</td>
                            <td>{formatMoney(calculatedData.rentData.totalNetRent)}</td>
                        </tr>
                    </tbody>
                </table>
                {/*
                *
                *   Expenses
                *
                */}
                <div style={{height: "50px", width: "100%", display: "block"}}> </div>
                <h1 style={{fontSize: "3em", color: "#333", textAlign: "left"}}>Expenses</h1>
                <table style={{width: "100%", textAlign: "left"}}>
                    <tbody>
                    <tr>
                        <th>Monthly Expenses</th>
                        <th>Building/Project Annual Total</th>
                        <th>Pro-Rata Annual Total</th>
                        <th>Building/Project Monthly Total</th>
                        <th>Pro-Rata Monthly Total</th>
                        <th>Monthly Per Sq. Ft.</th>
                    </tr>
                        {expensesJsx}
                    </tbody>
                </table>
                {/*
                *
                *   Commissions
                *
                */}
                <div style={{height: "50px", width: "100%", display: "block"}}> </div>
                <h1 style={{fontSize: "3em", color: "#333", textAlign: "left"}}>Commissions</h1>
                <table style={{width: "100%", textAlign: "left"}}>
                    <tbody>
                    <tr>
                        <th>Period:</th>
                        <th>Total Consideration:</th>
                        <th>Listing Commission (%):</th>
                        <th>Listing Commission ($):</th>
                        <th>Procuring Commission (%):</th>
                        <th>Procuring Commission ($):</th>
                        <th>Total Commissions (%):</th>
                        <th>Total Commission ($):</th>
                    </tr>
                        {commissionJsx}
                    <tr>
                        <th>Total Net Rent:</th>
                        <td>{formatMoney(calculatedData.rentData.totalNetRent)}</td>
                        <th>Total Listing Commission:</th>
                        <td>{formatMoney(calculatedData.commissionData.totalListingCommission)}</td>
                        <th>Total Procuring Commission:</th>
                        <td>{formatMoney(calculatedData.commissionData.totalProcuringCommission)}</td>
                        <th>Grand Total Commissions:</th>
                        <td>{formatMoney(calculatedData.commissionData.totalCommission)}</td>
                    </tr>
                    </tbody>
                </table>
                {/*
                *
                *   Tenant Improvement Allowance
                *
                */}
                <div style={{height: "50px", width: "100%", display: "block"}}> </div>
                <h1 style={{fontSize: "3em", color: "#333", textAlign: "left"}}>Tenant Improvement Allowance</h1>
                <table style={{width: "100%", textAlign: "left"}}>
                    <tbody>
                    <tr>
                        <th>Tenant Improvement Allowance:</th>
                    </tr>
                    <tr>
                        <td>{formatMoney(calculatedData.tia)}</td>
                    </tr>
                    </tbody>
                </table>
                {/*
                *
                *   Lease Analysis
                *
                */}
                <div style={{height: "50px", width: "100%", display: "block"}}> </div>
                <h1 style={{fontSize: "3em", color: "#333", textAlign: "left"}}>Lease Analysis</h1>
                <table style={{width: "100%", textAlign: "left"}}>
                    <tbody>
                    <tr>
                        <th>Starting Rent</th>
                        <th>NER</th>
                        <th>Starting Gross Rent</th>
                        <th>Lease Term</th>
                        <th>Total Net Rent</th>
                        <th>Commission</th>
                        <th>TIA</th>
                        <th>Turnover Costs</th>
                        <th>NOI Full Term</th>
                    </tr>
                    <tr>
                        <td>{formatMoney(validatedCalcData.initialRent)}</td>
                        <td>{formatMoney(calculatedData.rentData.netEffectiveRent)}</td>
                        <td>{formatMoney(calculatedData.expensesData.grossRentPerUnit)}</td>
                        <td>{calculatedData.rentData.totalTermLength}</td>
                        <td>{formatMoney(calculatedData.rentData.totalNetRent)}</td>
                        <td>{formatMoney(calculatedData.commissionData.totalCommission)}</td>
                        <td>{formatMoney(calculatedData.tia)}</td>
                        <td>{formatMoney(calculatedData.turnOverCosts)}</td>
                        <td>{formatMoney(calculatedData.noiFullTerm)}</td>
                    </tr>
                    </tbody>
                </table>
            </>
        )
    }
}
