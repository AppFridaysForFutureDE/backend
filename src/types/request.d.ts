/*
Expanding the Express request object with declaration merging to have a property for authentification

https://www.typescriptlang.org/docs/handbook/declaration-merging.html
*/
declare namespace Express {
    export interface Request {
       auth: {
           valid: boolean,
           admin: boolean,
           session: string,
           name: string
       }
    }
 }