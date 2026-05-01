# Vexil

Vexil is a lightweight TypeScript validation toolkit built around small, composable type helpers. Each helper is a class that wraps a value and exposes `validate()` with a set of reusable predicates. The goal is a smoother developer experience when adding type-aware validation without bringing in a heavy schema library.

The name comes from the Latin word "vexillum":
"a military standard"

## Purpose
- Provide simple, chainable validation helpers for common primitives and formats.
- Keep validators small, readable, and easy to reuse across codebases.
- Offer a type-focused API that feels natural in TypeScript.

## Quick Example
```ts
import vxl from "./lib";

const age = new vxl.Number(28);
const isAgeValid = age.validate(
  vxl.Number.greaterThan(0),
  vxl.Number.lessThan(130)
);

const email = new vxl.EmailAddress("me@example.com");
const isEmailValid = email.validate(
  vxl.EmailAddress.allowedDomains("com", "net")
);

const slug = new vxl.Slug("daily-build-notes");
const isSlugValid = slug.validate(vxl.Slug.maxLength(80));

const path = new vxl.Path("src/components/Button.tsx");
const isPathValid = path.validate(
  vxl.Path.extension("tsx"),
  vxl.Path.noTraversal()
);

const cookie = new vxl.Cookie("session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax");
const isCookieValid = cookie.validate(
  vxl.Cookie.secure(),
  vxl.Cookie.httpOnly()
);

const createdCookie = vxl.Cookie.create("theme", "dark", {
  path: "/",
  sameSite: "Lax",
  secure: true
});
const readCookie = vxl.Cookie.read("theme=dark; session=abc123", "session");
const updatedCookie = vxl.Cookie.update(cookie, { value: "def456" });
const deletedCookie = vxl.Cookie.delete("session", { path: "/" });

const dimensions = new vxl.ElementDimensions({ x: 0, y: 0, width: 320, height: 180 });
const isElementSizeValid = dimensions.validate(
  vxl.ElementDimensions.visible(),
  vxl.ElementDimensions.aspectRatio(16 / 9),
  vxl.ElementDimensions.withinViewport(1024, 768)
);

const elementDimensionsInput = vxl.ElementDimensions.fromElement(element);
const elementDimensions = new vxl.ElementDimensions(elementDimensionsInput);
const updatedElement = elementDimensions.applyToElement(element);
```

## Included Types
- Primitives: `Number`, `String`, `Boolean`
- Formats: `EmailAddress`, `Currency`, `URL`, `UUID`, `HexColor`, `Slug`, `PhoneNumber`, `IPAddress`
- File system: `Path`, `FileName`, `FileExtension`
- Browser: `Cookie`, `CookieName`, `CookieValue`, `ElementDimensions`
- Dates: `Date`

## Install & Run (Bun)
```bash
bun install
bun run dev
bun test
```

## How It Works
Each type class extends a base `Vexil<T>` wrapper and exposes static predicate helpers:
- Construct the validator with a value.
- Call `validate()` with any number of predicates.
- Predicates can be built-in or custom functions that receive the instance.

## Status
Active and evolving. New validators and type classes are added as common needs surface.
