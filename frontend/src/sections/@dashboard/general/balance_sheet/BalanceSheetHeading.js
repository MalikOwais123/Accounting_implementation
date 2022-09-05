import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Button, Card, CardContent } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

// ----------------------------------------------------------------------

BalanceSheetHeading.propTypes = {
  displayName: PropTypes.string,
};

export default function BalanceSheetHeading({ heading="Over Night Auto Shop",subHeading="This is some basic description!",dateInfo="2-jan-2021",displayName }) {
  return (
    <RootStyle>
      <CardContent
        sx={{
          pt: 1,
          // pl: { md: 5 },
          color: 'grey.800',
        }}
      >
        <Typography align="center" gutterBottom variant="h4">
        {heading}
        </Typography>
        <Typography align="center" gutterBottom variant="subtitle2">
           {subHeading}
        </Typography>

        <Typography align="center" variant="body2" sx={{ maxWidth: 480, mx: 'auto' }}>
        {dateInfo}
        </Typography>
      </CardContent>
    </RootStyle>
  );
}
