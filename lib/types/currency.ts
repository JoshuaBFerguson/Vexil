import Vexil from "../vexil";

export class VexilCurrency extends Vexil<string> {
    public amount?: number;
    public currencyCode?: string;

    constructor(currencyString: string | number) {
        super(currencyString.toString());
        this.parse();
    }

    private parse() {
        // Regex to match formats like "100 USD", "100.50 EUR", "123.45GBP" (with optional space)
        const match = this.input.match(/^(\d+(?:\.\d+)?)\s*([A-Z]{3})$/);
        if (match) {
            this.amount = parseFloat(match[1]!);
            this.currencyCode = match[2]!;
        }
    }

    public override validate(...args: (boolean | ((inst: VexilCurrency) => boolean))[]): boolean {
        return super.validate(...args, Number.isFinite(this.amount), !!this.currencyCode && /^[A-Z]{3}$/.test(this.currencyCode));
    }

    static allowedCurrencies(...args: string[]) {
        return (inst: VexilCurrency): boolean => !!inst.currencyCode && args.includes(inst.currencyCode);
    }

    static disallowedCurrencies(...args: string[]) {
        return (inst: VexilCurrency): boolean => !inst.currencyCode || !args.includes(inst.currencyCode);
    }

    static positiveAmount() {
        return (inst: VexilCurrency): boolean => !!inst.amount && inst.amount > 0;
    }

    static greaterThanAmount(num: number) {
        return (inst: VexilCurrency): boolean => !!inst.amount && inst.amount > num;
    }

    static lessThanAmount(num: number) {
        return (inst: VexilCurrency): boolean => !!inst.amount && inst.amount < num;
    }

    static betweenAmounts(min: number, max: number) {
        return (inst: VexilCurrency): boolean => !!inst.amount && inst.amount > min && inst.amount < max;
    }

    static minAmount(num: number) {
        return (inst: VexilCurrency): boolean => !!inst.amount && inst.amount >= num;
    }

    static maxAmount(num: number) {
        return (inst: VexilCurrency): boolean => !!inst.amount && inst.amount <= num;
    }

    static exactAmount(num: number) {
        return (inst: VexilCurrency): boolean => !!inst.amount && inst.amount === num;
    }

    static isWholeNumber() {
        return (inst: VexilCurrency): boolean => !!inst.amount && Number.isInteger(inst.amount);
    }

    static hasDecimalPlaces() {
        return (inst: VexilCurrency): boolean => !!inst.amount && !Number.isInteger(inst.amount);
    }
}