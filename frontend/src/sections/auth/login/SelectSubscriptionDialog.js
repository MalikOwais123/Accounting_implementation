import { useState } from 'react'
import * as Yup from 'yup'
import { isEmpty } from 'lodash'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
// @mui
import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'
// hooks
import useAuth from 'src/hooks/useAuth'
import useIsMountedRef from 'src/hooks/useIsMountedRef'
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form'
// redux
import { useDispatch, useSelector } from 'src/redux/store'
import { getUser } from 'src/redux/slices/user'


// ----------------------------------------------------------------------

export default function ConfirmCodeDialog({ open, onClose }) {
  // const { confirmUser } = useAuth()
  const { subscriptions } = useSelector((state) => state.user)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectCompany, setSelectCompany] = useState(null)

  const isMountedRef = useIsMountedRef()

  // const ConfirmCodeSchema = Yup.object().shape({
  //   code: Yup.string().required('Confrimation code is required'),
  // });

  // const defaultValues = {
  //   code: '',
  // };

  // const methods = useForm({
  //   resolver: yupResolver(ConfirmCodeSchema),
  //   defaultValues,
  // });

  // const { setError, reset, handleSubmit, formState: { errors, isSubmitting }, } = methods;
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await getUser(selectCompany)

      setIsSubmitting(false)
    } catch (error) {
      console.error(error)
      setIsSubmitting(false)

      // if (isMountedRef.current) {
      //   console.log("ERROR", error.message)
      //   setError('afterSubmit', { ...error, message: error.message });
      // }
    }
  }

  return (
    <Dialog open={open} onClose={() => onClose()}>
      {/* <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}> */}
      <DialogTitle>Choose Company</DialogTitle>
      <DialogContent>
        <DialogContentText>Select a company you wish to be logged in as</DialogContentText>
        {!isEmpty(subscriptions) &&
          subscriptions.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectCompany(item.id)
              }}
            >
              <h3>{item.companyName}</h3>
            </div>
          ))}
      </DialogContent>
      <DialogActions>
        <LoadingButton onClick={() => onSubmit()} type="submit" variant="contained" loading={isSubmitting}>
          Next
        </LoadingButton>
        {/* <Button onClick={() => onClose()} variant="contained">
          Verify
        </Button> */}
      </DialogActions>
      {/* </FormProvider> */}
    </Dialog>
  )
}
