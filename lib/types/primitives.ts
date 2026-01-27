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

    static equalTo(num: number) {
        return (inst: VexilNumber) => inst.input === num;
    }

    static notEqualTo(num: number) {
        return (inst: VexilNumber) => inst.input !== num;
    }

    static positive() {
        return (inst: VexilNumber) => inst.input > 0;
    }

    static nonNegative() {
        return (inst: VexilNumber) => inst.input >= 0;
    }

    static negative() {
        return (inst: VexilNumber) => inst.input < 0;
    }

    static nonPositive() {
        return (inst: VexilNumber) => inst.input <= 0;
    }

    static zero() {
        return (inst: VexilNumber) => inst.input === 0;
    }

    static min(num: number) {
        return (inst: VexilNumber) => inst.input >= num;
    }

    static max(num: number) {
        return (inst: VexilNumber) => inst.input <= num;
    }

    static integer() {
        return (inst: VexilNumber) => Number.isInteger(inst.input);
    }

    static safeInteger() {
        return (inst: VexilNumber) => Number.isSafeInteger(inst.input);
    }

    static decimal() {
        return (inst: VexilNumber) => !Number.isInteger(inst.input);
    }

    static even() {
        return (inst: VexilNumber) => Number.isInteger(inst.input) && inst.input % 2 === 0;
    }

    static odd() {
        return (inst: VexilNumber) => Number.isInteger(inst.input) && inst.input % 2 !== 0;
    }

    static divisibleBy(num: number) {
        return (inst: VexilNumber) => inst.input % num === 0;
    }

    static inSet(...nums: number[]) {
        return (inst: VexilNumber) => nums.includes(inst.input);
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

    static exactLength(num: number) {
        return (inst: VexilString) => inst.input.length === num;
    }

    static notEmpty() {
        return (inst: VexilString) => inst.input.length > 0;
    }

    static notBlank() {
        return (inst: VexilString) => inst.input.trim().length > 0;
    }

    static contains(substring: string) {
        return (inst: VexilString) => inst.input.includes(substring);
    }

    static containsAny(...substrings: string[]) {
        return (inst: VexilString) => substrings.some((s) => inst.input.includes(s));
    }

    static startsWith(prefix: string) {
        return (inst: VexilString) => inst.input.startsWith(prefix);
    }

    static endsWith(suffix: string) {
        return (inst: VexilString) => inst.input.endsWith(suffix);
    }

    static matchesPattern(pattern: RegExp) {
        return (inst: VexilString) => pattern.test(inst.input);
    }

    static alphanumeric() {
        return (inst: VexilString) => /^[a-zA-Z0-9]+$/.test(inst.input);
    }

    static alphabetic() {
        return (inst: VexilString) => /^[a-zA-Z]+$/.test(inst.input);
    }

    static numeric() {
        return (inst: VexilString) => /^[0-9]+$/.test(inst.input);
    }

    static uppercase() {
        return (inst: VexilString) => inst.input === inst.input.toUpperCase();
    }

    static lowercase() {
        return (inst: VexilString) => inst.input === inst.input.toLowerCase();
    }

    static hasNumbers() {
        return (inst: VexilString) => /\d/.test(inst.input);
    }

    static hasLetters() {
        return (inst: VexilString) => /[a-zA-Z]/.test(inst.input);
    }

    static noSpaces() {
        return (inst: VexilString) => !/\s/.test(inst.input);
    }

    static isTrimmed() {
        return (inst: VexilString) => inst.input === inst.input.trim();
    }

    static inSet(...strings: string[]) {
        return (inst: VexilString) => strings.includes(inst.input);
    }
}

export class VexilBoolean extends Vexil<boolean> {

    public override validate(...args: (boolean | ((inst: VexilBoolean) => boolean))[]): boolean {
        return super.validate(...args, (typeof this.input === "boolean"));
    }

    static isTrue() {
        return (inst: VexilBoolean) => inst.input === true;
    }

    static isFalse() {
        return (inst: VexilBoolean) => inst.input === false;
    }
}
