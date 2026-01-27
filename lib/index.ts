import * as Primitives from "./types/primitives";
import { VexilEmailAddress } from "./types/emailAddress";
import { VexilCurrency } from "./types/currency";

export default {
    String: Primitives.VexilString,
    Number: Primitives.VexilNumber,
    Boolean: Primitives.VexilBoolean,

    EmailAddress: VexilEmailAddress,
    Currency: VexilCurrency
};