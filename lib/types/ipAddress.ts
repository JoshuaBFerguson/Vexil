import { isIP } from "node:net";
import Vexil from "../vexil";

function ipv4Parts(input: string): number[] | undefined {
    const parts = input.split(".");
    if (parts.length !== 4) {
        return undefined;
    }

    const nums = parts.map((part) => Number(part));
    return nums.every((part, index) => String(part) === parts[index] && Number.isInteger(part) && part >= 0 && part <= 255)
        ? nums
        : undefined;
}

function isPrivateIPv4(input: string): boolean {
    const parts = ipv4Parts(input);
    if (!parts) {
        return false;
    }

    const first = parts[0]!;
    const second = parts[1]!;
    return first === 10 || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168);
}

function isLoopbackIPv4(input: string): boolean {
    const parts = ipv4Parts(input);
    return !!parts && parts[0] === 127;
}

function isNonPublicIPv4(input: string): boolean {
    const parts = ipv4Parts(input);
    if (!parts) {
        return false;
    }

    const first = parts[0]!;
    const second = parts[1]!;
    return (
        isPrivateIPv4(input) ||
        isLoopbackIPv4(input) ||
        first === 0 ||
        first >= 224 ||
        (first === 100 && second >= 64 && second <= 127) ||
        (first === 169 && second === 254) ||
        (first === 192 && second === 0) ||
        (first === 198 && (second === 18 || second === 19))
    );
}

function firstIPv6Hextet(input: string): number | undefined {
    const [first] = input.split(":");
    if (!first) {
        return 0;
    }

    const parsed = Number.parseInt(first, 16);
    return Number.isNaN(parsed) ? undefined : parsed;
}

function isPrivateIPv6(input: string): boolean {
    const first = firstIPv6Hextet(input);
    return first !== undefined && first >= 0xfc00 && first <= 0xfdff;
}

function isNonPublicIPv6(input: string): boolean {
    const first = firstIPv6Hextet(input);
    return (
        input === "::" ||
        input === "::1" ||
        isPrivateIPv6(input) ||
        (first !== undefined && first >= 0xfe80 && first <= 0xfebf) ||
        (first !== undefined && first >= 0xff00)
    );
}

function isPrivateIP(input: string): boolean {
    return isPrivateIPv4(input) || isPrivateIPv6(input);
}

function isNonPublicIP(input: string): boolean {
    return isNonPublicIPv4(input) || isNonPublicIPv6(input);
}

function isLoopbackIP(input: string): boolean {
    return isLoopbackIPv4(input) || input === "::1";
}

export class VexilIPAddress extends Vexil<string> {
    public version?: 4 | 6;
    public normalized?: string;

    constructor(input: string) {
        super(input);
        this.parse();
    }

    protected override parse() {
        const trimmed = this.value.trim();
        const version = isIP(trimmed);

        this.version = version === 4 || version === 6 ? version : undefined;
        this.normalized = this.version ? trimmed.toLowerCase() : undefined;
    }

    public override validate(...args: (boolean | ((inst: VexilIPAddress) => boolean))[]): boolean {
        this.parse();
        return super.validate(...args, !!this.version);
    }

    static v4() {
        return (inst: VexilIPAddress): boolean => inst.version === 4;
    }

    static v6() {
        return (inst: VexilIPAddress): boolean => inst.version === 6;
    }

    static privateRange() {
        return (inst: VexilIPAddress): boolean => !!inst.normalized && isPrivateIP(inst.normalized);
    }

    static publicRange() {
        return (inst: VexilIPAddress): boolean => !!inst.normalized && !isNonPublicIP(inst.normalized);
    }

    static loopback() {
        return (inst: VexilIPAddress): boolean => !!inst.normalized && isLoopbackIP(inst.normalized);
    }
}
