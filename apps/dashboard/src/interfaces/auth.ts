import type { User } from '@i2pacg/builtdifferent-frontend-tsdata/models'

export interface SignInData {
  email: string
  password: string
}
export interface AuthFunctions {
  isUserAuthenticated: () => Promise<boolean>
  signIn: (data: SignInData) => Promise<boolean>
  signOut: () => Promise<void>
  user?: User
}
