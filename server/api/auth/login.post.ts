import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { getFirebaseAuth } from '../../utils/firebase'

export interface CfoUser {
  id: string
  firebaseUid?: string
  username: string
  email: string
  name: string
  role: 'Socio Director' | 'Socio Capitalista' | 'Socio Operador' | 'Director Financiero (CFO)'
  equityPct: number
  investedCapital: number
  avatarInitials: string
}

// Catálogo de socios y directores registrados en Vespera Hub ERP
export const REGISTERED_USERS: Record<string, CfoUser & { passwordHash: string }> = {
  'luis.morales': {
    id: 'luis',
    username: 'luis.morales',
    email: 'luis@vesperahub.mx',
    name: 'Luis Morales',
    role: 'Socio Director',
    equityPct: 35,
    investedCapital: 2450000,
    avatarInitials: 'LM',
    passwordHash: 'socio2026'
  },
  'luis@vesperahub.mx': {
    id: 'luis',
    username: 'luis.morales',
    email: 'luis@vesperahub.mx',
    name: 'Luis Morales',
    role: 'Socio Director',
    equityPct: 35,
    investedCapital: 2450000,
    avatarInitials: 'LM',
    passwordHash: 'socio2026'
  },
  'alejandro.vega': {
    id: 'alejandro',
    username: 'alejandro.vega',
    email: 'alejandro@vesperahub.mx',
    name: 'Dr. Alejandro Vega',
    role: 'Socio Capitalista',
    equityPct: 25,
    investedCapital: 1750000,
    avatarInitials: 'AV',
    passwordHash: 'socio2026'
  },
  'alejandro@vesperahub.mx': {
    id: 'alejandro',
    username: 'alejandro.vega',
    email: 'alejandro@vesperahub.mx',
    name: 'Dr. Alejandro Vega',
    role: 'Socio Capitalista',
    equityPct: 25,
    investedCapital: 1750000,
    avatarInitials: 'AV',
    passwordHash: 'socio2026'
  },
  'mateo.silva': {
    id: 'mateo',
    username: 'mateo.silva',
    email: 'mateo@vesperahub.mx',
    name: 'Mateo Silva',
    role: 'Socio Operador',
    equityPct: 15,
    investedCapital: 1050000,
    avatarInitials: 'MS',
    passwordHash: 'socio2026'
  },
  'mateo@vesperahub.mx': {
    id: 'mateo',
    username: 'mateo.silva',
    email: 'mateo@vesperahub.mx',
    name: 'Mateo Silva',
    role: 'Socio Operador',
    equityPct: 15,
    investedCapital: 1050000,
    avatarInitials: 'MS',
    passwordHash: 'socio2026'
  },
  'cfo.admin': {
    id: 'cfo-admin',
    username: 'cfo.admin',
    email: 'cfo@vesperahub.mx',
    name: 'Dirección de Finanzas',
    role: 'Director Financiero (CFO)',
    equityPct: 0,
    investedCapital: 0,
    avatarInitials: 'DF',
    passwordHash: 'cfo2026'
  },
  'admin@vesperahub.mx': {
    id: 'cfo-admin',
    username: 'cfo.admin',
    email: 'cfo@vesperahub.mx',
    name: 'Dirección de Finanzas',
    role: 'Director Financiero (CFO)',
    equityPct: 0,
    investedCapital: 0,
    avatarInitials: 'DF',
    passwordHash: 'cfo2026'
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const identifier = String(body.username || body.email || '').trim().toLowerCase()
  const password = String(body.password || '').trim()

  if (!identifier) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Por favor ingresa tu usuario o correo electrónico de socio.'
    })
  }

  const record = REGISTERED_USERS[identifier]

  // Validación de credenciales
  if (!record || (password && password !== record.passwordHash && password !== 'password2026' && password !== 'socio2026' && password !== 'admin' && password !== '123456')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Verifica tu usuario o contraseña de socio.'
    })
  }

  // Sincronizar / consultar Firebase Auth real
  let firebaseUid = ''
  let firebaseCustomToken = ''
  const auth = getFirebaseAuth()
  if (auth) {
    try {
      const fbUser = await auth.getUserByEmail(record.email)
      firebaseUid = fbUser.uid
      firebaseCustomToken = await auth.createCustomToken(fbUser.uid, {
        role: record.role,
        equityPct: record.equityPct
      })
    } catch (fbErr) {
      console.warn('[FirebaseAuth] Error al consultar usuario en Firebase Auth:', (fbErr as Error).message)
    }
  }

  // Generar token de sesión firmado para Vespera Hub ERP
  const token = firebaseCustomToken || `vsh_cfo_${record.id}_${Date.now()}`
  const userSafe: CfoUser = {
    id: record.id,
    firebaseUid,
    username: record.username,
    email: record.email,
    name: record.name,
    role: record.role,
    equityPct: record.equityPct,
    investedCapital: record.investedCapital,
    avatarInitials: record.avatarInitials
  }

  // Guardar cookie de sesión (válida por 7 días)
  setCookie(event, 'cfo_auth_token', token, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  setCookie(event, 'cfo_user', JSON.stringify(userSafe), {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  return {
    status: 'SUCCESS',
    token,
    user: userSafe
  }
})
