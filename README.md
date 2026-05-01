# Vexil

Vexil is a lightweight TypeScript validation toolkit built around small, composable type helpers. Each helper wraps a value and exposes `validate()` with reusable predicates.

The name comes from the Latin word "vexillum": "a military standard".

## Purpose

- Provide simple validation helpers for common primitives, browser values, file-system strings, and everyday formats.
- Keep validators small, readable, and easy to reuse.
- Offer a type-focused API that feels natural in TypeScript without requiring a heavy schema library.

## Install & Run

```bash
bun install
bun run dev
bun test
```

## How It Works

Every Vexil type follows the same shape:

- Construct the validator with a value.
- Call `validate()` with any number of predicates.
- Predicates can be built-in static helpers or custom functions that receive the instance.
- `isValid()` is an alias for `validate()`.

```ts
import vxl from "./lib";

const value = new vxl.String("hello");
const isValid = value.validate(vxl.String.notBlank());
```

## Primitive Types

### Number

Validates finite numbers and common numeric constraints.

Common validators: `greaterThan()`, `lessThan()`, `between()`, `min()`, `max()`, `integer()`, `safeInteger()`, `positive()`, `negative()`, `even()`, `odd()`, `divisibleBy()`, `inSet()`.

```ts
const age = new vxl.Number(28);

const isAgeValid = age.validate(
  vxl.Number.integer(),
  vxl.Number.min(18),
  vxl.Number.max(130),
);
```

### String

Validates strings and common content rules.

Common validators: `minLength()`, `maxLength()`, `exactLength()`, `notEmpty()`, `notBlank()`, `contains()`, `startsWith()`, `endsWith()`, `matchesPattern()`, `alphanumeric()`, `uppercase()`, `lowercase()`, `noSpaces()`, `isTrimmed()`, `inSet()`.

```ts
const username = new vxl.String("tom_123");

const isUsernameValid = username.validate(
  vxl.String.minLength(3),
  vxl.String.maxLength(32),
  vxl.String.matchesPattern(/^[a-z0-9_]+$/i),
);
```

### Boolean

Validates boolean values and expected truthiness.

Common validators: `isTrue()`, `isFalse()`.

```ts
const acceptedTerms = new vxl.Boolean(true);

const canContinue = acceptedTerms.validate(vxl.Boolean.isTrue());
```

## Format Types

### EmailAddress

Parses an email address into `userName`, `hostName`, `domainName`, and `fullDomain`.

Common validators: `allowedDomains()`, `disallowedDomains()`, `allowedUsernames()`, `requiredTLD()`, `allowedHosts()`, `noDotsInUsername()`, `usernameMatchesPattern()`, `hostMatchesPattern()`.

```ts
const email = new vxl.EmailAddress("me@example.com");

const isEmailValid = email.validate(
  vxl.EmailAddress.allowedDomains("com", "net"),
  vxl.EmailAddress.noDotsInUsername(),
);
```

### Currency

Parses currency strings like `"12.50 USD"` or numeric values with a currency code into `amount` and `currencyCode`.

Common validators: `allowedCurrencies()`, `disallowedCurrencies()`, `positiveAmount()`, `greaterThanAmount()`, `lessThanAmount()`, `betweenAmounts()`, `minAmount()`, `maxAmount()`, `exactAmount()`, `isWholeNumber()`, `hasDecimalPlaces()`, `zeroAmount()`.

```ts
const total = new vxl.Currency(42.5, "USD");

const isTotalValid = total.validate(
  vxl.Currency.allowedCurrencies("USD"),
  vxl.Currency.positiveAmount(),
  vxl.Currency.maxAmount(1000),
);
```

### URL

Parses valid URLs with the platform `URL` constructor and exposes the parsed `url`.

Common validators: `allowedProtocols()`, `httpsOnly()`, `allowedHosts()`, `disallowedHosts()`, `hasPath()`, `pathStartsWith()`, `hasQuery()`, `hasHash()`, `hasPort()`.

```ts
const callbackUrl = new vxl.URL("https://example.com/oauth/callback?code=123");

const isCallbackValid = callbackUrl.validate(
  vxl.URL.httpsOnly(),
  vxl.URL.allowedHosts("example.com"),
  vxl.URL.pathStartsWith("/oauth"),
);
```

### UUID

Validates UUID strings, exposes `normalized`, and can create UUID v4 strings.

Common validators: `isNil()`, `version()`, `v4()`, `create()`.

```ts
const id = new vxl.UUID(vxl.UUID.create());

const isIdValid = id.validate(vxl.UUID.v4());
```

### Date

Normalizes `Date`, string, or numeric date input into a `Date` value.

Common validators: `before()`, `after()`, `onOrBefore()`, `onOrAfter()`, `between()`, `isPast()`, `isFuture()`, `isWeekend()`, `isWeekday()`.

```ts
const launchDate = new vxl.Date("2026-05-01");

const isLaunchWindowValid = launchDate.validate(
  vxl.Date.onOrAfter("2026-01-01"),
  vxl.Date.onOrBefore("2026-12-31"),
  vxl.Date.isWeekday(),
);
```

### HexColor

Validates 3, 4, 6, and 8 digit hex colors and exposes `normalized` and `length`.

Common validators: `isShort()`, `isLong()`, `hasAlpha()`.

```ts
const color = new vxl.HexColor("#ffcc00");

const isColorValid = color.validate(vxl.HexColor.isLong());
```

### Slug

Validates route-safe lowercase slugs and exposes `normalized` and `segments`.

Common validators: `minLength()`, `maxLength()`, `exactLength()`, `segmentCount()`, `startsWith()`, `endsWith()`.

```ts
const slug = new vxl.Slug("daily-build-notes");

const isSlugValid = slug.validate(
  vxl.Slug.maxLength(80),
  vxl.Slug.segmentCount(3),
);
```

