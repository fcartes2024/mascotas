import db from '../lib/db'

console.log('🗄️  Inicializando esquema de base de datos SQLite...')

db.exec(`
  CREATE TABLE IF NOT EXISTS foundations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    email TEXT,
    phone TEXT,
    logo_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'usuario' CHECK (role IN ('admin','fundacion','usuario')),
    avatar TEXT,
    foundation_id INTEGER REFERENCES foundations(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(email)
  );

  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Perro','Gato')),
    breed TEXT,
    age TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Macho','Hembra')),
    weight TEXT,
    location TEXT NOT NULL,
    image TEXT NOT NULL,
    tone TEXT NOT NULL DEFAULT 'bg-[#e9d8c8]',
    vaccinated INTEGER NOT NULL DEFAULT 0,
    sterilized INTEGER NOT NULL DEFAULT 0,
    personality TEXT,
    about TEXT,
    good_with TEXT,
    energy TEXT CHECK (energy IN ('Baja','Media','Alta')),
    foundation_id INTEGER REFERENCES foundations(id) ON DELETE CASCADE,
    published_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, pet_id)
  );

  CREATE TABLE IF NOT EXISTS adoption_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente','aprobada','rechazada','completada')),
    message TEXT,
    scheduled_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  CREATE INDEX IF NOT EXISTS idx_pets_type ON pets(type);
  CREATE INDEX IF NOT EXISTS idx_pets_foundation ON pets(foundation_id);
  CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
  CREATE INDEX IF NOT EXISTS idx_requests_user ON adoption_requests(user_id);
  CREATE INDEX IF NOT EXISTS idx_requests_pet ON adoption_requests(pet_id);
`)

console.log('✅ Tablas creadas correctamente.')
console.log('   → foundations')
console.log('   → users')
console.log('   → pets')
console.log('   → favorites')
console.log('   → adoption_requests')
