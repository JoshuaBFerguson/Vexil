import Vexil from "../vexil";

type ParsedURL = {
    protocol: string;
    hostname: string;
    pathname: string;
    search: string;
    hash: string;
    port: string;
};

interface URLConstructor {
    new (input: string): ParsedURL;
}

function getURLCtor(): ((input: string) => ParsedURL) | undefined {
    const ctor = (globalThis as unknown as { URL?: (input: string) => ParsedURL }).URL;
    return typeof ctor === "function" ? ctor : undefined;
}

export class VexilURL extends Vexil<string> {
    public url?: ParsedURL;

    constructor(input: string) {
        super(input);
        this.parse();
    }

    private parse() {
        try {
            const URLCtor = getURLCtor() as URLConstructor | undefined;
            this.url = URLCtor ? new URLCtor(this.input) : undefined;
        } catch {
            this.url = undefined;
        }
    }

    public override validate(...args: (boolean | ((inst: VexilURL) => boolean))[]): boolean {
        return super.validate(...args, !!this.url);
    }

    static allowedProtocols(...protocols: string[]) {
        const normalized = protocols.map((p) => p.endsWith(":") ? p : `${p}:`);
        return (inst: VexilURL): boolean => !!inst.url && normalized.includes(inst.url.protocol);
    }

    static httpsOnly() {
        return (inst: VexilURL): boolean => !!inst.url && inst.url.protocol === "https:";
    }

    static allowedHosts(...hosts: string[]) {
        return (inst: VexilURL): boolean => !!inst.url && hosts.includes(inst.url.hostname);
    }

    static disallowedHosts(...hosts: string[]) {
        return (inst: VexilURL): boolean => !inst.url || !hosts.includes(inst.url.hostname);
    }

    static hasPath() {
        return (inst: VexilURL): boolean => !!inst.url && inst.url.pathname !== "/" && inst.url.pathname.length > 0;
    }

    static pathStartsWith(prefix: string) {
        return (inst: VexilURL): boolean => !!inst.url && inst.url.pathname.startsWith(prefix);
    }

    static hasQuery() {
        return (inst: VexilURL): boolean => !!inst.url && inst.url.search.length > 0;
    }

    static hasHash() {
        return (inst: VexilURL): boolean => !!inst.url && inst.url.hash.length > 0;
    }

    static hasPort() {
        return (inst: VexilURL): boolean => !!inst.url && inst.url.port.length > 0;
    }
}
