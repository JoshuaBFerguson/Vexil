import Vexil from "../vexil";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

export class VexilUUID extends Vexil<string> {
    public normalized?: string;

    constructor(input: string) {
        super(input);
        this.parse();
    }

    private parse() {
        if (UUID_REGEX.test(this.input)) {
            this.normalized = this.input.toLowerCase();
        } else {
            this.normalized = undefined;
        }
    }

    public override validate(...args: (boolean | ((inst: VexilUUID) => boolean))[]): boolean {
        return super.validate(...args, !!this.normalized);
    }

    static isNil() {
        return (inst: VexilUUID): boolean => inst.normalized === NIL_UUID;
    }

    static version(ver: 1 | 2 | 3 | 4 | 5) {
        const char = String(ver);
        return (inst: VexilUUID): boolean => !!inst.normalized && inst.normalized[14] === char;
    }

    static v4() {
        return VexilUUID.version(4);
    }
}
