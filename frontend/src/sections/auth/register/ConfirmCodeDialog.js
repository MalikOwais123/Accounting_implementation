import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
// hooks
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ConfirmCodeDialog({ open, onClose }) {
  const { confirmUser } = useAuth();

  const isMountedRef = useIsMountedRef();

  const ConfirmCodeSchema = Yup.object().shape({
    code: Yup.string().required('Confrimation code is required'),
  });

  const defaultValues = {
    code: '',
  };

  const methods = useForm({
    resolver: yupResolver(ConfirmCodeSchema),
    defaultValues,
  });


  const { setError, reset, handleSubmit, formState: { errors, isSubmitting }, } = methods;
  const onSubmit = async (data) => {
    try {
      await confirmUser(data.code);

    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        console.log("ERROR", error.message)
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };


  return (
    <Dialog open={open} onClose={() => onClose()}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Verify Registration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the verification code sent to you on { } to confirm your registration.
          </DialogContentText>
          <RHFTextField name="code" label="Confirmation Code" />
          {/* <TextField
          autoFocus
          fullWidth
          type="text"
          margin="dense"
          variant="outlined"
          label="Confirmation Code"
        /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()} color="inherit">
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Verify
          </LoadingButton>
          {/* <Button onClick={() => onClose()} variant="contained">
          Verify
        </Button> */}
        </DialogActions>
      </FormProvider>
    </Dialog >
  );
}
