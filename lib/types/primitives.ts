import Vexil from "../vexil";

export class VexilNumber extends Vexil<number> {

    public override validate(...args: (boolean | ((inst: VexilNumber) => boolean))[]): boolean {
        return super.validate(...args, (Number.isFinite(this.value)));
    }

    static greaterThan(num: number) {
        return (inst: VexilNumber) => inst.value > num;
    }

    static lessThan(num: number) {
        return (inst: VexilNumber) => inst.value < num;
    }

    static between(min: number, max: number) {
        return (inst: VexilNumber) => inst.value > min && inst.value < max;
    }

    static equalTo(num: number) {
        return (inst: VexilNumber) => inst.value === num;
    }

    static notEqualTo(num: number) {
        return (inst: VexilNumber) => inst.value !== num;
    }

    static positive() {
        return (inst: VexilNumber) => inst.value > 0;
    }

    static nonNegative() {
        return (inst: VexilNumber) => inst.value >= 0;
    }

    static negative() {
        return (inst: VexilNumber) => inst.value < 0;
    }

    static nonPositive() {
        return (inst: VexilNumber) => inst.value <= 0;
    }

    static zero() {
        return (inst: VexilNumber) => inst.value === 0;
    }

    static min(num: number) {
        return (inst: VexilNumber) => inst.value >= num;
    }

    static max(num: number) {
        return (inst: VexilNumber) => inst.value <= num;
    }

    static integer() {
        return (inst: VexilNumber) => Number.isInteger(inst.value);
    }

    static safeInteger() {
        return (inst: VexilNumber) => Number.isSafeInteger(inst.value);
    }

    static decimal() {
        return (inst: VexilNumber) => !Number.isInteger(inst.value);
    }

    static even() {
        return (inst: VexilNumber) => Number.isInteger(inst.value) && inst.value % 2 === 0;
    }

    static odd() {
        return (inst: VexilNumber) => Number.isInteger(inst.value) && inst.value % 2 !== 0;
    }

    static divisibleBy(num: number) {
        return (inst: VexilNumber) => inst.value % num === 0;
    }

    static inSet(...nums: number[]) {
        return (inst: VexilNumber) => nums.includes(inst.value);
    }
}

export class VexilString extends Vexil<string> {

    public override validate(...args: (boolean | ((inst: VexilString) => boolean))[]): boolean {
        return super.validate(...args, (typeof this.value === "string"));
    }

    static minLength(num: number) {
        return (inst: VexilString) => inst.value.length >= num;
    }

    static maxLength(num: number) {
        return (inst: VexilString) => inst.value.length <= num;
    }

    static exactLength(num: number) {
        return (inst: VexilString) => inst.value.length === num;
    }

    static notEmpty() {
        return (inst: VexilString) => inst.value.length > 0;
    }

    static notBlank() {
        return (inst: VexilString) => inst.value.trim().length > 0;
    }

    static contains(substring: string) {
        return (inst: VexilString) => inst.value.includes(substring);
    }

    static containsAny(...substrings: string[]) {
        return (inst: VexilString) => substrings.some((s) => inst.value.includes(s));
    }

    static startsWith(prefix: string) {
        return (inst: VexilString) => inst.value.startsWith(prefix);
    }

    static endsWith(suffix: string) {
        return (inst: VexilString) => inst.value.endsWith(suffix);
    }

    static matchesPattern(pattern: RegExp) {
        return (inst: VexilString) => pattern.test(inst.value);
    }

    static alphanumeric() {
        return (inst: VexilString) => /^[a-zA-Z0-9]+$/.test(inst.value);
    }

    static alphabetic() {
        return (inst: VexilString) => /^[a-zA-Z]+$/.test(inst.value);
    }

    static numeric() {
        return (inst: VexilString) => /^[0-9]+$/.test(inst.value);
    }

    static uppercase() {
        return (inst: VexilString) => inst.value === inst.value.toUpperCase();
    }

    static lowercase() {
        return (inst: VexilString) => inst.value === inst.value.toLowerCase();
    }

    static hasNumbers() {
        return (inst: VexilString) => /\d/.test(inst.value);
    }

    static hasLetters() {
        return (inst: VexilString) => /[a-zA-Z]/.test(inst.value);
    }

    static noSpaces() {
        return (inst: VexilString) => !/\s/.test(inst.value);
    }

    static isTrimmed() {
        return (inst: VexilString) => inst.value === inst.value.trim();
    }

    static inSet(...strings: string[]) {
        return (inst: VexilString) => strings.includes(inst.value);
    }
}

export class VexilBoolean extends Vexil<boolean> {

    public override validate(...args: (boolean | ((inst: VexilBoolean) => boolean))[]): boolean {
        return super.validate(...args, (typeof this.value === "boolean"));
    }

    static isTrue() {
        return (inst: VexilBoolean) => inst.value === true;
    }

    static isFalse() {
        return (inst: VexilBoolean) => inst.value === false;
    }
}
