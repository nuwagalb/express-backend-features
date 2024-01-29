import { mockUsers } from "../utils/constants.mjs";
import { validationResult, matchedData } from "express-validator";
import { hashPassword } from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

export const getUserByIdHandler = (request, response) => {
    const { findUserIndex } = request
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return response.sendStatus(404)
    return response.send(findUser);
};

export const createUserHandler = async (request, response) => {
    // Handling validation Results Section
    const results = validationResult(request);
    if (!results.isEmpty()) return response.status(400).send(results.array());
    
    // Working With Validated Data Section
    const data = matchedData(request);
    data.password = await hashPassword(data.password);

    //Saving New User Details to atabase
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        return response.status(201).send(savedUser);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
}