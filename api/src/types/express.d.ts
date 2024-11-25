

declare namespace Express {
    export interface Request {
        user?: import('../interfaces/IUser').IUser;  // Déclarez la propriété user comme étant de type IUser (ou tout autre type approprié)
        files?: {
            picture1?: Express.Multer.File[];
            picture2?: Express.Multer.File[];
        };
    }
}