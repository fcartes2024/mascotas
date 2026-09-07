import { NextResponse } from 'next/server'
import db, { type DBPet } from '@/lib/db'

function parseJSON<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM pets ORDER BY created_at DESC').all() as DBPet[]
    const pets = rows.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      breed: p.breed,
      age: p.age,
      gender: p.gender,
      weight: p.weight,
      location: p.location,
      image: p.image,
      tone: p.tone,
      vaccinated: Boolean(p.vaccinated),
      sterilized: Boolean(p.sterilized),
      personality: parseJSON<string[]>(p.personality) ?? [],
      about: p.about,
      good_with: parseJSON<string[]>(p.good_with) ?? [],
      energy: p.energy,
      foundation_id: p.foundation_id,
      published_by: p.published_by,
      created_at: p.created_at,
    }))
    return NextResponse.json({ ok: true, pets })
  } catch (err) {
    console.error('[pets]', err)
    return NextResponse.json({ ok: false, error: 'Error al cargar mascotas.' }, { status: 500 })
  }
}
