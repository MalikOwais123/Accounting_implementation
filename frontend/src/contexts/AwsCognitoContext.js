import PropTypes from 'prop-types'
import { createContext, useCallback, useEffect, useReducer, useState } from 'react'
import { CognitoUser, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js'
// utils
import axios from 'src/utils/axios'
// routes
import { PATH_AUTH, PATH_DASHBOARD } from 'src/routes/paths'
//
import { COGNITO_API } from 'src/config'
//redux
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, getUserSelectedSubscriptions } from 'src/redux/slices/user'
import { isEmpty } from 'lodash'
// ----------------------------------------------------------------------

// CAUTION: User Cognito is slily difference from firebase, so be sure to read the doc carefully.

export const UserPool = new CognitoUserPool({
  UserPoolId: COGNITO_API.userPoolId,
  ClientId: COGNITO_API.clientId,
})

const initialState = {
  isAuthenticated: false,
  isSelectedSubscription: false,
  isInitialized: false,
  isSelectSubscriptionInitialized: false,
  isPaymentInitialized: false,
  user: null,
  temp_user: null,
  subscriptions: [],
  selectedSubscription: null,
}

const handlers = {
  AUTHENTICATE: (state, action) => {
    const { isAuthenticated, user, isSelectedSubscription, subscriptions } = action.payload

    return {
      ...state,
      isSelectedSubscription,
      subscriptions,
      isAuthenticated,
      isInitialized: true,
      user,
    }
  },

  PARTIAL_AUTHENTICATE: (state, action) => {
    const { isAuthenticated, user, isSelectedSubscription, subscriptions } = action.payload

    return {
      ...state,
      isAuthenticated: false,
      isSelectedSubscription: false,
      subscriptions,
      isInitialized: true,
      isPaymentInitialized: false,
      isSelectSubscriptionInitialized: true,
      temp_user: null,
      user,
    }
  },

  PAYMENT_INITIATE: (state, action) => {
    const { user, subscriptions } = action.payload

    return {
      ...state,
      isSelectedSubscription: false,
      subscriptions,
      isAuthenticated: false,
      isInitialized: true,
      isPaymentInitialized: true, // this will trigger payment page after login
      temp_user: user,
      user: null,
    }
  },

  SELECTED_SUBSCRIPTION: (state, action) => {
    return {
      ...state,
      user: action.payload.user,
      selectedSubscription: action.payload.subscription,
      isSelectedSubscription: true,
    }
  },
  REGISTER: (state, action) => {
    const { user } = action.payload

    return {
      ...state,
      user,
    }
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
}

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state)

const AuthContext = createContext({
  ...initialState,
  method: 'cognito',
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
  confirmUser: () => Promise.resolve(),
  resendConfirmUserCode: () => Promise.resolve(),
})

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
}

