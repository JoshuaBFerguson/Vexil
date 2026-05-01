import { describe, expect, test } from "bun:test";
import vxl from "./index";

describe("parsed validators", () => {
    test("email parses during construction and after value changes", () => {
        const email = new vxl.EmailAddress("ME@Example.COM");

        expect(email.validate()).toBe(true);
        expect(email.fullDomain).toBe("example.com");
        expect(email.validate(vxl.EmailAddress.allowedDomains(".COM"))).toBe(true);

        email.value = "not-an-email";
        expect(email.validate()).toBe(false);
        expect(email.userName).toBeUndefined();
        expect(email.fullDomain).toBeUndefined();
    });

    test("currency parses string and numeric inputs with currency codes", () => {
        const fromString = new vxl.Currency("12.50 usd");
        const fromNumber = new vxl.Currency(20, "eur");

        expect(fromString.validate(vxl.Currency.allowedCurrencies("USD"))).toBe(true);
        expect(fromString.amount).toBe(12.5);
        expect(fromString.currencyCode).toBe("USD");
        expect(fromNumber.validate(vxl.Currency.exactAmount(20), vxl.Currency.allowedCurrencies("EUR"))).toBe(true);
    });

    test("validation refreshes parsed state before intrinsic checks", () => {
        const currency = new vxl.Currency("not money");

        currency.amount = 10;
        currency.currencyCode = "USD";

        expect(currency.validate()).toBe(false);
        expect(currency.amount).toBeUndefined();
        expect(currency.currencyCode).toBeUndefined();
    });

    test("uuid supports v4 creation and nil checks", () => {
        const id = new vxl.UUID(vxl.UUID.create());
        const nil = new vxl.UUID("00000000-0000-0000-0000-000000000000");

        expect(id.validate(vxl.UUID.v4())).toBe(true);
        expect(nil.validate(vxl.UUID.isNil())).toBe(true);
    });
});

