// import { Router, Request, Response } from 'express';
// import { IUser } from '../../interfaces/IUser';
// import { IEnigmatoBox, IEnigmatoProfil, IEnigmatoBoxGame, IEnigmatoBoxResponse } from '../../interfaces/IEnigmato';
// import pool from '../../config/database';

// const router = Router();
// const partyLocks: Record<number, Promise<void>> = {};

// // [GET] Récupère la boîte du jour pour une partie
// export const read_today_box_async = async (req: Request, res: Response) => {
//     const { id_party } = req.params;
//     const currentUser = req.user as IUser;

//     if (id_party && !partyLocks[parseInt(id_party)]) {
//         partyLocks[parseInt(id_party)] = Promise.resolve();
    

//         try {
//             // Vérifiez la date de début de la partie
//             const party = await getPartyById(parseInt(id_party), currentUser.id_user);
//             const todayDate = new Date().toISOString().split('T')[0];

//             if (new Date(todayDate) < new Date(party.date_start)) {
//                 return res.status(400).json({ message: "La partie n'a pas encore commencé." });
//             }

//             // Vérifiez si la boîte du jour existe
//             const boxQuery = await pool.query(
//                 'SELECT * FROM enigmato_boxes WHERE id_party = $1 AND date = $2',
//                 [id_party, todayDate]
//             );

//             let box = boxQuery.rows[0];
//             if (!box) {
//                 // Si la boîte n'existe pas, la créer
//                 box = await create_box_async(id_party, currentUser.id_user);
//             }

//             res.json(box);
//         } catch (err) {
//             console.error('Error fetching today’s box:', err);
//             res.status(500).send('Internal server error');
//         }
//     }
// };


// // [POST] Crée une boîte pour aujourd'hui
// export const create_box_async = async (req: Request, res: Response) => {
//     const { id_party } = req.params;
//     const currentUser = req.user as IUser;

//     try {
//         const todayDate = new Date().toISOString().split('T')[0];

//         const boxQuery = await pool.query(
//             'SELECT * FROM enigmato_boxes WHERE id_party = $1 AND date = $2',
//             [id_party, todayDate]
//         );

//         const existingBox = boxQuery.rows[0];
//         if (existingBox) {
//             res.json(existingBox);
//         }

//         const participant = await getRandomParticipant(id_party, currentUser.id_user);

//         const newBoxQuery = await pool.query(
//             `INSERT INTO enigmato_boxes (id_party, name, date, id_enigma_user)
//             VALUES ($1, $2, $3, $4)
//             RETURNING *`,
//             [id_party, `Box du ${todayDate}`, todayDate, participant.id_user]
//         );

//         res.json(newBoxQuery.rows[0]);
//     } catch (err) {
//         console.error('Error creating today’s box:', err);
//         res.status(500).send('Internal server error');
//     }
// };




// // [GET] Récupère les détails de la boîte du jour pour le jeu
// export const read_today_box_in_game_async = async (req: Request, res: Response) => {
//     const { id_party } = req.params;

//     try {
//         const todayDate = new Date().toISOString().split('T')[0];

//         const boxQuery = await pool.query(
//             'SELECT * FROM enigmato_boxes WHERE id_party = $1 AND date = $2',
//             [id_party, todayDate]
//         );

//         const box = boxQuery.rows[0];
//         if (!box) {
//             res.status(404).json({ message: 'Box not found' });
//         }

//         const profileQuery = await pool.query(
//             'SELECT * FROM enigmato_profiles WHERE id_user = $1 AND id_party = $2',
//             [box.id_enigma_user, id_party]
//         );

//         const profile = profileQuery.rows[0];
//         if (!profile) {
//             res.status(404).json({ message: 'Profile image not found' });
//         }

//         const gameData: IEnigmatoBoxGame = {
//             id_box: box.id_box,
//             id_party: box.id_party,
//             name: box.name,
//             date: box.date,
//             picture1: profile.picture1,
//         };

//         res.json(gameData);
//     } catch (err) {
//         console.error('Error fetching today’s box game:', err);
//         res.status(500).send('Internal server error');
//     }
// };

// // [GET] Récupère les boîtes précédentes d'une partie
// export const read_before_box_async = async (req: Request, res: Response) => {
//     const { id_party } = req.params;

//     try {
//         const todayDate = new Date().toISOString().split('T')[0];

//         const boxesQuery = await pool.query(
//             `SELECT * FROM enigmato_boxes 
//             WHERE id_party = $1 AND date < $2 
//             ORDER BY date DESC`,
//             [id_party, todayDate]
//         );

//         const boxes = boxesQuery.rows;

//         const boxesData: IEnigmatoBoxResponse[] = [];
//         for (const box of boxes) {
//             const profileQuery = await pool.query(
//                 'SELECT * FROM enigmato_profiles WHERE id_user = $1 AND id_party = $2',
//                 [box.id_enigma_user, id_party]
//             );

//             const profile = profileQuery.rows[0];
//             if (!profile) {
//                 res.status(404).json({ message: `Profile for user ${box.id_enigma_user} not found` });
//             }

//             const userQuery = await pool.query('SELECT * FROM users WHERE id_user = $1', [profile.id_user]);
//             const user = userQuery.rows[0];
//             if (!user) {
//                 res.status(404).json({ message: `User for profile ${profile.id_user} not found` });
//             }

//             boxesData.push({
//                 id_box: box.id_box,
//                 id_party: box.id_party,
//                 name_box: box.name,
//                 date: box.date,
//                 id_user: box.id_enigma_user,
//                 id_profil: profile.id_user,
//                 name: user.name,
//                 firstname: user.firstname,
//                 picture1: profile.picture1,
//                 picture2: profile.picture2,
//             });
//         }

//         res.json(boxesData);
//     } catch (err) {
//         console.error('Error fetching previous boxes:', err);
//         res.status(500).send('Internal server error');
//     }
// };



// // Utilitaires pour récupérer des données
// async function getPartyById(id_party: number, id_user: number) {
//     const query = await pool.query(
//         'SELECT * FROM enigmato_parties WHERE id_party = $1 AND id_user = $2',
//         [id_party, id_user]
//     );
//     return query.rows[0];
// }

// async function getRandomParticipant(id_party: number, currentUserId: number) {
//     const query = await pool.query(
//         'SELECT * FROM enigmato_profiles WHERE id_party = $1 AND is_complete = true',
//         [id_party]
//     );

//     const participants = query.rows;
//     if (participants.length === 0) {
//         throw new Error('No participants found for this party');
//     }

//     return participants[Math.floor(Math.random() * participants.length)];
// }

// export default router;