'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle,
  Crown,
  FileText,
  Heart,
  Home,
  Info,
  LayoutDashboard,
  ListPlus,
  LogOut,
  MapPin,
  PawPrint,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Syringe,
  TrendingUp,
  User,
  Users,
  Weight,
  X,
} from 'lucide-react'
import { useAuth, roleLabels, roleBadge, safeRole, type UserRole } from '@/components/providers/auth-provider'

type Pet = {
  id?: number
  name: string
  type: 'Perro' | 'Gato'
  age: string
  location: string
  image: string
  tone: string
  breed: string | null
  gender: 'Macho' | 'Hembra' | null
  weight: string | null
  vaccinated: boolean
  sterilized: boolean
  personality: string[]
  about: string | null
  good_with: string[]
  energy: 'Baja' | 'Media' | 'Alta' | null
}

export default function Page() {
  const [filter, setFilter] = useState('Todos')
  const [query, setQuery] = useState('')
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [pets, setPets] = useState<Pet[]>([])
  const [petsLoading, setPetsLoading] = useState(true)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    async function loadPets() {
      try {
        const res = await fetch('/api/pets')
        const data = (await res.json()) as { ok: boolean; pets?: Pet[] }
        if (data.ok && data.pets) {
          setPets(data.pets)
        }
      } catch (err) {
        console.error('[load pets]', err)
      } finally {
        setPetsLoading(false)
      }
    }
    loadPets()
  }, [])

  const filteredPets = useMemo(
    () =>
      pets.filter(
        (pet) =>
          (filter === 'Todos' || pet.type === filter) &&
          pet.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [filter, query, pets],
  )

  const fallbackPet = (pet: Pet) => ({
    ...pet,
    breed: pet.breed ?? '',
    gender: pet.gender ?? ('Macho' as const),
    weight: pet.weight ?? '',
    about: pet.about ?? '',
    goodWith: pet.good_with ?? [],
    energy: pet.energy ?? ('Media' as const),
  })

  useEffect(() => {
    if (selectedPet) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedPet])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6f1] text-[#25302b]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#inicio" className="flex items-center gap-2.5 font-semibold tracking-tight"><span className="flex size-9 items-center justify-center rounded-full bg-[#e56c4c] text-[#fffaf5]"><PawPrint size={18} fill="currentColor" /></span><span className="text-lg">Huellas que unen</span></a>
        <div className="hidden items-center gap-8 text-sm font-medium text-[#68716b] md:flex">
          <a href="#adopta" className="text-[#25302b]">Adopta</a>
          <a href="#proceso">Cómo funciona</a>
          {user?.role === 'fundacion' && (
            <a href="#panel-fundacion" className="flex items-center gap-1.5 text-[#52705a]">
              <Building2 size={14} /> Mi refugio
            </a>
          )}
          {user?.role === 'admin' && (
            <a href="#panel-admin" className="flex items-center gap-1.5 text-[#25302b]">
              <Crown size={14} /> Admin
            </a>
          )}
          <a href="#historias">Historias</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2.5 rounded-full border border-[#dfe2dc] bg-[#fffaf5] py-1.5 pl-1.5 pr-3 transition hover:border-[#e56c4c]"
              >
                <span className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold text-[#fffaf5] ${user.role === 'admin' ? 'bg-[#25302b]' : user.role === 'fundacion' ? 'bg-[#52705a]' : 'bg-[#e56c4c]'}`}>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
                <div className="hidden items-start gap-2 text-left sm:flex sm:flex-col">
                  <span className="text-sm font-semibold leading-tight text-[#25302b]">
                    {user.name.split(' ')[0]}
                  </span>
                  {(() => {
                    const r = safeRole(user.role)
                    return (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${roleBadge[r].bg} ${roleBadge[r].text}`}
                      >
                        <span className={`size-1.5 rounded-full ${roleBadge[r].dot}`} />
                        {roleLabels[r]}
                      </span>
                    )
                  })()}
                </div>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-[#dfe2dc] bg-[#fffaf5] shadow-xl shadow-[#25302b]/10">
                  <div className="border-b border-[#dfe2dc] bg-gradient-to-br from-[#fff5f0] to-[#fffaf5] p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex size-12 items-center justify-center rounded-full text-base font-semibold text-[#fffaf5] ${
                          user.role === 'admin'
                            ? 'bg-[#25302b]'
                            : user.role === 'fundacion'
                              ? 'bg-[#52705a]'
                              : 'bg-[#e56c4c]'
                        }`}
                      >
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-[#25302b]">{user.name}</p>
                        <p className="truncate text-xs text-[#68716b]">{user.email}</p>
                        {user.foundationName && (
                          <p className="mt-1 truncate text-xs font-semibold text-[#52705a]">
                            🏠 {user.foundationName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      {(() => {
                        const r = safeRole(user.role)
                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${roleBadge[r].bg} ${roleBadge[r].text}`}
                          >
                            {r === 'admin' ? (
                              <Crown size={11} />
                            ) : r === 'fundacion' ? (
                              <Building2 size={11} />
                            ) : (
                              <User size={11} />
                            )}
                            Cuenta de {roleLabels[r]}
                          </span>
                        )
                      })()}
                    </div>
                  </div>

                  <div className="p-2">
                    {user.role === 'admin' && (
                      <>
                        <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#87918a]">
                          Panel administrador
                        </p>
                        <a
                          href="#panel-admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </a>
                        <a
                          href="#panel-admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <Users size={16} /> Gestionar usuarios
                        </a>
                        <a
                          href="#panel-admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <Building2 size={16} /> Fundaciones
                        </a>
                        <a
                          href="#panel-admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <FileText size={16} /> Reportes
                        </a>
                        <a
                          href="#panel-admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <Settings size={16} /> Configuración
                        </a>
                        <div className="my-1 border-t border-[#efeff2]" />
                      </>
                    )}

                    {user.role === 'fundacion' && (
                      <>
                        <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#87918a]">
                          Mi refugio
                        </p>
                        <a
                          href="#panel-fundacion"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <LayoutDashboard size={16} /> Panel de mascotas
                        </a>
                        <a
                          href="#panel-fundacion"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <ListPlus size={16} /> Publicar mascota
                        </a>
                        <a
                          href="#panel-fundacion"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <Users size={16} /> Solicitudes
                        </a>
                        <div className="my-1 border-t border-[#efeff2]" />
                      </>
                    )}

                    {user.role === 'usuario' && (
                      <>
                        <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#87918a]">
                          Mi cuenta
                        </p>
                        <a
                          href="#panel-usuario"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <User size={16} /> Mi perfil
                        </a>
                        <a
                          href="#panel-usuario"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <Heart size={16} /> Mis favoritos
                        </a>
                        <a
                          href="#panel-usuario"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#68716b] transition hover:bg-[#f8f6f1] hover:text-[#25302b]"
                        >
                          <Calendar size={16} /> Mis solicitudes
                        </a>
                        <div className="my-1 border-t border-[#efeff2]" />
                      </>
                    )}

                    <button
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#cf593d] transition hover:bg-[#fdf0ea]"
                    >
                      <LogOut size={16} /> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#25302b] transition hover:text-[#e56c4c]"
            >
              Iniciar sesión
            </Link>
          )}
          <button className="rounded-full bg-[#25302b] px-5 py-2.5 text-sm font-semibold text-[#fffaf5] transition hover:bg-[#e56c4c]">Quiero ayudar</button>
        </div>
      </nav>

      {user && (
        <>
          {user.role === 'admin' && (
            <section id="panel-admin" className="mx-auto max-w-7xl px-6 pb-4 pt-6 lg:px-10">
              <div className="rounded-3xl border border-[#dfe2dc] bg-gradient-to-br from-[#25302b] via-[#2d3833] to-[#25302b] p-6 text-[#fffaf5] lg:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#fffaf5]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      <Crown size={12} /> Panel de administración
                    </div>
                    <h3 className="font-serif text-3xl tracking-[-0.03em]">
                      Bienvenido de vuelta, {user.name.split(' ')[0]}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm text-[#cdd5cf]">
                      Gestiona usuarios, fundaciones y métricas del portal de adopción.
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 self-start rounded-full bg-[#e56c4c] px-5 py-2.5 text-sm font-semibold text-[#fffaf5] transition hover:bg-[#cf593d]">
                    <Settings size={15} /> Ajustes del sistema
                  </button>
                </div>
                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Usuarios totales', value: '1,248', delta: '+12%', tone: 'bg-[#f4b08f]/15 text-[#f4b08f]', icon: <Users size={16} /> },
                    { label: 'Fundaciones', value: '12', delta: '+2 nuevas', tone: 'bg-[#e6eee1]/15 text-[#d9e5ce]', icon: <Building2 size={16} /> },
                    { label: 'Mascotas en adopción', value: '86', delta: '+5 esta sem.', tone: 'bg-[#ead9c6]/15 text-[#ecd6bc]', icon: <PawPrint size={16} /> },
                    { label: 'Adopciones este mes', value: '38', delta: '+18% vs mes ant.', tone: 'bg-[#d9e2d3]/15 text-[#cfded0]', icon: <TrendingUp size={16} /> },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl bg-[#fffaf5]/5 p-4 backdrop-blur">
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex size-9 items-center justify-center rounded-xl ${s.tone}`}>{s.icon}</div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9bd19f]">{s.delta}</span>
                      </div>
                      <p className="mt-3 font-serif text-3xl">{s.value}</p>
                      <p className="mt-0.5 text-xs text-[#cdd5cf]">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Ver solicitudes pendientes', 'Revisar fundaciones nuevas', 'Exportar reportes CSV'].map((cta) => (
                    <button key={cta} className="inline-flex items-center gap-2 rounded-full border border-[#fffaf5]/15 px-4 py-2 text-xs font-semibold text-[#e8ebe8] transition hover:bg-[#fffaf5]/10">
                      {cta} <ArrowRight size={13} />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {user.role === 'fundacion' && (
            <section id="panel-fundacion" className="mx-auto max-w-7xl px-6 pb-4 pt-6 lg:px-10">
              <div className="overflow-hidden rounded-3xl border border-[#dfe2dc] bg-gradient-to-br from-[#e6eee1] via-[#fffaf5] to-[#ead9c6] p-6 lg:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#52705a]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#52705a]">
                      <Building2 size={12} /> Panel de refugio
                    </div>
                    <h3 className="font-serif text-3xl tracking-[-0.03em] text-[#25302b]">
                      Hola, {user.foundationName ?? user.name.split(' ')[0]} 🐾
                    </h3>
                    <p className="mt-2 max-w-lg text-sm text-[#68716b]">
                      Gestiona tus mascotas publicadas y revisa las solicitudes de adopción.
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 self-start rounded-full bg-[#52705a] px-5 py-2.5 text-sm font-semibold text-[#fffaf5] transition hover:bg-[#3f5a47]">
                    <ListPlus size={15} /> Publicar nueva mascota
                  </button>
                </div>
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Mascotas publicadas', value: '14', tone: 'bg-[#e6eee1] text-[#52705a]', icon: <PawPrint size={16} /> },
                    { label: 'Solicitudes nuevas', value: '7', tone: 'bg-[#ead9c6] text-[#9a624b]', icon: <FileText size={16} /> },
                    { label: 'Adopciones completadas', value: '23', tone: 'bg-[#fde4dc] text-[#cf593d]', icon: <Heart size={16} fill="currentColor" /> },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-4 rounded-2xl bg-[#fffaf5] p-5 shadow-sm shadow-[#25302b]/5">
                      <div className={`flex size-11 items-center justify-center rounded-xl ${s.tone}`}>{s.icon}</div>
                      <div>
                        <p className="font-serif text-3xl leading-none text-[#25302b]">{s.value}</p>
                        <p className="mt-1 text-xs text-[#68716b]">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Ver solicitudes (7)', 'Gestionar mis mascotas', 'Editar información del refugio'].map((cta) => (
                    <button key={cta} className="inline-flex items-center gap-2 rounded-full border border-[#cfd4cf] bg-[#fffaf5] px-4 py-2 text-xs font-semibold text-[#52705a] transition hover:bg-[#f8f6f1]">
                      {cta} <ArrowRight size={13} />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {user.role === 'usuario' && (
            <section id="panel-usuario" className="mx-auto max-w-7xl px-6 pb-4 pt-6 lg:px-10">
              <div className="overflow-hidden rounded-3xl border border-[#dfe2dc] bg-gradient-to-br from-[#fff5f0] via-[#fffaf5] to-[#f8f6f1] p-6 lg:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e56c4c]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#e56c4c]">
                      <Home size={12} /> Tu panel personal
                    </div>
                    <h3 className="font-serif text-3xl tracking-[-0.03em] text-[#25302b]">
                      ¡Qué bueno verte, {user.name.split(' ')[0]}! ♥
                    </h3>
                    <p className="mt-2 max-w-lg text-sm text-[#68716b]">
                      Continúa tu proceso de adopción y conoce a tu nuevo mejor amigo.
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 self-start rounded-full bg-[#e56c4c] px-5 py-2.5 text-sm font-semibold text-[#fffaf5] transition hover:bg-[#cf593d]">
                    <Search size={15} /> Seguir buscando
                  </button>
                </div>
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Favoritos guardados', value: '5', tone: 'bg-[#fde4dc] text-[#cf593d]', icon: <Heart size={16} fill="currentColor" /> },
                    { label: 'Solicitudes enviadas', value: '2', tone: 'bg-[#ead9c6] text-[#9a624b]', icon: <FileText size={16} /> },
                    { label: 'Visitas agendadas', value: '1', tone: 'bg-[#e6eee1] text-[#52705a]', icon: <Calendar size={16} /> },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-4 rounded-2xl bg-[#fffaf5] p-5 shadow-sm shadow-[#25302b]/5">
                      <div className={`flex size-11 items-center justify-center rounded-xl ${s.tone}`}>{s.icon}</div>
                      <div>
                        <p className="font-serif text-3xl leading-none text-[#25302b]">{s.value}</p>
                        <p className="mt-1 text-xs text-[#68716b]">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-dashed border-[#e56c4c]/40 bg-[#fff5f0] p-4">
                  <p className="text-sm font-semibold text-[#cf593d]">📌 Tienes una visita programada con <strong>Milo</strong> el sábado 14 de septiembre a las 11:00 hrs en Roma Norte.</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Ver mis favoritos (5)', 'Seguimiento de solicitudes', 'Actualizar mi perfil'].map((cta) => (
                    <button key={cta} className="inline-flex items-center gap-2 rounded-full border border-[#dfe2dc] bg-[#fffaf5] px-4 py-2 text-xs font-semibold text-[#e56c4c] transition hover:bg-[#fff5f0]">
                      {cta} <ArrowRight size={13} />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <section id="inicio" className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:pb-28 lg:pt-16">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e6eee1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#52705a]"><Sparkles size={14} /> Una familia está esperándote</div>
          <h1 className="font-serif text-6xl leading-[0.95] tracking-[-0.055em] text-[#25302b] sm:text-7xl">El comienzo de una <em className="text-[#e56c4c]">gran historia.</em></h1>
          <p className="mt-7 max-w-md text-lg leading-7 text-[#68716b]">Conoce perros y gatos que buscan un hogar lleno de cariño. Tu próximo mejor amigo puede estar más cerca de lo que imaginas.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4"><a href="#adopta" className="inline-flex items-center gap-3 rounded-full bg-[#e56c4c] px-6 py-3.5 text-sm font-semibold text-[#fffaf5] transition hover:-translate-y-0.5 hover:bg-[#cf593d]">Ver mascotas <ArrowRight size={17} /></a><a href="#proceso" className="text-sm font-semibold underline decoration-[#e56c4c] decoration-2 underline-offset-4">Conoce el proceso</a></div>
          <div className="mt-12 flex items-center gap-8 border-t border-[#dfe2dc] pt-5 text-sm"><div><strong className="block text-2xl font-semibold">240+</strong><span className="text-[#68716b]">adopciones felices</span></div><div><strong className="block text-2xl font-semibold">12</strong><span className="text-[#68716b]">refugios aliados</span></div></div>
        </div>
        <div className="relative mx-auto w-full max-w-lg lg:justify-self-end"><div className="absolute -right-5 top-10 size-24 rounded-full bg-[#e8c8a1] blur-sm" /><div className="absolute -bottom-7 left-4 size-28 rounded-full bg-[#b9cdb5] blur-sm" /><div className="relative aspect-[0.88] overflow-hidden rounded-[11rem_11rem_2rem_2rem] bg-[#ead9c6]"><img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=90" alt="Perro y gato juntos esperando un hogar" className="h-full w-full object-cover" /></div><div className="absolute bottom-8 -left-5 rounded-2xl bg-[#fffaf5] px-5 py-4 shadow-xl shadow-[#25302b]/10"><p className="text-xs text-[#68716b]">Este mes encontramos hogar a</p><p className="mt-1 font-serif text-2xl text-[#e56c4c]">38 mascotas</p></div></div>
      </section>

            <section id="adopta" className="bg-[#fffaf5] px-6 py-20 lg:px-10"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#e56c4c]">Encuentra a tu compañero</p><h2 className="font-serif text-5xl tracking-[-0.04em]">Mascotas en adopción</h2></div><div className="flex items-center gap-2"><button onClick={() => setFilter('Todos')} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === 'Todos' ? 'bg-[#25302b] text-[#fffaf5]' : 'bg-[#f0f1ed] text-[#68716b]'}`}>Todos</button><button onClick={() => setFilter('Perro')} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === 'Perro' ? 'bg-[#25302b] text-[#fffaf5]' : 'bg-[#f0f1ed] text-[#68716b]'}`}>Perros</button><button onClick={() => setFilter('Gato')} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === 'Gato' ? 'bg-[#25302b] text-[#fffaf5]' : 'bg-[#f0f1ed] text-[#68716b]'}`}>Gatos</button></div></div><div className="mt-8 flex flex-col gap-3 rounded-2xl bg-[#f8f6f1] p-3 sm:flex-row"><div className="flex flex-1 items-center gap-3 rounded-xl bg-[#fffaf5] px-4 py-3"><Search size={18} className="text-[#87918a]" /><input aria-label="Buscar mascota" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca por nombre..." className="w-full bg-transparent text-sm outline-none placeholder:text-[#9da49f]" /></div><button className="flex items-center justify-center gap-2 rounded-xl border border-[#dfe2dc] px-5 py-3 text-sm font-semibold text-[#68716b]"><SlidersHorizontal size={16} /> Más filtros</button></div><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{petsLoading ? (
          <>
            {[0,1,2,3].map(i => <div key={i} className="animate-pulse"><div className="aspect-[0.92] rounded-3xl bg-[#ead9c6]/60" /><div className="pt-4 space-y-2"><div className="h-7 w-24 rounded bg-[#dfe2dc]" /><div className="h-4 w-32 rounded bg-[#efeff2]" /><div className="h-3 w-28 rounded bg-[#efeff2]" /></div></div>)}
          </>
        ) : filteredPets.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-[#dfe2dc] bg-[#fffaf5] p-16 text-center">
            <PawPrint size={48} className="mx-auto mb-4 text-[#e56c4c]/60" />
            <p className="font-serif text-2xl text-[#25302b]">No encontramos mascotas</p>
            <p className="mt-2 text-sm text-[#68716b]">Intenta con otros filtros o limpia la búsqueda.</p>
          </div>
        ) : filteredPets.map((pet) => <article key={pet.id ?? pet.name} onClick={() => setSelectedPet(pet)} className="group cursor-pointer"><div className={`relative aspect-[0.92] overflow-hidden rounded-3xl ${pet.tone}`}><img src={pet.image} alt={`${pet.name}, ${pet.type} en adopción`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><button onClick={(e) => e.stopPropagation()} aria-label={`Agregar a favoritos a ${pet.name}`} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-[#fffaf5]/90 text-[#25302b] backdrop-blur-sm"><Heart size={17} /></button></div><div className="flex items-start justify-between pt-4"><div><h3 className="font-serif text-2xl">{pet.name}</h3><p className="mt-1 text-sm text-[#68716b]">{pet.type} · {pet.age}</p><p className="mt-2 flex items-center gap-1 text-xs text-[#87918a]"><MapPin size={13} /> {pet.location}</p></div><button onClick={(e) => { e.stopPropagation(); setSelectedPet(pet); }} aria-label={`Ver perfil de ${pet.name}`} className="mt-1 flex size-9 items-center justify-center rounded-full border border-[#dfe2dc] transition group-hover:border-[#e56c4c] group-hover:bg-[#e56c4c] group-hover:text-[#fffaf5]"><ArrowRight size={16} /></button></div></article>)}</div></div></section>

      <section id="proceso" className="mx-auto max-w-7xl px-6 py-20 lg:px-10"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#e56c4c]">Adoptar es sencillo</p><h2 className="max-w-md font-serif text-5xl leading-tight tracking-[-0.04em]">Un hogar cambia dos vidas.</h2><p className="mt-5 max-w-sm leading-7 text-[#68716b]">Te acompañamos en cada paso para que el encuentro con tu nuevo compañero sea el inicio de algo hermoso.</p></div><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-3xl bg-[#e6eee1] p-6"><span className="font-serif text-4xl text-[#52705a]">01</span><h3 className="mt-12 font-semibold">Conoce</h3><p className="mt-2 text-sm leading-6 text-[#68716b]">Explora perfiles y encuentra una conexión especial.</p></div><div className="rounded-3xl bg-[#ead9c6] p-6"><span className="font-serif text-4xl text-[#9a624b]">02</span><h3 className="mt-12 font-semibold">Conecta</h3><p className="mt-2 text-sm leading-6 text-[#68716b]">Agenda una visita para conocerse en persona.</p></div><div className="rounded-3xl bg-[#25302b] p-6 text-[#fffaf5]"><span className="font-serif text-4xl text-[#f4b08f]">03</span><h3 className="mt-12 font-semibold">Adopta</h3><p className="mt-2 text-sm leading-6 text-[#c1c8c1]">Prepara tu hogar y comienza su nueva historia.</p></div></div></div></section>
      <footer id="historias" className="border-t border-[#dfe2dc] px-6 py-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#68716b] sm:flex-row"><span>© 2024 Huellas que unen</span><span>Hecho con cariño para quienes dan una segunda oportunidad.</span></div></footer>

      {selectedPet && (() => {
        const sp = fallbackPet(selectedPet)
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPet(null)}>
            <div className="absolute inset-0 bg-[#25302b]/70 backdrop-blur-sm" />
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-[#fffaf5] shadow-2xl md:flex-row"
            >
              <button
                onClick={() => setSelectedPet(null)}
                aria-label="Cerrar perfil"
                className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-[#fffaf5]/95 text-[#25302b] shadow-md backdrop-blur transition hover:bg-[#e56c4c] hover:text-[#fffaf5]"
              >
                <X size={20} />
              </button>

              <div className={`relative aspect-square w-full shrink-0 overflow-hidden md:aspect-auto md:w-1/2 ${sp.tone}`}>
                <img
                  src={sp.image}
                  alt={`${sp.name}, ${sp.type} en adopción`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <button
                    aria-label={`Agregar a favoritos a ${sp.name}`}
                    className="flex size-11 items-center justify-center rounded-full bg-[#fffaf5]/95 text-[#e56c4c] shadow-md backdrop-blur transition hover:scale-105"
                  >
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-4xl leading-tight tracking-[-0.02em] text-[#25302b]">{sp.name}</h2>
                    <p className="mt-1 text-sm text-[#68716b]">{sp.breed || 'Raza no especificada'}</p>
                  </div>
                  <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${sp.energy === 'Alta' ? 'bg-[#fde4dc] text-[#e56c4c]' : sp.energy === 'Media' ? 'bg-[#ead9c6] text-[#9a624b]' : 'bg-[#e6eee1] text-[#52705a]'}`}>
                    Energía {sp.energy}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8f6f1] px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#e6eee1] text-[#52705a]"><User size={16} /></div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#87918a]">Sexo</p>
                      <p className="text-sm font-semibold text-[#25302b]">{sp.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8f6f1] px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#ead9c6] text-[#9a624b]"><Calendar size={16} /></div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#87918a]">Edad</p>
                      <p className="text-sm font-semibold text-[#25302b]">{sp.age}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8f6f1] px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#e9d8c8] text-[#9a624b]"><Weight size={16} /></div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#87918a]">Peso</p>
                      <p className="text-sm font-semibold text-[#25302b]">{sp.weight || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8f6f1] px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#d9e2d3] text-[#52705a]"><MapPin size={16} /></div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#87918a]">Ubicación</p>
                      <p className="text-sm font-semibold text-[#25302b]">{sp.location}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {sp.vaccinated ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eee1] px-3 py-1.5 text-xs font-semibold text-[#52705a]"><Syringe size={13} /> Vacunado</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fde4dc] px-3 py-1.5 text-xs font-semibold text-[#cf593d]"><Syringe size={13} /> Sin vacunar</span>
                  )}
                  {sp.sterilized ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eee1] px-3 py-1.5 text-xs font-semibold text-[#52705a]"><Shield size={13} /> Esterilizado</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fde4dc] px-3 py-1.5 text-xs font-semibold text-[#cf593d]"><Shield size={13} /> Sin esterilizar</span>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e56c4c]">Personalidad</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sp.personality.map((trait) => (
                      <span key={trait} className="inline-flex items-center gap-1.5 rounded-2xl border border-[#dfe2dc] bg-[#fffaf5] px-3.5 py-2 text-sm font-medium text-[#25302b]">
                        <CheckCircle size={14} className="text-[#52705a]" /> {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e56c4c]">Sobre {sp.name}</h3>
                  <p className="mt-3 leading-7 text-[#68716b]">
                    {sp.about || 'Aún no tenemos una descripción detallada, ¡pero esta mascota es maravillosa! Agenda una visita para conocerla.'}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e56c4c]">Se lleva bien con</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sp.goodWith.length === 0 ? (
                      <span className="text-sm text-[#87918a]">Por definir</span>
                    ) : sp.goodWith.map((item) => (
                      <span key={item} className="inline-flex items-center rounded-full bg-[#f8f6f1] px-4 py-2 text-sm font-semibold text-[#52705a]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                  <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#e56c4c] px-6 py-3.5 text-sm font-semibold text-[#fffaf5] transition hover:-translate-y-0.5 hover:bg-[#cf593d]">
                    <PawPrint size={16} /> Quiero adoptarlo
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dfe2dc] px-6 py-3.5 text-sm font-semibold text-[#68716b] transition hover:border-[#25302b] hover:text-[#25302b]">
                    <Info size={16} /> Más información
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </main>
  )
}
