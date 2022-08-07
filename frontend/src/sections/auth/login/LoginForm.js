import * as Yup from 'yup'
import { useState, useEffect } from 'react'
// next
import NextLink from 'next/link'
import { useRouter } from 'next/router'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// routes
import { PATH_AUTH } from 'src/routes/paths'
// hooks
import useAuth from 'src/hooks/useAuth'
import useIsMountedRef from 'src/hooks/useIsMountedRef'
// components
import Iconify from 'src/components/Iconify'
import { FormProvider, RHFTextField, RHFCheckbox } from 'src/components/hook-form'
// utils
import axios from 'src/utils/axios'
// redux
import { useDispatch, useSelector } from 'src/redux/store'
import { getUserSubscription } from 'src/redux/slices/user'

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth()
  const { pathname, push } = useRouter()

  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)

  const isMountedRef = useIsMountedRef()

  const [showPassword, setShowPassword] = useState(false)

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  })
  const email = localStorage.getItem('user') || ''
  const defaultValues = {
    email,
    remember: true,
  }

  localStorage.removeItem('user')

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  })

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods

  useEffect(() => {
    console.log('USE SELECTOR USER', user)
  }, [user])

  const onSubmit = async (data) => {
    try {
      const res = await login(data.email, data.password)
      if (res.message === 'newPasswordRequired') push(PATH_AUTH.newPassword)
      // const userSubscriptions = await axios.get(`/user/subscriptions`)
      // await dispatch(getUserSubscription())
      // push(PATH_AUTH.userCompanies)
    } catch (error) {
      console.error(error)
      reset()
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message })
      }
    }
  }
  
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <NextLink href={PATH_AUTH.resetPassword} passHref>
          <Link variant="subtitle2">Forgot password?</Link>
        </NextLink>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </FormProvider>
  )
}
