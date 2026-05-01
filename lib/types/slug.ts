import Vexil from "../vexil";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toSlug(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");
}

export class VexilSlug extends Vexil<string> {
    public normalized?: string;
    public segments: string[] = [];

    constructor(input: string) {
        super(input);
        this.parse();
    }

    protected override parse() {
        this.normalized = toSlug(this.value);
        this.segments = this.normalized ? this.normalized.split("-") : [];
    }

    public override validate(...args: (boolean | ((inst: VexilSlug) => boolean))[]): boolean {
        this.parse();
        return super.validate(...args, SLUG_REGEX.test(this.value));
    }

    static minLength(num: number) {
        return (inst: VexilSlug): boolean => inst.value.length >= num;
    }

    static maxLength(num: number) {
        return (inst: VexilSlug): boolean => inst.value.length <= num;
    }

    static exactLength(num: number) {
        return (inst: VexilSlug): boolean => inst.value.length === num;
    }

    static segmentCount(num: number) {
        return (inst: VexilSlug): boolean => inst.segments.length === num;
    }

    static startsWith(prefix: string) {
        return (inst: VexilSlug): boolean => inst.value.startsWith(prefix);
    }

    static endsWith(suffix: string) {
        return (inst: VexilSlug): boolean => inst.value.endsWith(suffix);
    }
}
