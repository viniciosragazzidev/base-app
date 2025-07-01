export enum role {
    admin = 'admin',
    user = 'user'
}



export enum statusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
}


export type userPayload = {
    name: string,
    email: string,
    password: string,
    role?: role
}