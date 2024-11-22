

declare namespace Express {
    export interface Request {
        user?: import('../interfaces/IUser').IUser;  // Déclarez la propriété user comme étant de type IUser (ou tout autre type approprié)
    }
}