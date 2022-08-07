import * as Yup from 'yup'
import { useState } from 'react'
// axios
import axios from 'src/utils/axios'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// hooks
import useAuth from 'src/hooks/useAuth'
import useIsMountedRef from 'src/hooks/useIsMountedRef'
// components
import Iconify from 'src/components/Iconify'
import { FormProvider, RHFTextField } from 'src/components/hook-form'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { useRouter } from 'next/router'

// ----------------------------------------------------------------------

export default function PaymentForm() {
  const { register, selectedSubscription } = useAuth()
  const { push, reload } = useRouter()
  const isMountedRef = useIsMountedRef()

  const [showPassword, setShowPassword] = useState(false)

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  })

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  }

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  })

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods

  const onSubmit = async (data) => {
    try {
      const data = {
        type: 'corporate',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        paymentStatus: 'paid',
        duration: '1 year',
      }
      await axios.put(`/subscription/${selectedSubscription.id}`, data)
      // push(PATH_DASHBOARD.root)
      reload(window.location.pathname)
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

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Pay ($ 299.99)
        </LoadingButton>
      </Stack>
    </FormProvider>
  )
}
