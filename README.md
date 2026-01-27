# Vexil

Vexil is a lightweight TypeScript validation toolkit built around small, composable type helpers. Each helper is a class that wraps a value and exposes `validate()` with a set of reusable predicates. The goal is a smoother developer experience when adding type-aware validation without bringing in a heavy schema library.

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
```

## Included Types
- Primitives: `Number`, `String`, `Boolean`
- Formats: `EmailAddress`, `Currency`, `URL`, `UUID`, `HexColor`
- Dates: `Date`

## Install & Run (Bun)
```bash
bun install
bun run index.ts
```

## How It Works
Each type class extends a base `Vexil<T>` wrapper and exposes static predicate helpers:
- Construct the validator with a value.
- Call `validate()` with any number of predicates.
- Predicates can be built-in or custom functions that receive the instance.

## Status
Active and evolving. New validators and type classes are added as common needs surface.
