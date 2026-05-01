import * as Primitives from "./types/primitives";
import { VexilEmailAddress } from "./types/emailAddress";
import { VexilCurrency } from "./types/currency";
import { VexilURL } from "./types/url";
import { VexilUUID } from "./types/uuid";
import { VexilDate } from "./types/date";
import { VexilHexColor } from "./types/hexColor";
import { VexilSlug } from "./types/slug";
import { VexilPhoneNumber } from "./types/phoneNumber";
import { VexilIPAddress } from "./types/ipAddress";

export default {
    String: Primitives.VexilString,
    Number: Primitives.VexilNumber,
    Boolean: Primitives.VexilBoolean,

    EmailAddress: VexilEmailAddress,
    Currency: VexilCurrency,
    URL: VexilURL,
    UUID: VexilUUID,
    Date: VexilDate,
    HexColor: VexilHexColor,
    Slug: VexilSlug,
    PhoneNumber: VexilPhoneNumber,
    IPAddress: VexilIPAddress
};