function AuthProvider({ children }) {
  const actionDispatch = useDispatch()
  const [state, dispatch] = useReducer(reducer, initialState)
  const reduxUser = useSelector((state) => state.user)

  useEffect(() => {
    console.log('COGNITO STATE', state, reduxUser)
  }, [state])

  const getUserAttributes = useCallback(
    (currentUser) =>
      new Promise((resolve, reject) => {
        currentUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err)
          } else {
            const results = {}

            attributes.forEach((attribute) => {
              results[attribute.Name] = attribute.Value
            })
            resolve(results)
          }
        })
      }),
    []
  )

  const selectUserCompanyDispatch = useCallback(
    (subscriptionId) =>
      new Promise(async (resolve, reject) => {
        const response = await axios.get(`/user/subscription/${subscriptionId}`)
        resolve(response.data)
        dispatch({
          type: 'SELECTED_SUBSCRIPTION',
          payload: {
            user: response.data.user,
            subscription: response.data.subscription,
          },
        })
      }),
    [getSubscriptionList]
  )

  const getCognitoUserAndSetToken = useCallback(
    (user, session) =>
      new Promise(async (resolve, reject) => {
        const attributes = await getUserAttributes(user)
        const token = session.getIdToken().getJwtToken()

        // use the token or Bearer depend on the wait BE handle, by default amplify API only need to token.
        axios.defaults.headers.common.Authorization = token
        return resolve({ attributes, token })
      }),
    []
  )

  const initiateUserPaymentMethod = useCallback(
    (subscriptionId, subscriptionList, user) =>
      new Promise(async (resolve, reject) => {
        dispatch({
          type: 'PAYMENT_INITIATE',
          payload: {
            user: user,
            subscriptions: subscriptionList,
          },
        })

        console.log('initiateUserPaymentMethod', state)

        window.location.href = PATH_AUTH.payment

        // const response = await axios.get(`/user/subscription/${subscriptionId}`)
        // resolve(response.data)
        // dispatch({
        //   type: 'SELECTED_SUBSCRIPTION',
        //   payload: {
        //     user: response.data.user,
        //     subscription: response.data.subscription,
        //   },
        // })
      }),
    []
  )
  const initiateUserSelectCompanytMethod = useCallback(
    (subscriptionId, subscriptionList, user) =>
      new Promise(async (resolve, reject) => {
        // dispatch({
        //   type: 'PARTIAL_AUTHENTICATE',
        //   payload: {
        //     isAuthenticated: true,
        //     user: attributes,
        //     subscriptions: subscriptionList,
        //     // selectedSubscription,
        //     isSelectedSubscription: false,
        //     // isSelectedSubscription: !!selectedSubscription,
        //   },
        // })

        dispatch({
          type: 'PARTIAL_AUTHENTICATE',
          payload: {
            user: user,
            subscriptions: subscriptionList,
          },
        })

        console.log('initiateUserSelectCompanytMethod', state)

        window.location.href = PATH_AUTH.userCompanies

        // const response = await axios.get(`/user/subscription/${subscriptionId}`)
        // resolve(response.data)
        // dispatch({
        //   type: 'SELECTED_SUBSCRIPTION',
        //   payload: {
        //     user: response.data.user,
        //     subscription: response.data.subscription,
        //   },
        // })
      }),
    [login]
  )

  const getSubscriptionList = useCallback(async () => {
    const response = await axios.get('/user/subscriptions')
    if (response) return response.data
    else return null
  }, [login])

  const checkUserSubscriptionPaid = useCallback(
    () =>
      new Promise((resolve, reject) => {
        const user = UserPool.getCurrentUser()

        console.log('CHECKING USER SUBSCRIPTION PAID....')

        if (isEmpty(user))
          return dispatch({
            type: 'AUTHENTICATE',
            payload: {
              isAuthenticated: false,
              user: null,
              isSelectedSubscription: false,
            },
          })

        user.getSession(async (err, session) => {
          if (err) return reject(err)

          const { attributes, token } = await getCognitoUserAndSetToken(user, session)

          const subscriptionList = await getSubscriptionList()

          // Check if subscriptionList[0].paymentStatus === "unpaid"
          if (subscriptionList[0].paymentStatus === 'unpaid')
            return initiateUserPaymentMethod(subscriptionList[0].id, subscriptionList, attributes)

          console.log('SUBSCRIPTION PAID, GETTING SESSION....')
          getSession()
        })
      }),
    []
  )

  const getSession = useCallback(
    () =>
      new Promise((resolve, reject) => {
        const user = UserPool.getCurrentUser()

        // After successfull login, user will go to either PAYMENT_INITIATE, PARTIAL_AUTHENTICATE or AUTHENTICATE

        if (user) {
          user.getSession(async (err, session) => {
            if (err) return reject(err)

            const { attributes, token } = await getCognitoUserAndSetToken(user, session)

            const subscriptionList = await getSubscriptionList()

            let selectedSubscription = null

            // Check if subscriptionList[0].paymentStatus === "unpaid"
            // if (subscriptionList[0].paymentStatus === 'unpaid')
            //   return initiateUserPaymentMethod(subscriptionList[0].id, subscriptionList, attributes)

            // If paymentStatus === paid, dispatch PARTIAL_AUTHENTICATE & select user company
            // if (subscriptionList.length > 1)
            //   initiateUserSelectCompanytMethod(subscriptionList[0].id, subscriptionList, attributes)

            selectedSubscription = subscriptionList[0]
            const data = await selectUserCompanyDispatch(selectedSubscription.id)
            console.log('GETTING SESSION....', data)

            if (attributes.email_verified === 'true' && data.user.emailVerified === false) {
              const response = await axios.put('/user/email-verified')
              data.user = response.data
            }

            dispatch({
              type: 'AUTHENTICATE',
              payload: {
                isAuthenticated: true,
                user: data.user,
                subscriptions: subscriptionList,
                selectedSubscription: data.subscription,
                isSelectedSubscription: true,
                // isSelectedSubscription: !!selectedSubscription,
              },
            })

            // actionDispatch(getUserSelectedSubscriptions(selectedSubscription))

            // console.log('SELECTED SUBSCRIPTION', selectedSubscription)

            // dispatch({
            //   type: 'AUTHENTICATE',
            //   payload: {
            //     isAuthenticated: true,
            //     user: attributes,
            //     subscriptions: subscriptionList,
            //     // selectedSubscription,
            //     isSelectedSubscription: !!selectedSubscription,
            //   },
            // })
            resolve({
              user,
              attributes,
              session,
              selectedSubscription,
              headers: { Authorization: token },
            })
          })
        } else {
          dispatch({
            type: 'AUTHENTICATE',
            payload: {
              isAuthenticated: false,
              user: null,
              isSelectedSubscription: false,
            },
          })
        }
      }),
    [getUserAttributes]
  )

  const initial = useCallback(async () => {
    try {
      await getSession()
    } catch {
      dispatch({
        type: 'AUTHENTICATE',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      })
    }
  }, [getSession])

  useEffect(() => {
    initial()
  }, [initial])

  // We make sure to handle the user update here, but return the resolve value in order for our components to be
  // able to chain additional `.then()` logic. Additionally, we `.catch` the error and "enhance it" by providing
  // a message that our React components can use.
  const login = useCallback(
    (email, password) =>
      new Promise((resolve, reject) => {
        const user = new CognitoUser({
          Username: email,
          Pool: UserPool,
        })

        const authDetails = new AuthenticationDetails({
          Username: email,
          Password: password,
        })

        user.authenticateUser(authDetails, {
          onSuccess: async (data) => {
            const sessionData = await getSession()

            console.log('ON SUCCESS LOGIN', sessionData)

            if (sessionData.selectedSubscription.paymentStatus === 'unpaid') window.location.href = PATH_AUTH.payment

            resolve(data)
          },
          onFailure: (err) => {
            if (err.code === 'NotAuthorizedException') err.message = 'Incorrect username or password'
            reject(err)
          },
          // newPasswordRequired: function (userAttributes, requiredAttributes) {
          //   // User was signed up by an admin and must provide new
          //   // password and required attributes, if any, to complete
          //   // authentication.

          //   // the api doesn't accept this field back
          //   delete userAttributes.email_verified;

          //   // store userAttributes on global variable
          //   sessionUserAttributes = userAttributes;
          // },
          newPasswordRequired: () => {
            // Handle this on login page for update password.
            resolve({ message: 'newPasswordRequired' })
          },
        })
      }),
    [getSession]
  )

  const changePassword = (newPassword) =>
    new Promise((resolve, reject) => {
      // const user = UserPool.getCurrentUser();
      const user = new CognitoUser({
        Username: credentials.email,
        Pool: UserPool,
      })

      // getSession().then(session => {
      console.log('CHANGE PASSWORD', credentials, newPassword, user, state)
      // })

      // user.changePassword(credentials.password, newPassword, (err, result) => {
      //   if (err) {
      //     console.log("changePassword ERR", err);
      //     reject(err)
      //   } else {
      //     console.log("Successfully changed password of the user.");
      //     console.log(result);
      //     resolve(data);
      //   }
      // })
    })

  // same thing here
  const logout = () => {
    const user = UserPool.getCurrentUser()
    if (user) {
      user.signOut()
      dispatch({ type: 'LOGOUT' })
      dispatch(logoutUser())
    }
  }

  const confirmUser = (code) =>
    new Promise(async (resolve, reject) => {
      const email = localStorage.getItem('user')
      // Authenticate first
      const user = new CognitoUser({
        Username: email,
        Pool: UserPool,
      })
      // Confirm second
      user.confirmRegistration(code, true, async (err) => {
        if (err) {
          console.log('confirmRegistration ERR', err)
          reject(err)
          return
        }
        // await axios.put('/user/email-verified')
        resolve()
      })
    })

  const resendConfirmUserCode = () =>
    new Promise((resolve, reject) => {
      // Authenticate first
      const user = new CognitoUser({
        Username: credentials.email,
        Pool: UserPool,
      })
      // Resend second
      user.resendConfirmationCode(function (err, result) {
        if (err) {
          alert(err.message || JSON.stringify(err))
          reject(err)
          return
        }
        resolve()
        console.log('call result: ' + result)
      })
    })

  const register = (email, password, firstName, lastName, additionalInfo) =>
    new Promise((resolve, reject) =>
      UserPool.signUp(
        email,
        password,
        [
          { Name: 'email', Value: email },
          { Name: 'name', Value: `${firstName} ${lastName}` },
          { Name: 'given_name', Value: firstName },
          { Name: 'family_name', Value: lastName },
          { Name: 'phone_number', Value: additionalInfo.phoneNumber },
        ],
        null,
        async (err, result) => {
          if (err) {
            reject(err)
            return
          }
          const requestData = {
            ...additionalInfo,
            cognitoSub: result.userSub,
            emailVerified: result.userConfirmed,
            firstname: firstName,
            lastname: lastName,
            email,
          }

          const response = await axios.post('/user/initial-register', requestData)

          localStorage.setItem('user', email)

          resolve()
          window.location.href = PATH_AUTH.verify
        }
      )
    )

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'cognito',
        user: {
          displayName: state?.user?.name || 'Minimals',
          role: 'admin',
          ...state.user,
        },
        login,
        register,
        logout,
        changePassword,
        changePassword,
        confirmUser,
        resendConfirmUserCode,
        selectUserCompanyDispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
