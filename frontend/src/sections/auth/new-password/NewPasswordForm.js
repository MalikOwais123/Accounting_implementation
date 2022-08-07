import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState } from 'react'
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// components
import Iconify from 'src/components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from 'src/components/hook-form';

// ----------------------------------------------------------------------

NewPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
};

export default function NewPasswordForm({ onSent, onGetEmail }) {
  const isMountedRef = useIsMountedRef();
  const { changePassword } = useAuth();
  const { pathname, push } = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    password2: Yup.string().required('Confirm password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
    // defaultValues: { email: 'demo@minimals.cc' },
  });

  const { reset, setError, handleSubmit, formState: { errors, isSubmitting }, } = methods;

  const onSubmit = async (data) => {
    const email = window.localStorage.getItem('email')


    // cognitoUser.completeNewPasswordChallenge(data.password, sessionUserAttributes);

    try {
      const res = await changePassword(data.password2);
      console.log("RES", res)

    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
    // return
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   if (isMountedRef.current) {
    //     onSent();
    //     onGetEmail(data.email);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
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

        <RHFTextField
          name="password2"
          label="Confirm Password"
          type={showPassword2 ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                  <Iconify icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Change Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
