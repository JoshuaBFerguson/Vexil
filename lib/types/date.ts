import Vexil from "../vexil";

type DateInput = Date | string | number;

function toDate(input: DateInput): Date {
    return input instanceof Date ? input : new Date(input);
}

function isValidDate(date: Date): boolean {
    return !Number.isNaN(date.getTime());
}

export class VexilDate extends Vexil<Date> {
    constructor(input: DateInput) {
        super(toDate(input));
    }

    public override validate(...args: (boolean | ((inst: VexilDate) => boolean))[]): boolean {
        return super.validate(...args, isValidDate(this.value));
    }

    static before(date: DateInput) {
        const cmp = toDate(date);
        return (inst: VexilDate): boolean => isValidDate(cmp) && inst.value.getTime() < cmp.getTime();
    }

    static after(date: DateInput) {
        const cmp = toDate(date);
        return (inst: VexilDate): boolean => isValidDate(cmp) && inst.value.getTime() > cmp.getTime();
    }

    static onOrBefore(date: DateInput) {
        const cmp = toDate(date);
        return (inst: VexilDate): boolean => isValidDate(cmp) && inst.value.getTime() <= cmp.getTime();
    }

    static onOrAfter(date: DateInput) {
        const cmp = toDate(date);
        return (inst: VexilDate): boolean => isValidDate(cmp) && inst.value.getTime() >= cmp.getTime();
    }

    static between(min: DateInput, max: DateInput) {
        const minDate = toDate(min);
        const maxDate = toDate(max);
        return (inst: VexilDate): boolean =>
            isValidDate(minDate) &&
            isValidDate(maxDate) &&
            inst.value.getTime() > minDate.getTime() &&
            inst.value.getTime() < maxDate.getTime();
    }

    static isPast() {
        return (inst: VexilDate): boolean => inst.value.getTime() < Date.now();
    }

    static isFuture() {
        return (inst: VexilDate): boolean => inst.value.getTime() > Date.now();
    }

    static isWeekend() {
        return (inst: VexilDate): boolean => {
            const day = inst.value.getDay();
            return day === 0 || day === 6;
        };
    }

    static isWeekday() {
        return (inst: VexilDate): boolean => {
            const day = inst.value.getDay();
            return day >= 1 && day <= 5;
        };
    }
}
