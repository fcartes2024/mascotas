import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_DIR = join(process.cwd(), 'data')
const DB_PATH = join(DB_DIR, 'pet-adoption.db')

if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true })
}

export const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export type UserRole = 'admin' | 'fundacion' | 'usuario'

export type DBUser = {
  id: number
  name: string
  email: string
  password_hash: string
  role: UserRole
  avatar: string | null
  foundation_id: number | null
  created_at: string
}

export type DBFoundation = {
  id: number
  name: string
  description: string | null
  location: string | null
  email: string | null
  phone: string | null
  logo_url: string | null
  created_at: string
}

export type DBPet = {
  id: number
  name: string
  type: 'Perro' | 'Gato'
  breed: string | null
  age: string
  gender: 'Macho' | 'Hembra' | null
  weight: string | null
  location: string
  image: string
  tone: string
  vaccinated: number
  sterilized: number
  personality: string | null
  about: string | null
  good_with: string | null
  energy: 'Baja' | 'Media' | 'Alta' | null
  foundation_id: number | null
  published_by: number | null
  created_at: string
}

export type DBFavorite = {
  id: number
  user_id: number
  pet_id: number
  created_at: string
}

export type DBAdoptionRequest = {
  id: number
  user_id: number
  pet_id: number
  status: 'pendiente' | 'aprobada' | 'rechazada' | 'completada'
  message: string | null
  scheduled_date: string | null
  created_at: string
}

export default db
