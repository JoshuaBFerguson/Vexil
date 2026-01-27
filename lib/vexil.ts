
export default abstract class Vexil<T> {
    private _input: T;
    constructor(input: T) {
        this._input = input;
    }

    public get input() {
        return this._input;
    }

    public get value() {
        return this.input;
    }

    public toString() {
        return this.input === null || this.input === undefined ? undefined : String(this.input);
    }

    public validate(...args: Array<boolean | ((inst: this) => boolean)>) {
        return args.every((a) => typeof a === "function" ? !!a(this) : !!a);
    }

    public isValid(...args: Array<boolean | ((inst: this) => boolean)>) {
        return this.validate(...args);
    }
}
