export class BaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BaseError';
        this.statusCode = 500;
    }
}

export class AuthenticationError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401;
    }
}

export class ForbiddenError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}

export class NotFoundError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export class ConflictError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'ConflictError';
        this.statusCode = 409;
    }
}

export class ValidationError extends BaseError {
    constructor(message, errors) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
        this.details = this.#parseValidationError(errors);
    }

    #parseValidationError(errors) {
        const errorBag = [];

        errors?.issues.forEach(error =>  {
            errorBag.push({
                ...error,
                path: error.path[0]
            })
        })
        return errorBag;
    }
}