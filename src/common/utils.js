import bcrypt from 'bcrypt';

export function asyncWrapper(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;