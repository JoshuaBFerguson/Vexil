
export default abstract class Vexil<T> {
    private _input: T;
    constructor(input: T) {
        this._input = input;
    }

    public get value() {
        return this._input;
    }

    public toString() {
        return this.value === null || this.value === undefined ? undefined : String(this.value);
    }

    public validate(...args: Array<boolean | ((inst: this) => boolean)>) {
        return args.every((a) => typeof a === "function" ? !!a(this) : !!a);
    }

    public isValid(...args: Array<boolean | ((inst: this) => boolean)>) {
        return this.validate(...args);
    }
}
