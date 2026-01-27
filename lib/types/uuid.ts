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
        if (UUID_REGEX.test(this.value)) {
            this.normalized = this.value.toLowerCase();
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

    static create(): string {
        // Generate a random UUID v4
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