describe("everyday validators", () => {
    test("slug validates route-safe values and exposes normalized output", () => {
        const slug = new vxl.Slug("post-title-123");
        const draft = new vxl.Slug("Post Title!");

        expect(slug.validate(vxl.Slug.segmentCount(3))).toBe(true);
        expect(draft.validate()).toBe(false);
        expect(draft.normalized).toBe("post-title");
    });

    test("phone number validates common formatted input and e164 input", () => {
        const local = new vxl.PhoneNumber("(555) 123-4567");
        const intl = new vxl.PhoneNumber("+15551234567");

        expect(local.validate(vxl.PhoneNumber.us())).toBe(true);
        expect(intl.validate(vxl.PhoneNumber.e164(), vxl.PhoneNumber.countryCode(1))).toBe(true);
    });

    test("ip address detects versions and private ranges", () => {
        const privateIp = new vxl.IPAddress("192.168.1.10");
        const publicIp = new vxl.IPAddress("8.8.8.8");
        const linkLocal = new vxl.IPAddress("169.254.1.1");
        const v6 = new vxl.IPAddress("2001:4860:4860::8888");

        expect(privateIp.validate(vxl.IPAddress.v4(), vxl.IPAddress.privateRange())).toBe(true);
        expect(publicIp.validate(vxl.IPAddress.publicRange())).toBe(true);
        expect(linkLocal.validate(vxl.IPAddress.publicRange())).toBe(false);
        expect(v6.validate(vxl.IPAddress.v6())).toBe(true);
    });

    test("path validates normalized paths and traversal constraints", () => {
        const path = new vxl.Path("src/components/Button.tsx");
        const unsafePath = new vxl.Path("../secrets.env");

        expect(path.validate(vxl.Path.relative(), vxl.Path.extension("tsx"), vxl.Path.noTraversal())).toBe(true);
        expect(path.baseName).toBe("Button.tsx");
        expect(unsafePath.validate(vxl.Path.noTraversal())).toBe(false);
    });

    test("file name rejects separators and reserved names", () => {
        const fileName = new vxl.FileName("report.pdf");
        const nested = new vxl.FileName("reports/report.pdf");
        const reserved = new vxl.FileName("CON");

        expect(fileName.validate(vxl.FileName.extension(".pdf"))).toBe(true);
        expect(nested.validate()).toBe(false);
        expect(reserved.validate()).toBe(false);
    });

    test("file extension normalizes dotted and bare extensions", () => {
        const ts = new vxl.FileExtension("TS");
        const tarball = new vxl.FileExtension(".tar.gz");

        expect(ts.validate(vxl.FileExtension.inSet(".ts"))).toBe(true);
        expect(ts.normalized).toBe(".ts");
        expect(tarball.validate(vxl.FileExtension.compound())).toBe(true);
    });

    test("cookie parses set-cookie strings and common security attributes", () => {
        const cookie = new vxl.Cookie("session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600");

        expect(cookie.validate(vxl.Cookie.named("session"), vxl.Cookie.secure(), vxl.Cookie.httpOnly())).toBe(true);
        expect(cookie.cookieValue).toBe("abc123");
        expect(cookie.path).toBe("/");
        expect(cookie.sameSite).toBe("Lax");
        expect(cookie.maxAge).toBe(3600);
        expect(cookie.validate(vxl.Cookie.persistent())).toBe(true);
    });

    test("cookie enforces browser security relationships", () => {
        const sameSiteNone = new vxl.Cookie("id=1; SameSite=None");
        const partitioned = new vxl.Cookie("id=1; Partitioned");
        const hostCookie = new vxl.Cookie("__Host-id=1; Secure; Path=/");
        const badHostCookie = new vxl.Cookie("__Host-id=1; Secure; Domain=example.com; Path=/");

        expect(sameSiteNone.validate()).toBe(false);
        expect(partitioned.validate()).toBe(false);
        expect(hostCookie.validate(vxl.Cookie.hostPrefixCompliant())).toBe(true);
        expect(badHostCookie.validate(vxl.Cookie.hostPrefixCompliant())).toBe(false);
    });

    test("cookie name and value validate standalone syntax", () => {
        const name = new vxl.CookieName("__Secure-token");
        const value = new vxl.CookieValue("hello%20world");
        const badName = new vxl.CookieName("bad name");

        expect(name.validate(vxl.CookieName.prefix("__Secure-"))).toBe(true);
        expect(value.validate(vxl.CookieValue.encoded())).toBe(true);
        expect(value.decoded).toBe("hello world");
        expect(badName.validate()).toBe(false);
    });

    test("cookie create builds a valid set-cookie string", () => {
        const cookie = vxl.Cookie.create("theme", "dark", {
            path: "/",
            maxAge: 3600,
            sameSite: "Lax",
            secure: true
        });

        expect(cookie.value).toBe("theme=dark; Max-Age=3600; Path=/; SameSite=Lax; Secure");
        expect(cookie.validate(vxl.Cookie.named("theme"), vxl.Cookie.secure(), vxl.Cookie.persistent())).toBe(true);
    });

    test("cookie read finds a value from document-cookie style strings", () => {
        const cookie = vxl.Cookie.read("theme=dark; session=abc123; locale=en-US", "session");
        const missing = vxl.Cookie.read("theme=dark", "session");

        expect(cookie?.validate(vxl.Cookie.named("session"))).toBe(true);
        expect(cookie?.cookieValue).toBe("abc123");
        expect(missing).toBeUndefined();
    });

    test("cookie update preserves attributes and changes requested fields", () => {
        const cookie = new vxl.Cookie("session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax");
        const updated = vxl.Cookie.update(cookie, {
            value: "def456",
            sameSite: "Strict"
        });

        expect(updated.value).toBe("session=def456; Path=/; SameSite=Strict; Secure; HttpOnly");
        expect(updated.validate(vxl.Cookie.httpOnly(), vxl.Cookie.secure(), vxl.Cookie.sameSite("Strict"))).toBe(true);
    });

    test("cookie delete returns an expired set-cookie string", () => {
        const deleted = vxl.Cookie.delete("session", {
            path: "/",
            secure: true
        });

        expect(deleted.value).toBe("session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/; Secure");
        expect(deleted.validate(vxl.Cookie.named("session"), vxl.Cookie.persistent())).toBe(true);
        expect(deleted.maxAge).toBe(0);
    });

    test("element dimensions parse plain rect-like objects", () => {
        const rect = new vxl.ElementDimensions({
            x: 10,
            y: 20,
            width: 320,
            height: 180
        });

        expect(rect.validate(
            vxl.ElementDimensions.visible(),
            vxl.ElementDimensions.aspectRatio(16 / 9),
            vxl.ElementDimensions.withinViewport(1024, 768)
        )).toBe(true);
        expect(rect.right).toBe(330);
        expect(rect.bottom).toBe(200);
        expect(rect.area).toBe(57600);
        expect(rect.centerX).toBe(170);
        expect(rect.centerY).toBe(110);
    });

    test("element dimensions parse getBoundingClientRect inputs", () => {
        const element = {
            getBoundingClientRect() {
                return {
                    left: -50,
                    top: 100,
                    right: 150,
                    bottom: 300,
                    width: 200,
                    height: 200
                };
            }
        };
        const rect = new vxl.ElementDimensions(element);

        expect(rect.validate(vxl.ElementDimensions.square(), vxl.ElementDimensions.intersectsViewport(1024, 768))).toBe(true);
        expect(rect.validate(vxl.ElementDimensions.withinViewport(1024, 768))).toBe(false);
    });

    test("element dimensions fromElement returns constructor-ready input", () => {
        const element = {
            getBoundingClientRect() {
                return {
                    x: 5,
                    y: 10,
                    left: 5,
                    top: 10,
                    right: 105,
                    bottom: 60,
                    width: 100,
                    height: 50
                };
            }
        };
        const input = vxl.ElementDimensions.fromElement(element);
        const rect = new vxl.ElementDimensions(input);

        expect(input).toEqual({
            x: 5,
            y: 10,
            left: 5,
            top: 10,
            right: 105,
            bottom: 60,
            width: 100,
            height: 50
        });
        expect(rect.validate(vxl.ElementDimensions.visible(), vxl.ElementDimensions.landscape())).toBe(true);
    });

    test("element dimensions reject inconsistent or invalid boxes", () => {
        const inconsistent = new vxl.ElementDimensions({
            left: 0,
            top: 0,
            right: 100,
            bottom: 50,
            width: 80,
            height: 50
        });
        const invalid = new vxl.ElementDimensions({
            width: Number.NaN,
            height: 20
        });

        expect(inconsistent.validate()).toBe(false);
        expect(invalid.validate()).toBe(false);
    });
});
