import Vexil from "../vexil";

type SameSite = "Strict" | "Lax" | "None";
type CookieInput = string | VexilCookie;

export type CookieOptions = {
    expires?: Date | string | number;
    maxAge?: number;
    domain?: string;
    path?: string;
    sameSite?: SameSite;
    secure?: boolean;
    httpOnly?: boolean;
    partitioned?: boolean;
};

export type CookieUpdate = CookieOptions & {
    value?: string;
};

export type CookieDeleteOptions = Pick<CookieOptions, "domain" | "path" | "sameSite" | "secure" | "partitioned">;

const COOKIE_NAME_REGEX = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
const COOKIE_OCTET_REGEX = /^[\u0021\u0023-\u002b\u002d-\u003a\u003c-\u005b\u005d-\u007e]*$/;
const DOMAIN_REGEX = /^(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/i;

function parseCookiePair(input: string): { name: string; value: string } | undefined {
    const separator = input.indexOf("=");
    if (separator <= 0) {
        return undefined;
    }

    const name = input.slice(0, separator).trim();
    const value = input.slice(separator + 1).trim();
    return { name, value };
}

function isValidCookieName(name: string): boolean {
    return COOKIE_NAME_REGEX.test(name);
}

function isValidCookieValue(value: string): boolean {
    if (value.startsWith("\"") || value.endsWith("\"")) {
        return value.length >= 2 && value.startsWith("\"") && value.endsWith("\"") && COOKIE_OCTET_REGEX.test(value.slice(1, -1));
    }

    return COOKIE_OCTET_REGEX.test(value);
}

function normalizeSameSite(input: string): SameSite | undefined {
    const lower = input.toLowerCase();
    if (lower === "strict") {
        return "Strict";
    }

    if (lower === "lax") {
        return "Lax";
    }

    if (lower === "none") {
        return "None";
    }

    return undefined;
}

function normalizeExpires(input: Date | string | number): Date | undefined {
    const date = input instanceof Date ? input : new Date(input);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
    const parts = [`${name}=${value}`];
    const expires = options.expires === undefined ? undefined : normalizeExpires(options.expires);

    if (expires) {
        parts.push(`Expires=${expires.toUTCString()}`);
    }

    if (options.maxAge !== undefined) {
        parts.push(`Max-Age=${Math.trunc(options.maxAge)}`);
    }

    if (options.domain) {
        parts.push(`Domain=${options.domain.toLowerCase().replace(/^\./, "")}`);
    }

    if (options.path) {
        parts.push(`Path=${options.path}`);
    }

    if (options.sameSite) {
        parts.push(`SameSite=${options.sameSite}`);
    }

    if (options.secure) {
        parts.push("Secure");
    }

    if (options.httpOnly) {
        parts.push("HttpOnly");
    }

    if (options.partitioned) {
        parts.push("Partitioned");
    }

    return parts.join("; ");
}

function optionsFromCookie(cookie: VexilCookie): CookieOptions {
    return {
        expires: cookie.expires,
        maxAge: cookie.maxAge,
        domain: cookie.domain,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure || undefined,
        httpOnly: cookie.httpOnly || undefined,
        partitioned: cookie.partitioned || undefined
    };
}

function resolveCookie(input: CookieInput): VexilCookie {
    return typeof input === "string" ? new VexilCookie(input) : input;
}

export class VexilCookieName extends Vexil<string> {
    constructor(input: string) {
        super(input);
    }

    public override validate(...args: (boolean | ((inst: VexilCookieName) => boolean))[]): boolean {
        return super.validate(...args, isValidCookieName(this.value));
    }

    static prefix(prefix: "__Host-" | "__Secure-" | string) {
        return (inst: VexilCookieName): boolean => inst.value.startsWith(prefix);
    }

    static maxLength(num: number) {
        return (inst: VexilCookieName): boolean => inst.value.length <= num;
    }
}

export class VexilCookieValue extends Vexil<string> {
    public decoded?: string;

    constructor(input: string) {
        super(input);
        this.parse();
    }

    protected override parse() {
        this.decoded = undefined;

        try {
            this.decoded = decodeURIComponent(this.value);
        } catch {
            this.decoded = undefined;
        }
    }

    public override validate(...args: (boolean | ((inst: VexilCookieValue) => boolean))[]): boolean {
        this.parse();
        return super.validate(...args, isValidCookieValue(this.value));
    }

    static encoded() {
        return (inst: VexilCookieValue): boolean => !!inst.decoded && encodeURIComponent(inst.decoded) === inst.value;
    }

    static maxLength(num: number) {
        return (inst: VexilCookieValue): boolean => inst.value.length <= num;
    }
}

export class VexilCookie extends Vexil<string> {
    public name?: string;
    public cookieValue?: string;
    public attributes: Record<string, string | true> = {};
    public expires?: Date;
    public maxAge?: number;
    public domain?: string;
    public path?: string;
    public sameSite?: SameSite;
    public secure = false;
    public httpOnly = false;
    public partitioned = false;

    constructor(input: string) {
        super(input);
        this.parse();
    }

    protected override parse() {
        this.name = undefined;
        this.cookieValue = undefined;
        this.attributes = {};
        this.expires = undefined;
        this.maxAge = undefined;
        this.domain = undefined;
        this.path = undefined;
        this.sameSite = undefined;
        this.secure = false;
        this.httpOnly = false;
        this.partitioned = false;

        const parts = this.value.split(";").map((part) => part.trim());
        const first = parts.shift();
        if (!first) {
            return;
        }

        const pair = parseCookiePair(first);
        if (!pair) {
            return;
        }

        this.name = pair.name;
        this.cookieValue = pair.value;

        for (const attr of parts) {
            if (!attr) {
                continue;
            }

            const attrPair = parseCookiePair(attr);
            const rawName = (attrPair?.name ?? attr).trim();
            const rawValue = attrPair?.value.trim();
            const key = rawName.toLowerCase();

            this.attributes[key] = rawValue ?? true;

            if (key === "expires" && rawValue) {
                const expires = new Date(rawValue);
                this.expires = Number.isNaN(expires.getTime()) ? undefined : expires;
            } else if (key === "max-age" && rawValue && /^-?\d+$/.test(rawValue)) {
                this.maxAge = Number(rawValue);
            } else if (key === "domain" && rawValue) {
                this.domain = rawValue.toLowerCase().replace(/^\./, "");
            } else if (key === "path" && rawValue) {
                this.path = rawValue;
            } else if (key === "samesite" && rawValue) {
                this.sameSite = normalizeSameSite(rawValue);
            } else if (key === "secure") {
                this.secure = true;
            } else if (key === "httponly") {
                this.httpOnly = true;
            } else if (key === "partitioned") {
                this.partitioned = true;
            }
        }
    }

    public override validate(...args: (boolean | ((inst: VexilCookie) => boolean))[]): boolean {
        this.parse();
        return super.validate(
            ...args,
            !!this.name && isValidCookieName(this.name),
            this.cookieValue !== undefined && isValidCookieValue(this.cookieValue),
            this.sameSite !== "None" || this.secure,
            !this.partitioned || this.secure
        );
    }

    static named(name: string) {
        return (inst: VexilCookie): boolean => inst.name === name;
    }

    static secure() {
        return (inst: VexilCookie): boolean => inst.secure;
    }

    static httpOnly() {
        return (inst: VexilCookie): boolean => inst.httpOnly;
    }

    static sameSite(value: SameSite) {
        return (inst: VexilCookie): boolean => inst.sameSite === value;
    }

    static session() {
        return (inst: VexilCookie): boolean => inst.expires === undefined && inst.maxAge === undefined;
    }

    static persistent() {
        return (inst: VexilCookie): boolean => inst.expires !== undefined || inst.maxAge !== undefined;
    }

    static domain(domain: string) {
        const normalized = domain.toLowerCase().replace(/^\./, "");
        return (inst: VexilCookie): boolean => inst.domain === normalized;
    }

    static validDomain() {
        return (inst: VexilCookie): boolean => inst.domain === undefined || DOMAIN_REGEX.test(inst.domain);
    }

    static pathStartsWith(prefix: string) {
        return (inst: VexilCookie): boolean => !!inst.path && inst.path.startsWith(prefix);
    }

    static hostPrefixCompliant() {
        return (inst: VexilCookie): boolean =>
            !inst.name?.startsWith("__Host-") ||
            (inst.secure && inst.path === "/" && inst.domain === undefined);
    }

    static securePrefixCompliant() {
        return (inst: VexilCookie): boolean => !inst.name?.startsWith("__Secure-") || inst.secure;
    }

    static create(name: string, value: string, options: CookieOptions = {}) {
        return new VexilCookie(serializeCookie(name, value, options));
    }

    static read(cookieHeader: string, name: string) {
        const cookies = cookieHeader.split(";").map((part) => part.trim()).filter(Boolean);

        for (const cookie of cookies) {
            const pair = parseCookiePair(cookie);
            if (pair?.name === name) {
                return new VexilCookie(`${pair.name}=${pair.value}`);
            }
        }

        return undefined;
    }

    static update(input: CookieInput, updates: CookieUpdate) {
        const cookie = resolveCookie(input);
        cookie.parse();

        if (!cookie.name || cookie.cookieValue === undefined) {
            return new VexilCookie("");
        }

        const options = {
            ...optionsFromCookie(cookie),
            ...updates
        };

        return new VexilCookie(serializeCookie(cookie.name, updates.value ?? cookie.cookieValue, options));
    }

    static delete(name: string, options: CookieDeleteOptions = {}) {
        return new VexilCookie(serializeCookie(name, "", {
            ...options,
            expires: new Date(0),
            maxAge: 0
        }));
    }

    static remove(name: string, options: CookieDeleteOptions = {}) {
        return VexilCookie.delete(name, options);
    }
}
