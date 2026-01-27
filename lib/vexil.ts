
export default abstract class Vexil<T> {
    private _input: T;
    constructor(input: T) {
        this._input = input;
    }

    public get input() {
        return this._input;
    }

    public toString() {
        return this.input ? String(this.input) : undefined;
    }

    public validate(...args: Array<boolean | ((inst: this) => boolean)>) {
        return args.every((a) => typeof a === "function" ? !!a(this) : !!a);
    }
}