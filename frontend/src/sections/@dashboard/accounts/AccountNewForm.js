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
import { LoadingButton } from '@mui/lab'
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, MenuItem } from '@mui/material'
// utils
import { fData } from '../../../utils/formatNumber'
// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// _mock
import { countries } from '../../../_mock'
// components
import Label from '../../../components/Label'
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form'
import { useCreateAccount, useEditAccountDetail } from 'src/query'

// ----------------------------------------------------------------------

const ACCOUNT_NATURE = [
  {
    value: 'current_asset',
    label: 'Current asset',
  },
  {
    value: 'current_liability',
    label: 'Current liability',
  },
  {
    value: 'longterm_asset',
    label: 'Longterm asset',
  },
  {
    value: 'longterm_liability',
    label: 'Longterm liability',
  },
  {
    value: 'revenue',
    label: 'Revenue',
  },
  {
    value: 'expense',
    label: 'Expense',
  },
  {
    value: 'drawing',
    label: 'Drawing',
  },
  {
    value: 'owner_equity',
    label: 'Owner equity',
  },
]

AccountNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAccount: PropTypes.object,
}

export default function AccountNewForm({ isEdit = false, currentAccount }) {
  const { push } = useRouter()

  const { enqueueSnackbar } = useSnackbar()
  const { mutateAsync: createAccount, isLoading: isCreating } = useCreateAccount()
  const { mutateAsync: editAccount, isLoading: isEditing } = useEditAccountDetail(currentAccount?.id)

  const NewAccountSchema = Yup.object().shape({
    title: Yup.string().required('Name is required'),
    // description: Yup.string().required('Description is required'),
    nature: Yup.string().required('Nature is required'),
  })

  const defaultValues = useMemo(
    () => ({
      title: currentAccount?.title || '',
      // description: currentAccount?.description || '',
      nature: currentAccount?.nature || '',
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

  const onSubmit = async (d) => {
    try {
      // ~data should be wrapped to make post request
      const payload = {
        data: { ...d },
      }
      if (isEdit) {
        const { status } = await editAccount(payload)
        if (status === 200) {
          onSuccess()
        }
      } else {
        const { status } = await createAccount(payload)
        if (status === 200) {
          onSuccess()
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onSuccess = () => {
    reset()
    enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!')
    // push(PATH_DASHBOARD.accounts.list)
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
              <RHFTextField name="title" label="Account title" />

              <RHFSelect name="nature" label="Nature" placeholder="Nature">
                {ACCOUNT_NATURE.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              {/* <RHFTextField name="description" label="Description" /> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isCreating || isEditing}>
                {!isEdit ? 'Create Account' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
