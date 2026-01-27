import vxl from "./lib";

const age = new vxl.Number(12);
const ageIsValid = age.validate(
    vxl.Number.greaterThan(0),
    vxl.Number.lessThan(100),
    vxl.Number.between(1, 200)
);


const email = new vxl.EmailAddress("me@joshua.com");
const emailIsValid = email.validate(
    vxl.EmailAddress.allowedDomains("com", "net"),
    vxl.EmailAddress.noDotsInUsername()
);


const money = new vxl.Currency(200.50);


const id = new vxl.UUID(vxl.UUID.create())