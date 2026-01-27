import * as Primitives from "./types/primitives";
import { VexilEmailAddress } from "./types/emailAddress";
import { VexilCurrency } from "./types/currency";
import { VexilURL } from "./types/url";
import { VexilUUID } from "./types/uuid";
import { VexilDate } from "./types/date";
import { VexilHexColor } from "./types/hexColor";

export default {
    String: Primitives.VexilString,
    Number: Primitives.VexilNumber,
    Boolean: Primitives.VexilBoolean,

    EmailAddress: VexilEmailAddress,
    Currency: VexilCurrency,
    URL: VexilURL,
    UUID: VexilUUID,
    Date: VexilDate,
    HexColor: VexilHexColor
};
