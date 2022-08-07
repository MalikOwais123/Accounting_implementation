import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export default function ConfirmModal({
  forCorporate, // if corporate, then hide delete button
  heading = 'Delete',
  description = 'Are you sure you want to delete this item?',
  btnText = 'Yes, Delete',
  show,
  onClose,
  onOk,
  isLoading,
}) {
  return (
    <div>
      <Dialog open={show} onClose={onClose}>
        <DialogTitle>
          {/* // * HEADING TEXT */}

          {/* // * NOT CORPORATE */}
          {!forCorporate && (
            <Typography variant="h5" gutterBottom>
              {heading}
            </Typography>
          )}
          {/* // * CORPORATE */}
          {forCorporate && (
            <Typography variant="h5" gutterBottom>
              {'Corporate Assessment'}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {/* // * DETAIL TEXT */}

          {/* // * NOT CORPORATE */}
          {!forCorporate && <Typography variant="body2">{description}</Typography>}
          {/* // * CORPORATE */}
          {forCorporate && (
            <Typography variant="body2">
              {
                "Corporate Assessment can't be deleted. You can make any other Assessment as Corporate and then delete it."
              }
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {/* // * CANCEL BUTTON */}

          {/* // * NOT CORPORATE */}
          {!forCorporate && (
            <Button type="button" onClick={onClose} color="inherit">
              No, Cancel
            </Button>
          )}
          {/* // * CORPORATE */}
          {forCorporate && (
            <Button type="button" onClick={onClose} color="inherit">
              Ok, Cancel
            </Button>
          )}

          {/* // * DELETE BUTTON */}
          {!forCorporate && (
            <LoadingButton
              color="error"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOk()
              }}
              variant="contained"
              loading={isLoading}
            >
              {btnText}
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}
