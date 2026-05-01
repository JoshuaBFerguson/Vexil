import Vexil from "../vexil";

const PHONE_CHARS_REGEX = /^\+?[\d\s().-]+$/;
const E164_REGEX = /^\+[1-9]\d{1,14}$/;

export class VexilPhoneNumber extends Vexil<string> {
    public digits?: string;
    public e164?: string;

    constructor(input: string | number) {
        super(String(input));
        this.parse();
    }

    protected override parse() {
        this.digits = undefined;
        this.e164 = undefined;

        const cleaned = this.value.trim();
        if (!PHONE_CHARS_REGEX.test(cleaned) || (cleaned.match(/\+/g)?.length ?? 0) > 1 || (cleaned.includes("+") && !cleaned.startsWith("+"))) {
            return;
        }

        const digits = cleaned.replace(/\D/g, "");
        if (digits.length < 7 || digits.length > 15) {
            return;
        }

        this.digits = digits;
        this.e164 = cleaned.startsWith("+") && E164_REGEX.test(`+${digits}`) ? `+${digits}` : undefined;
    }

    public override validate(...args: (boolean | ((inst: VexilPhoneNumber) => boolean))[]): boolean {
        this.parse();
        return super.validate(...args, !!this.digits);
    }

    static e164() {
        return (inst: VexilPhoneNumber): boolean => !!inst.e164;
    }

    static countryCode(code: string | number) {
        const normalized = String(code).replace(/\D/g, "");
        return (inst: VexilPhoneNumber): boolean => normalized.length > 0 && !!inst.digits && inst.digits.startsWith(normalized);
    }

    static us() {
        return (inst: VexilPhoneNumber): boolean =>
            !!inst.digits &&
            (inst.digits.length === 10 || (inst.digits.length === 11 && inst.digits.startsWith("1")));
    }

    static minDigits(num: number) {
        return (inst: VexilPhoneNumber): boolean => !!inst.digits && inst.digits.length >= num;
    }

    static maxDigits(num: number) {
        return (inst: VexilPhoneNumber): boolean => !!inst.digits && inst.digits.length <= num;
    }
}
