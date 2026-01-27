import Vexil from "../vexil";

export class VexilEmailAddress extends Vexil<string> {
    public userName?: string;
    public hostName?: string;
    public domainName?: string;

    constructor(email: string) {
        super(email);
        this.parse();
    }

    private parse() {
        const match = this.input.match(/^([^@]+)@([^@]+)\.([^@]+)$/);
        if (match) {
            this.userName = match[1];
            this.hostName = match[2];
            this.domainName = match[3];
        }
    }

    public override validate(...args: (boolean | ((inst: VexilEmailAddress) => boolean))[]): boolean {
        return super.validate(...args as Array<boolean | ((inst: Vexil<string>) => boolean)>, !!this.userName, !!this.hostName, !!this.domainName);
    }

    static allowedDomains(...args: string[]) {
        const cleanDomains = args.map((d) => d[0] === "." ? d.slice(1) : d);
        return (inst: VexilEmailAddress): boolean => !!inst.domainName && cleanDomains.includes(inst.domainName);
    }

    static disallowedDomains(...args: string[]) {
        const cleanDomains = args.map((d) => d[0] === "." ? d.slice(1) : d);
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
        return (inst: VexilEmailAddress): boolean => !!inst.domainName && args.includes(inst.domainName);
    }

    static noDotsInUsername() {
        return (inst: VexilEmailAddress): boolean => !!inst.userName && !inst.userName.includes(".");
    }

    static usernameMatchesPattern(pattern: RegExp) {
        return (inst: VexilEmailAddress): boolean => !!inst.userName && pattern.test(inst.userName);
    }
}