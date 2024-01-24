import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    console.log(salt);
    return await bcrypt.hash(password, salt);
}

//use this to compare plain password with hashed pasword
//comparePassword(plain, hashed)
export const comparePassword = async (plain, hashed) => {
    return await bcrypt.compare(plain, hashed);
}