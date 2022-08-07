// @mui
import { styled } from '@mui/material/styles'
// layouts
import Layout from 'src/layouts'
// components
import LoadingScreen from 'src/components/LoadingScreen'
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeDarkMode,
  HomeLookingFor,
  HomeColorPresets,
  HomePricingPlans,
  HomeAdvertisement,
  HomeCleanInterfaces,
  HomeHugePackElements,
} from 'src/sections/home'
import useAuth from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { PATH_AUTH } from 'src/routes/paths'
import { useEffect } from 'react'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}))

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}))

// ----------------------------------------------------------------------

HomePage.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>
}

// ----------------------------------------------------------------------

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const { push } = useRouter() // useRouter is a hook

  useEffect(() => {
    if (isAuthenticated) {
      push(PATH_AUTH.root)
    } else {
      push(PATH_AUTH.login)
    }
  }, [isAuthenticated])

    // NOW TEMPORARY UNTIL WE HAVE A DASHBOARD
    return <LoadingScreen />

  // return (
  //   <Page title="The starting point for your next project">
  //     <RootStyle>
  //       <HomeHero />
  //       <ContentStyle>
  //         <HomeMinimal />

  //         <HomeHugePackElements />

  //         <HomeDarkMode />

  //         <HomeColorPresets />

  //         <HomeCleanInterfaces />

  //         <HomePricingPlans />

  //         <HomeLookingFor />

  //         <HomeAdvertisement />
  //       </ContentStyle>
  //     </RootStyle>
  //   </Page>
  // )
}
