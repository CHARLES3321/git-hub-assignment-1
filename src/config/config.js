import dotenv from "dotenv"
import * as z from "zod";
import {envConfig} from "./config.schema.js";
dotenv.config();
export const validateConfig = function () {
    try{
        envConfig.parse(process.env);
    }
    catch(err){
        if (err instanceof z.ZodError) {
            const errorBag = err.issues;
            for (const err of errorBag) {
                console.info(`${err.message} thrown for ${err.path[0]}`);

            }
        }
        throw err;
    }
}

export const getEnvKey = function (key) {
    return process.env[key];
}

export const getOrThrowEnvKey = function (key) {
    const value = getEnvKey(key);
    if(!value) throw new Error(`Unknown env key: ${key}`);
    return value;
}














