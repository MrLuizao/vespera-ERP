import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getAuth, type Auth } from 'firebase-admin/auth'
import type { StoredReservation, ZoneId } from './reservations'

let firebaseApp: App | null = null
let firestoreDb: Firestore | null = null
let firebaseAuth: Auth | null = null

export function getFirebaseApp(): App | null {
  if (firebaseApp) return firebaseApp

  const existingApps = getApps()
  const existingApp = existingApps[0]
  if (existingApp) {
    firebaseApp = existingApp
    return firebaseApp
  }

  const possibleSaPaths = [
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ? resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH) : '',
    resolve(process.cwd(), 'firebase-service-account.json'),
    resolve(process.cwd(), '../vespera-hub/firebase-service-account.json'),
    '/Users/luis/Develop/Personal/vespera-hub/firebase-service-account.json'
  ].filter(Boolean)

  for (const saPath of possibleSaPaths) {
    if (existsSync(saPath)) {
      const serviceAccount = JSON.parse(readFileSync(saPath, 'utf-8'))
      firebaseApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || 'booking-project-6d692'
      })
      return firebaseApp
    }
  }

  return null
}

export function getFirebaseAuth(): Auth | null {
  if (firebaseAuth) return firebaseAuth
  const app = getFirebaseApp()
  if (app) {
    firebaseAuth = getAuth(app)
    return firebaseAuth
  }
  return null
}

export function getFirestoreDb(): Firestore | null {
  if (firestoreDb) return firestoreDb

  try {
    const app = getFirebaseApp()
    if (app) {
      firestoreDb = getFirestore(app)
      return firestoreDb
    }
  } catch (err) {
    console.warn('[FirebaseAdmin] Error al inicializar Firebase Firestore:', (err as Error).message)
  }

  return null
}

/**
 * Consulta la colección 'reservations' en Cloud Firestore en tiempo real.
 * Si no está disponible o falla, retorna null para permitir fallback local.
 */
export async function getFirestoreReservations(): Promise<StoredReservation[] | null> {
  const db = getFirestoreDb()
  if (!db) return null

  try {
    const snapshot = await db.collection('reservations').get()
    if (snapshot.empty) {
      return []
    }

    const list: StoredReservation[] = []
    snapshot.forEach(doc => {
      const data = doc.data() as StoredReservation
      list.push({
        ...data,
        id: data.id || doc.id
      })
    })

    return list
  } catch (err) {
    console.warn('[Firestore] Error al leer colección reservations:', (err as Error).message)
    return null
  }
}
