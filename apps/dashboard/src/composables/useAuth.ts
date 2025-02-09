import type { AuthFunctions, SignInData } from '@/interfaces'
import useAppStore from '@/data/stores/app'
import { User } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import useApiRequest from './useApiRequest'

function useAuth(): AuthFunctions {
  const appStore = useAppStore()

  const isUserAuthenticated = (showToasts: boolean = false): Promise<boolean> => {
    const currentTime = Date.now()
    const checkInterval = 5 * 60 * 1000 // 5 minutes

    /*    log('useAuth', 'Checking user authentication', {
      lastCheckTime: appStore.lastCheckTime,
      currentTime,
      checkInterval,
    }) */

    if (appStore.user && appStore.lastCheckTime && currentTime - appStore.lastCheckTime < checkInterval) {
      /*  log('useAuth', 'User already authenticated', {
        user: appStore.user,
        lastCheck: appStore.lastCheckTime,
      }) */
      return Promise.resolve(true)
    }

    /* log('useAuth', 'Making API request to check user authentication...') */

    return useApiRequest('/api/user')
      .config({
        showToasts,
        toastMessages: {
          success: 'Login successful',
          error: 'You are not authenticated',
        },
      })
      .index()
      .then((user: any) => {
        if (Array.isArray(user))
          user = user[0]
        appStore.setUser(new User(user))
        appStore.lastCheckTime = currentTime
        /* log('useAuth', 'User authenticated successfully.') */

        return true
      })
      .catch((error: any) => {
        console.log('useAuth', 'Authentication error', { error })
        // log('useAuth', 'Authentication error', { error })
        return false
      })
  }

  const signIn = async (data: SignInData): Promise<boolean> => {
    try {
      const user = await useApiRequest('/api/login')
        .config({
          showToasts: true,
          toastMessages: {
            success: 'Login successful',
            error: 'Login failed',
          },
        })
        .store<SignInData>(data)
      console.log('useAuth', 'SignIn', { user })
      appStore.setUser(new User(Array.isArray(user) ? user[0] : user))
      appStore.lastCheckTime = Date.now()
      return true
    }
    catch (error: any) {
      console.log('useAuth', 'SignIn error', { error })
      return false
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await useApiRequest<boolean>('/api/logout')
        .config({
          showToasts: true,
          toastMessages: {
            success: 'Logout successful',
            error: 'You are not authenticated',
          },
        })
        .store()
      appStore.setUser()
      appStore.lastCheckTime = null
    }
    catch (error) {
      console.log('useAuth', 'signOut error', { error })
    }
  }

  return {
    isUserAuthenticated,
    signIn,
    signOut,
  }
}

export default useAuth
