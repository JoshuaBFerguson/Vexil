import vxl from "./lib";

const age = new vxl.Number(12);
const ageIsValid = age.validate(
    vxl.Number.greaterThan(0),
    vxl.Number.lessThan(100),
    vxl.Number.between(1, 200)
);

age.value += 1;


const email = new vxl.EmailAddress("me@joshua.com");
const emailIsValid = email.validate(
    vxl.EmailAddress.allowedDomains("com", "net"),
    vxl.EmailAddress.noDotsInUsername()
);

email.value


const money = new vxl.Currency(200.50, "USD");


const id = new vxl.UUID(vxl.UUID.create());

const slug = new vxl.Slug("daily-build-notes");
const phone = new vxl.PhoneNumber("+15551234567");
const ip = new vxl.IPAddress("192.168.1.1");

slug.validate(vxl.Slug.maxLength(80));
phone.validate(vxl.PhoneNumber.e164());
ip.validate(vxl.IPAddress.privateRange());
