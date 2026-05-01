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
const path = new vxl.Path("src/components/Button.tsx");
const fileName = new vxl.FileName("Button.tsx");
const extension = new vxl.FileExtension("tsx");
const cookie = new vxl.Cookie("session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax");
const createdCookie = vxl.Cookie.create("theme", "dark", { path: "/", sameSite: "Lax", secure: true });
const readCookie = vxl.Cookie.read("theme=dark; session=abc123", "session");
const updatedCookie = vxl.Cookie.update(cookie, { value: "def456", sameSite: "Strict" });
const deletedCookie = vxl.Cookie.delete("session", { path: "/" });

slug.validate(vxl.Slug.maxLength(80));
phone.validate(vxl.PhoneNumber.e164());
ip.validate(vxl.IPAddress.privateRange());
path.validate(vxl.Path.noTraversal(), vxl.Path.extension("tsx"));
fileName.validate(vxl.FileName.extension("tsx"));
extension.validate(vxl.FileExtension.inSet(".ts", ".tsx"));
cookie.validate(vxl.Cookie.secure(), vxl.Cookie.httpOnly());
createdCookie.validate();
readCookie?.validate();
updatedCookie.validate();
deletedCookie.validate();
