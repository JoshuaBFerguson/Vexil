import Vexil from "../vexil";

export class VexilNumber extends Vexil<number> {

    public override validate(...args: (boolean | ((inst: VexilNumber) => boolean))[]): boolean {
        return super.validate(...args, (Number.isFinite(this.input)));
    }

    static greaterThan(num: number) {
        return (inst: VexilNumber) => inst.input > num;
    }

    static lessThan(num: number) {
        return (inst: VexilNumber) => inst.input < num;
    }

    static between(min: number, max: number) {
        return (inst: VexilNumber) => inst.input > min && inst.input < max;
    }
}

export class VexilString extends Vexil<string> {

    public override validate(...args: (boolean | ((inst: VexilString) => boolean))[]): boolean {
        return super.validate(...args, (typeof this.input === "string"));
    }

    static minLength(num: number) {
        return (inst: VexilString) => inst.input.length >= num;
    }

    static maxLength(num: number) {
        return (inst: VexilString) => inst.input.length <= num;
    }
}

export class VexilBoolean extends Vexil<boolean> {

}