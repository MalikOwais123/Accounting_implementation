import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { isEmpty } from 'lodash'
import { useState, useEffect } from 'react'
// next
import NextLink from 'next/link'
import { useRouter } from 'next/router'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// hooks
import useAuth from 'src/hooks/useAuth'
import useIsMountedRef from 'src/hooks/useIsMountedRef'
// components
import Iconify from 'src/components/Iconify'
import { FormProvider, RHFTextField, RHFCheckbox } from 'src/components/hook-form'
// redux
import { useDispatch, useSelector } from 'src/redux/store'
import { selectUserSubscription } from 'src/redux/slices/user'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// ----------------------------------------------------------------------

SelectCompanyForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
}

export default function SelectCompanyForm({ onSent, onGetEmail }) {
  const isMountedRef = useIsMountedRef()

  // const { subscriptions } = useSelector((state) => state.user)
  const { changePassword, subscriptions, selectUserCompanyDispatch, isAuthenticated, isSelectedSubscription, user } =
    useAuth()
  const { pathname, push } = useRouter()
  const dispatch = useDispatch()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectCompany, setSelectCompany] = useState(null)

  useEffect(() => {
    // console.log('SELECT COMPANY FORM USEEFFECT', { isAuthenticated }, { isSelectedSubscription })
    if (isSelectedSubscription === true && isAuthenticated === true) push(PATH_DASHBOARD.general.app)
  }, [pathname, isAuthenticated, isSelectedSubscription])

  // console.log('SELECT COMPANY FORM ', subscriptions, isAuthenticated, isSelectedSubscription, user)

  const onSubmit = async () => {
    setIsSubmitting(true)
    try {
      const data = await selectUserCompanyDispatch(selectCompany)
      dispatch(selectUserSubscription(data))

      setIsSubmitting(false)
    } catch (error) {
      console.error(error)
      setIsSubmitting(false)
      // if (isMountedRef.current) {
      //   setError('afterSubmit', { ...error, message: error.message })
      // }
    }
  }

  return (
    <Stack spacing={3}>
      {!isEmpty(subscriptions) &&
        subscriptions.map((item) => (
          <div
            key={item.id}
            className={selectCompany ? 'company-list active' : 'company-list'}
            onClick={() => {
              setSelectCompany(item.id)
            }}
          >
            <h3>{item.companyName}</h3>
          </div>
        ))}

      <LoadingButton
        onClick={() => onSubmit()}
        fullWidth
        size="large"
        disabled={!selectCompany}
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Continue
      </LoadingButton>
    </Stack>
  )
}
