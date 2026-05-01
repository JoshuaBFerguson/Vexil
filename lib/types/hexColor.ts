import Vexil from "../vexil";

const HEX_COLOR_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export class VexilHexColor extends Vexil<string> {
    public normalized?: string;
    public length?: number;

    constructor(input: string) {
        super(input);
        this.parse();
    }

    protected override parse() {
        const match = this.value.match(HEX_COLOR_REGEX);
        if (match) {
            const hex = match[1]!.toLowerCase();
            this.length = hex.length;
            this.normalized = `#${hex}`;
        } else {
            this.normalized = undefined;
            this.length = undefined;
        }
    }

    public override validate(...args: (boolean | ((inst: VexilHexColor) => boolean))[]): boolean {
        this.parse();
        return super.validate(...args, !!this.normalized);
    }

    static isShort() {
        return (inst: VexilHexColor): boolean => inst.length === 3 || inst.length === 4;
    }

    static isLong() {
        return (inst: VexilHexColor): boolean => inst.length === 6 || inst.length === 8;
    }

    static hasAlpha() {
        return (inst: VexilHexColor): boolean => inst.length === 4 || inst.length === 8;
    }
}