### PhoneNumber

Validates common phone number strings, extracts `digits`, and exposes `e164` when applicable.

Common validators: `e164()`, `countryCode()`, `us()`, `minDigits()`, `maxDigits()`.

```ts
const phone = new vxl.PhoneNumber("+15551234567");

const isPhoneValid = phone.validate(
  vxl.PhoneNumber.e164(),
  vxl.PhoneNumber.countryCode(1),
);
```

### IPAddress

Validates IPv4 and IPv6 strings using the platform IP parser and exposes `version` and `normalized`.

Common validators: `v4()`, `v6()`, `privateRange()`, `publicRange()`, `loopback()`.

```ts
const ip = new vxl.IPAddress("192.168.1.10");

const isPrivateIPv4 = ip.validate(
  vxl.IPAddress.v4(),
  vxl.IPAddress.privateRange(),
);
```

## File System Types

### Path

Validates path-like strings without touching the live file system. Parses `normalized`, `directory`, `baseName`, `name`, `extension`, `segments`, and `isAbsolutePath`.

Common validators: `absolute()`, `relative()`, `hasExtension()`, `extension()`, `baseName()`, `startsWith()`, `under()`, `noTraversal()`, `maxSegments()`.

```ts
const path = new vxl.Path("src/components/Button.tsx");

const isPathValid = path.validate(
  vxl.Path.relative(),
  vxl.Path.extension("tsx"),
  vxl.Path.noTraversal(),
);
```

### FileName

Validates a single file name and rejects path separators, Windows-invalid characters, and reserved Windows names.

Common validators: `hasExtension()`, `extension()`, `minLength()`, `maxLength()`.

```ts
const fileName = new vxl.FileName("report.pdf");

const isFileNameValid = fileName.validate(
  vxl.FileName.extension("pdf"),
  vxl.FileName.maxLength(120),
);
```

### FileExtension

Validates and normalizes file extensions such as `"ts"` to `".ts"`.

Common validators: `inSet()`, `compound()`.

```ts
const extension = new vxl.FileExtension("tar.gz");

const isArchiveExtension = extension.validate(
  vxl.FileExtension.compound(),
  vxl.FileExtension.inSet(".tar.gz"),
);
```

## Browser Types

### Cookie

Parses `Set-Cookie` style strings into `name`, `cookieValue`, `attributes`, `expires`, `maxAge`, `domain`, `path`, `sameSite`, `secure`, `httpOnly`, and `partitioned`.

Common validators: `named()`, `secure()`, `httpOnly()`, `sameSite()`, `session()`, `persistent()`, `domain()`, `validDomain()`, `pathStartsWith()`, `hostPrefixCompliant()`, `securePrefixCompliant()`.

CRUD helpers: `create()`, `read()`, `update()`, `delete()`, `remove()`.

```ts
const cookie = new vxl.Cookie(
  "session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax",
);

const isCookieValid = cookie.validate(
  vxl.Cookie.named("session"),
  vxl.Cookie.secure(),
  vxl.Cookie.httpOnly(),
);

const createdCookie = vxl.Cookie.create("theme", "dark", {
  path: "/",
  sameSite: "Lax",
  secure: true,
});

const readCookie = vxl.Cookie.read("theme=dark; session=abc123", "session");
const updatedCookie = vxl.Cookie.update(cookie, { value: "def456" });
const deletedCookie = vxl.Cookie.delete("session", { path: "/" });
```

### CookieName

Validates standalone cookie names.

Common validators: `prefix()`, `maxLength()`.

```ts
const cookieName = new vxl.CookieName("__Secure-token");

const isCookieNameValid = cookieName.validate(
  vxl.CookieName.prefix("__Secure-"),
  vxl.CookieName.maxLength(64),
);
```

### CookieValue

Validates standalone cookie values and exposes `decoded` when URI decoding succeeds.

Common validators: `encoded()`, `maxLength()`.

```ts
const cookieValue = new vxl.CookieValue("hello%20world");

const isCookieValueValid = cookieValue.validate(
  vxl.CookieValue.encoded(),
  vxl.CookieValue.maxLength(256),
);
```

### ElementDimensions

Validates browser element size and position data. Accepts DOMRect-like objects or element-like objects with `getBoundingClientRect()`. Parses `width`, `height`, `x`, `y`, `top`, `right`, `bottom`, `left`, `area`, `aspectRatio`, `centerX`, and `centerY`.

Common validators: `visible()`, `empty()`, `minWidth()`, `maxWidth()`, `minHeight()`, `maxHeight()`, `minArea()`, `maxArea()`, `aspectRatio()`, `landscape()`, `portrait()`, `square()`, `withinViewport()`, `intersectsViewport()`, `above()`, `below()`, `leftOf()`, `rightOf()`.

Helpers: `fromElement()` creates constructor-ready input from an element. `applyToElement()` applies the current dimensions to an element's style and returns the same element.

```ts
const dimensions = new vxl.ElementDimensions({
  x: 0,
  y: 0,
  width: 320,
  height: 180,
});

const isElementSizeValid = dimensions.validate(
  vxl.ElementDimensions.visible(),
  vxl.ElementDimensions.aspectRatio(16 / 9),
  vxl.ElementDimensions.withinViewport(1024, 768),
);

const element = {
  style: {},
  getBoundingClientRect() {
    return { x: 0, y: 0, width: 100, height: 50 };
  },
};

const elementDimensionsInput = vxl.ElementDimensions.fromElement(element);
const elementDimensions = new vxl.ElementDimensions(elementDimensionsInput);
const updatedElement = elementDimensions.applyToElement(element);
```

## Status

Active and evolving. New validators and type classes are added as common needs surface.
