import multer from 'multer';
import sharp from 'sharp';

// Définir un stockage en mémoire pour multer
const storage = multer.memoryStorage();

// Configurer multer avec une limite de taille (par exemple, 10 Mo)
export const upload = multer({
    storage: multer.memoryStorage(),  // Stocker en mémoire pour des performances plus rapides
    limits: { fileSize: 50 * 1024 * 1024 },  // Limite de 50MB pour chaque fichier
}).fields([{ name: 'picture1', maxCount: 1 }, { name: 'picture2', maxCount: 1 }]);

// Fonction pour compresser une image et la convertir en base64
export const compressImage = async (file: Express.Multer.File): Promise<string> => {
    const compressedImage = await sharp(file.buffer)
        .resize(500)  // Redimensionner à une largeur maximale de 500px
        .jpeg({ quality: 80 })  // Compresser à 80% de qualité
        .toBuffer();

    return compressedImage.toString('base64');
};



// import express, { Request, Response } from 'express';
// import multer from 'multer';

// const upload = multer({ storage: multer.memoryStorage() });

// const router = express.Router();

// // Route qui accepte un fichier
// router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé' });
//     }

//     // Faites quelque chose avec le fichier ici (par exemple, le sauvegarder en base de données)
//     console.log('Fichier téléchargé:', req.file);
//     res.status(200).json({ message: 'Fichier téléchargé avec succès' });
// });

// export default router;