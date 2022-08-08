import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { useCallback, useEffect, useMemo } from 'react'
import { useSnackbar } from 'notistack'
// next
import { useRouter } from 'next/router'
// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
// @mui
import { DatePicker, LoadingButton } from '@mui/lab'
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, MenuItem, TextField } from '@mui/material'
// utils
import { fData } from '../../../utils/formatNumber'
// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// _mock
import { countries } from '../../../_mock'
// components
import Label from '../../../components/Label'
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form'
import { useCreateGeneralEntry, useEditAccountDetail, useGetAllAccounts } from 'src/query'

import axios from 'axios'

// ----------------------------------------------------------------------

GeneralEntryNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAccount: PropTypes.object,
}

export default function GeneralEntryNewForm({ isEdit = false, currentAccount }) {
  const { push } = useRouter()

  const { enqueueSnackbar } = useSnackbar()
  const { mutateAsync: createAPI, isLoading: isCreating } = useCreateGeneralEntry()
  const { data: accountsList } = useGetAllAccounts()
  console.log('accountsList', accountsList)
  const { mutateAsync: editAccount, isLoading: isEditing } = useEditAccountDetail(currentAccount?.id)

  const NewAccountSchema = Yup.object().shape({
    explanation: Yup.string().required('Explanation is required'),
    date: Yup.string().required('Date is required'),
    debitAcc: Yup.string().required('This is required'),
    creditAcc: Yup.string().required('This is required'),
    debitAmount: Yup.string().required('This is required'),
    creditAmount: Yup.string().required('This is required'),
  })

  const defaultValues = useMemo(
    () => ({
      date: new Date(),
      //   description: currentAccount?.description || '',
      //   nature: currentAccount?.nature || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentAccount]
  )

  const methods = useForm({
    resolver: yupResolver(NewAccountSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const values = watch()

  useEffect(() => {
    if (isEdit && currentAccount) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentAccount])

  const modifyData = (accTitle, amount) => {
    const { id: accId, ...restDetail } = accountsList.find((el) => el.title === accTitle)
    const _tempData = [
      {
        attributes: restDetail,
        id: accId,
      },
    ]
    return {
      ..._tempData,
      amount,
    }
  }

  const onSubmit = async (d) => {
    try {
      // ~data should be wrapped to make post request
      const debit = modifyData(d.debitAcc, d.debitAmount)
      const credit = modifyData(d.creditAcc, d.creditAmount)
      const _date = new Date(d.date).toISOString()
      const payload = {
        data: { debit, credit, date: _date },
      }
      console.log('payload', payload)
      const { status } = await createAPI(payload)
      if (status === 200) {
        onSuccess()
      }
      //   if (isEdit) {
      //     const { status } = await editAccount(payload)
      //     if (status === 200) {
      //       onSuccess()
      //     }
      //   } else {
      //     const { status } = await createAPI(payload)
      //     if (status === 200) {
      //       onSuccess()
      //     }
      //   }
    } catch (error) {
      console.error(error)
    }
  }

  const onSuccess = async() => {
    reset()
    enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!')
    push(PATH_DASHBOARD.generalJournals.list)
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {/* DATE */}
              <Controller
                name="date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Date"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField fullWidth {...params} error={!!error} helperText={error?.message} />
                    )}
                  />
                )}
              />

              {/* DEBOT */}
              <Grid container spacing={2}>
                <Grid item xs={8} md={8}>
                  <RHFSelect name="debitAcc" label="Debit Account" placeholder="Debit Account">
                    {accountsList?.map((option) => (
                      <MenuItem key={option.title} value={option.title}>
                        {option.title}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={4} md={4}>
                  <RHFTextField type="number" name="debitAmount" label="Amount" autoComplete={'off'} />
                </Grid>
              </Grid>
              {/* EXPLANATION */}
              <RHFTextField name="explanation" label="Explanation" />
              {/* CREDIT */}
              <Grid container spacing={2}>
                <Grid item xs={8} md={8}>
                  <RHFSelect name="creditAcc" label="Credit Account" placeholder="Credit Account">
                    {accountsList?.map((option) => (
                      <MenuItem key={option.title} value={option.title}>
                        {option.title}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={4} md={4}>
                  <RHFTextField type="number" name="creditAmount" label="Amount" autoComplete={'off'} />
                </Grid>
              </Grid>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isCreating || isEditing}>
                {!isEdit ? 'Create Entry' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
