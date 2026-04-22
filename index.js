import bcrypt from "bcrypt";

const hashedPass = await bcrypt.hash("emp123456", 10);
console.log(hashedPass);
