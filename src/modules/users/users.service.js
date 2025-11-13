import {User} from "./users.model.js";
import { hashPassword } from "../../common/utils.js";

export const getAllUsers = async (params ={}) => {
    return await User.find(params).exec();
}

export const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
}

export const createUser = async (payload) => {
    const newUser = await User.create({
        ...payload,
        password: await hashPassword(payload.password),
    });
    return newUser;
}

export const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    if(!user) return null;
    return user;
}

export const getUserById = async (id) => {
    const user = await User.findById(id);
    if(!user) return null;
    return user;
}