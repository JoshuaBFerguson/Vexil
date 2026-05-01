import * as path from "node:path";
import Vexil from "../vexil";

type PathStyle = "posix" | "windows";
type PathModule = typeof path.posix;

const WINDOWS_RESERVED_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i;
const WINDOWS_INVALID_FILENAME_CHARS = /[<>:"/\\|?*\u0000]/;

function hasNullByte(input: string): boolean {
    return input.includes("\u0000");
}

function pathStyle(input: string): PathStyle {
    return /^[a-zA-Z]:[\\/]/.test(input) || input.startsWith("\\\\") || input.includes("\\")
        ? "windows"
        : "posix";
}

function pathModule(style: PathStyle): PathModule {
    return style === "windows" ? path.win32 : path.posix;
}

function splitSegments(input: string, style: PathStyle): string[] {
    const separator = style === "windows" ? /[\\/]+/ : /\/+/;
    return input.split(separator).filter(Boolean);
}

function normalizeExtension(input: string): string {
    return input.startsWith(".") ? input.toLowerCase() : `.${input.toLowerCase()}`;
}

export class VexilPath extends Vexil<string> {
    public style?: PathStyle;
    public normalized?: string;
    public directory?: string;
    public baseName?: string;
    public name?: string;
    public extension?: string;
    public segments: string[] = [];
    public isAbsolutePath = false;

    constructor(input: string) {
        super(input);
        this.parse();
    }

    protected override parse() {
        this.style = undefined;
        this.normalized = undefined;
        this.directory = undefined;
        this.baseName = undefined;
        this.name = undefined;
        this.extension = undefined;
        this.segments = [];
        this.isAbsolutePath = false;

        const trimmed = this.value.trim();
        if (!trimmed || hasNullByte(trimmed)) {
            return;
        }

        const style = pathStyle(trimmed);
        const parser = pathModule(style);
        const parsed = parser.parse(trimmed);

        this.style = style;
        const normalized = parser.normalize(trimmed);

        this.normalized = normalized;
        this.directory = parsed.dir || undefined;
        this.baseName = parsed.base || undefined;
        this.name = parsed.name || undefined;
        this.extension = parsed.ext ? parsed.ext.toLowerCase() : undefined;
        this.segments = splitSegments(normalized, style);
        this.isAbsolutePath = parser.isAbsolute(trimmed);
    }

    public override validate(...args: (boolean | ((inst: VexilPath) => boolean))[]): boolean {
        this.parse();
        return super.validate(...args, !!this.normalized);
    }

    static absolute() {
        return (inst: VexilPath): boolean => inst.isAbsolutePath;
    }

    static relative() {
        return (inst: VexilPath): boolean => !!inst.normalized && !inst.isAbsolutePath;
    }

    static hasExtension() {
        return (inst: VexilPath): boolean => !!inst.extension;
    }

    static extension(...extensions: string[]) {
        const normalized = extensions.map(normalizeExtension);
        return (inst: VexilPath): boolean => !!inst.extension && normalized.includes(inst.extension);
    }

    static baseName(name: string) {
        return (inst: VexilPath): boolean => inst.baseName === name;
    }

    static startsWith(prefix: string) {
        return (inst: VexilPath): boolean => !!inst.normalized && inst.normalized.startsWith(prefix);
    }

    static under(root: string) {
        return (inst: VexilPath): boolean => {
            if (!inst.normalized) {
                return false;
            }

            const style = inst.style ?? pathStyle(inst.normalized);
            const parser = pathModule(style);
            const relative = parser.relative(parser.normalize(root), inst.normalized);
            return relative.length > 0 && !relative.startsWith("..") && !parser.isAbsolute(relative);
        };
    }

    static noTraversal() {
        return (inst: VexilPath): boolean => inst.segments.every((segment) => segment !== "..");
    }

    static maxSegments(num: number) {
        return (inst: VexilPath): boolean => inst.segments.length <= num;
    }
}

export class VexilFileName extends Vexil<string> {
    public extension?: string;
    public name?: string;

    constructor(input: string) {
        super(input);
        this.parse();
    }

    protected override parse() {
        this.extension = undefined;
        this.name = undefined;

        const parsed = path.posix.parse(this.value);
        this.extension = parsed.ext ? parsed.ext.toLowerCase() : undefined;
        this.name = parsed.name || undefined;
    }

    public override validate(...args: (boolean | ((inst: VexilFileName) => boolean))[]): boolean {
        this.parse();
        return super.validate(
            ...args,
            this.value.trim().length > 0,
            !this.value.includes("/"),
            !this.value.includes("\\"),
            this.value !== "." && this.value !== "..",
            !WINDOWS_INVALID_FILENAME_CHARS.test(this.value),
            !WINDOWS_RESERVED_NAMES.test(this.value)
        );
    }

    static hasExtension() {
        return (inst: VexilFileName): boolean => !!inst.extension;
    }

    static extension(...extensions: string[]) {
        const normalized = extensions.map(normalizeExtension);
        return (inst: VexilFileName): boolean => !!inst.extension && normalized.includes(inst.extension);
    }

    static minLength(num: number) {
        return (inst: VexilFileName): boolean => inst.value.length >= num;
    }

    static maxLength(num: number) {
        return (inst: VexilFileName): boolean => inst.value.length <= num;
    }
}

export class VexilFileExtension extends Vexil<string> {
    public normalized?: string;

    constructor(input: string) {
        super(input);
        this.parse();
    }

    protected override parse() {
        this.normalized = undefined;

        const trimmed = this.value.trim();
        if (!trimmed || hasNullByte(trimmed) || trimmed.includes("/") || trimmed.includes("\\")) {
            return;
        }

        const normalized = normalizeExtension(trimmed);
        if (/^\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/i.test(normalized)) {
            this.normalized = normalized;
        }
    }

    public override validate(...args: (boolean | ((inst: VexilFileExtension) => boolean))[]): boolean {
        this.parse();
        return super.validate(...args, !!this.normalized);
    }

    static inSet(...extensions: string[]) {
        const normalized = extensions.map(normalizeExtension);
        return (inst: VexilFileExtension): boolean => !!inst.normalized && normalized.includes(inst.normalized);
    }

    static compound() {
        return (inst: VexilFileExtension): boolean => !!inst.normalized && inst.normalized.slice(1).includes(".");
    }
}
