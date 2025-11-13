import mongoose from "mongoose";
import {getOrThrowEnvKey} from "../config/config.js";  // this function returns the env value and throws an error if it's missing



const uri = getOrThrowEnvKey('MONGODB_URI');


async function initialiseDatabaseConnection() {
    try {
        mongoose.connect(uri);
        mongoose.connection.on('connected', () => {
            console.info('Database connection established')
        })
    } catch (err) {
        console.error(err);
    }
}

export { initialiseDatabaseConnection };