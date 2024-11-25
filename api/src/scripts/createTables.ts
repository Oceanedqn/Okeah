import pool from '../config/database';

const createTables = async () => {
  const queries = [
    // Table users
    `
    CREATE TABLE IF NOT EXISTS users (
      id_user SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      firstname VARCHAR(100) NOT NULL,
      mail VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      gender BOOLEAN DEFAULT FALSE
    );
    `,

    // Table enigmato_parties
    `
    CREATE TABLE IF NOT EXISTS enigmato_parties (
      id_party SERIAL PRIMARY KEY,
      date_creation DATE NOT NULL,
      name VARCHAR(100) NOT NULL,
      password VARCHAR(255),
      date_start DATE NOT NULL,
      date_end DATE,
      is_finished BOOLEAN DEFAULT FALSE,
      game_mode INTEGER NOT NULL,
      number_of_box INTEGER NOT NULL,
      id_user INTEGER NOT NULL REFERENCES users(id_user),
      include_weekends BOOLEAN DEFAULT TRUE,
      set_password BOOLEAN DEFAULT FALSE
    );
    `,

    // Table enigmato_profiles
    `
    CREATE TABLE IF NOT EXISTS enigmato_profiles (
      id_profil SERIAL PRIMARY KEY,
      id_user INTEGER NOT NULL REFERENCES users(id_user),
      id_party INTEGER NOT NULL REFERENCES enigmato_parties(id_party),
      picture1 VARCHAR(255),
      picture2 VARCHAR(255),
      date_joined_at DATE NOT NULL,
      is_complete BOOLEAN DEFAULT FALSE
    );
    `,

    // Table enigmato_boxes
    `
    CREATE TABLE IF NOT EXISTS enigmato_boxes (
      id_box SERIAL PRIMARY KEY,
      id_party INTEGER NOT NULL REFERENCES enigmato_parties(id_party),
      name VARCHAR(100) NOT NULL,
      date TIMESTAMP,
      id_enigma_user INTEGER NOT NULL
    );
    `,

    // Table enigmato_box_responses
    `
    CREATE TABLE IF NOT EXISTS enigmato_box_responses (
      id_box_response SERIAL PRIMARY KEY,
      id_box INTEGER NOT NULL REFERENCES enigmato_boxes(id_box),
      id_user INTEGER NOT NULL REFERENCES users(id_user),
      id_user_response INTEGER,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      cluse_used BOOLEAN DEFAULT FALSE
    );
    `,
  ];

  try {
    for (const query of queries) {
      await pool.query(query);
      console.log('Table créée avec succès.');
    }
  } catch (error) {
    console.error('Erreur lors de la création des tables :', error);
  } finally {
    pool.end();
  }
};

createTables();