import Vexil from "../vexil";

function regexTest(pattern: RegExp, value: string): boolean {
    pattern.lastIndex = 0;
    return pattern.test(value);
}

export class VexilEmailAddress extends Vexil<string> {
    public userName?: string;
    public hostName?: string;
    public domainName?: string; // TLD (last segment)
    public fullDomain?: string;

    constructor(email: string) {
        super(email);
        this.parse();
    }

    protected override parse() {
        this.userName = undefined;
        this.hostName = undefined;
        this.domainName = undefined;
        this.fullDomain = undefined;

        const match = this.value.match(/^([^@\s]+)@([^@\s]+)$/);
        if (match) {
            this.userName = match[1];
            const domain = match[2]?.toLowerCase();
            this.fullDomain = domain;
            const parts = (domain ?? "").split(".").filter(Boolean);
            if (parts.length >= 2) {
                this.domainName = parts[parts.length - 1];
                this.hostName = parts.slice(0, -1).join(".");
            }
        }
    }

    public override validate(...args: (boolean | ((inst: VexilEmailAddress) => boolean))[]): boolean {
        this.parse();
        return super.validate(
            ...args as Array<boolean | ((inst: Vexil<string>) => boolean)>,
            !!this.userName,
            !!this.hostName,
            !!this.domainName
        );
    }

    static allowedDomains(...args: string[]) {
        const cleanDomains = args.map((d) => (d[0] === "." ? d.slice(1) : d).toLowerCase());
        return (inst: VexilEmailAddress): boolean => !!inst.domainName && cleanDomains.includes(inst.domainName);
    }

    static disallowedDomains(...args: string[]) {
        const cleanDomains = args.map((d) => (d[0] === "." ? d.slice(1) : d).toLowerCase());
        return (inst: VexilEmailAddress): boolean => !inst.domainName || !cleanDomains.includes(inst.domainName);
    }

    static allowedUsernames(...args: string[]) {
        return (inst: VexilEmailAddress): boolean => !!inst.userName && args.includes(inst.userName);
    }

    static disallowedUsernames(...args: string[]) {
        return (inst: VexilEmailAddress): boolean => !inst.userName || !args.includes(inst.userName);
    }

    static minUsernameLength(len: number) {
        return (inst: VexilEmailAddress): boolean => !!inst.userName && inst.userName.length >= len;
    }

    static maxUsernameLength(len: number) {
        return (inst: VexilEmailAddress): boolean => !!inst.userName && inst.userName.length <= len;
    }

    static minDomainLength(len: number) {
        return (inst: VexilEmailAddress): boolean => !!inst.domainName && inst.domainName.length >= len;
    }

    static maxDomainLength(len: number) {
        return (inst: VexilEmailAddress): boolean => !!inst.domainName && inst.domainName.length <= len;
    }

    static requiredTLD(...args: string[]) {
        const cleanDomains = args.map((d) => (d[0] === "." ? d.slice(1) : d).toLowerCase());
        return (inst: VexilEmailAddress): boolean => !!inst.domainName && cleanDomains.includes(inst.domainName);
    }

    static allowedHosts(...args: string[]) {
        const cleanHosts = args.map((host) => host.toLowerCase());
        return (inst: VexilEmailAddress): boolean => !!inst.fullDomain && cleanHosts.includes(inst.fullDomain);
    }

    static disallowedHosts(...args: string[]) {
        const cleanHosts = args.map((host) => host.toLowerCase());
        return (inst: VexilEmailAddress): boolean => !inst.fullDomain || !cleanHosts.includes(inst.fullDomain);
    }

    static noDotsInUsername() {
        return (inst: VexilEmailAddress): boolean => !!inst.userName && !inst.userName.includes(".");
    }

    static usernameMatchesPattern(pattern: RegExp) {
        return (inst: VexilEmailAddress): boolean => !!inst.userName && regexTest(pattern, inst.userName);
    }

    static hostMatchesPattern(pattern: RegExp) {
        return (inst: VexilEmailAddress): boolean => !!inst.fullDomain && regexTest(pattern, inst.fullDomain);
    }
}
