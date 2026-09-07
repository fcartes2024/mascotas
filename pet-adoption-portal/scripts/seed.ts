import { createHash } from 'node:crypto'
import db from '../lib/db'

function hash(pw: string) {
  return createHash('sha256').update(pw).digest('hex')
}

console.log('🌱 Poblando base de datos con datos demo...')

db.exec('PRAGMA foreign_keys = OFF')
db.exec(`
  DELETE FROM adoption_requests;
  DELETE FROM favorites;
  DELETE FROM pets;
  DELETE FROM users;
  DELETE FROM foundations;
  DELETE FROM sqlite_sequence WHERE name IN ('adoption_requests','favorites','pets','users','foundations');
`)
db.exec('PRAGMA foreign_keys = ON')

const insertFound = db.prepare(`
  INSERT INTO foundations (name, description, location, email, phone, logo_url)
  VALUES (?, ?, ?, ?, ?, ?)
`)
const f1 = insertFound.run(
  'Patitas Felices A.C.',
  'Refugio sin fines de lucro dedicado al rescate y adopción de perros y gatos en situación de calle. Operamos desde 2015.',
  'Coyoacán, CDMX',
  'hola@patitasfelices.org',
  '+52 55 1234 5678',
  null,
).lastInsertRowid
const f2 = insertFound.run(
  'Hogares con Amor',
  'Fundación enfocada en encontrar hogares responsables. Trabajamos con programas de educación y esterilización.',
  'Roma Norte, CDMX',
  'contacto@hogaresconamor.org',
  '+52 55 9876 5432',
  null,
).lastInsertRowid

const insertUser = db.prepare(`
  INSERT INTO users (name, email, password_hash, role, foundation_id)
  VALUES (?, ?, ?, ?, ?)
`)
const uAdmin = insertUser.run('Administrador Huellas', 'admin@huellas.com', hash('admin1234'), 'admin', null).lastInsertRowid
const uFound1 = insertUser.run('Refugio Patitas Felices', 'hola@patitasfelices.org', hash('fundacion123'), 'fundacion', Number(f1)).lastInsertRowid
const uFound2 = insertUser.run('Fundación Hogares con Amor', 'contacto@hogaresconamor.org', hash('amor2024'), 'fundacion', Number(f2)).lastInsertRowid
const uUser1 = insertUser.run('María García', 'maria@ejemplo.com', hash('hola1234'), 'usuario', null).lastInsertRowid
const uUser2 = insertUser.run('Carlos López', 'carlos@ejemplo.com', hash('perrito2024'), 'usuario', null).lastInsertRowid

const insertPet = db.prepare(`
  INSERT INTO pets (name, type, breed, age, gender, weight, location, image, tone, vaccinated, sterilized, personality, about, good_with, energy, foundation_id, published_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const pets: Array<any> = [
  {
    name: 'Milo', type: 'Perro', breed: 'Golden Retriever', age: '2 años', gender: 'Macho', weight: '28 kg',
    location: 'Roma Norte', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85',
    tone: 'bg-[#e9d8c8]', vaccinated: 1, sterilized: 1,
    personality: JSON.stringify(['Cariñoso', 'Juguetón', 'Amigable', 'Inteligente']),
    about: 'Milo es un perro lleno de amor y energía. Le encanta jugar en el parque, dar paseos largos y sobre todo, recibir mimos. Es excelente con niños y se lleva de maravilla con otros perros.',
    good_with: JSON.stringify(['Niños', 'Otros perros', 'Gatos']), energy: 'Alta',
    foundation_id: f2, published_by: uFound2,
  },
  {
    name: 'Luna', type: 'Gato', breed: 'Criolla', age: '1 año', gender: 'Hembra', weight: '4 kg',
    location: 'Coyoacán', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85',
    tone: 'bg-[#d9e2d3]', vaccinated: 1, sterilized: 1,
    personality: JSON.stringify(['Tranquila', 'Cariñosa', 'Independiente', 'Juguetona']),
    about: 'Luna es una gata muy dulce y tranquila. Pasa la mayor parte del día dormitando en lugares soleados, pero cuando juega, ¡es una bola de energía!',
    good_with: JSON.stringify(['Adultos', 'Otros gatos']), energy: 'Media',
    foundation_id: f1, published_by: uFound1,
  },
  {
    name: 'Bruno', type: 'Perro', breed: 'Border Collie', age: '4 años', gender: 'Macho', weight: '19 kg',
    location: 'Condesa', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=85',
    tone: 'bg-[#eadfce]', vaccinated: 1, sterilized: 1,
    personality: JSON.stringify(['Leal', 'Inteligente', 'Obediente', 'Energético']),
    about: 'Bruno es un compañero fiel y muy inteligente. Sabe varias órdenes básicas y está ansioso por aprender más.',
    good_with: JSON.stringify(['Niños mayores', 'Otros perros']), energy: 'Alta',
    foundation_id: f2, published_by: uFound2,
  },
  {
    name: 'Nala', type: 'Gato', breed: 'Tabby', age: '3 meses', gender: 'Hembra', weight: '1.2 kg',
    location: 'Del Valle', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=85',
    tone: 'bg-[#e5d8d1]', vaccinated: 0, sterilized: 0,
    personality: JSON.stringify(['Curiosa', 'Traviesa', 'Mimosa', 'Aventurera']),
    about: 'Nala es una pequeña exploradora que no tiene miedo a nada.',
    good_with: JSON.stringify(['Adultos', 'Gatos adultos pacientes']), energy: 'Alta',
    foundation_id: f1, published_by: uFound1,
  },
]

pets.forEach((p) => insertPet.run(
  p.name, p.type, p.breed, p.age, p.gender, p.weight, p.location, p.image, p.tone,
  p.vaccinated, p.sterilized, p.personality, p.about, p.good_with, p.energy,
  p.foundation_id, p.published_by,
))

const insertFav = db.prepare('INSERT INTO favorites (user_id, pet_id) VALUES (?, ?)')
insertFav.run(Number(uUser1), 1)
insertFav.run(Number(uUser1), 2)
insertFav.run(Number(uUser2), 3)

const insertReq = db.prepare(`INSERT INTO adoption_requests (user_id, pet_id, status, message, scheduled_date) VALUES (?, ?, ?, ?, ?)`)
insertReq.run(Number(uUser1), 1, 'pendiente', 'Me encantaría conocer a Milo, tengo un jardín amplio.', '2026-09-14 11:00:00')
insertReq.run(Number(uUser2), 4, 'aprobada', '¡Quiero darle un hogar a Nala!', '2026-09-10 16:00:00')

console.log('✅ Datos demo insertados correctamente:')
console.log('   → 2 fundaciones')
console.log('   → 5 usuarios (1 admin, 2 fundaciones, 2 adoptantes)')
console.log('   → 4 mascotas publicadas')
console.log('   → 3 favoritos')
console.log('   → 2 solicitudes de adopción')
console.log('')
console.log('🔐 Credenciales demo (passwords):')
console.log('   → admin@huellas.com       / admin1234    (admin)')
console.log('   → hola@patitasfelices.org / fundacion123 (fundacion)')
console.log('   → contacto@hogaresconamor.org / amor2024 (fundacion)')
console.log('   → maria@ejemplo.com       / hola1234     (usuario)')
console.log('   → carlos@ejemplo.com      / perrito2024  (usuario)')
