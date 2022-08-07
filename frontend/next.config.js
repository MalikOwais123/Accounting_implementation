const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/list',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline',
]);
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')


// const withtm = withTM({
//   swcMinify: false,
//   trailingSlash: true,
//   env: {
//     // HOST_API_KEY: 'https://minimal-assets-api.vercel.app',
//     HOST_API_KEY: 'https://localhost:5000',
//     // FIREBASE AUTH
//     FIREBASE_API_KEY: '',
//     FIREBASE_AUTH_DOMAIN: '',
//     FIREBASE_PROJECT_ID: '',
//     FIREBASE_STORAGE_BUCKET: '',
//     FIREBASE_MESSAGING_SENDER_ID: '',
//     FIREBASE_APPID: '',
//     FIREBASE_MEASUREMENT_ID: '',
//     // AWS COGNITO AUTH
//     AWS_COGNITO_USER_POOL_ID: 'ap-southeast-1_VDB3dY5av',
//     AWS_COGNITO_CLIENT_ID: '259icl2kr53n9ent41bem1dom5',
//     // AUTH0 AUTH
//     AUTH0_CLIENT_ID: '',
//     AUTH0_DOMAIN: '',
//     //
//     MAPBOX: '',
//   },
// });
module.exports = (phase) => {

  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'
  // when `next build` or `npm run build` is used
  const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1'
  console.log(`Environment | isDev:${isDev}  isProd:${isProd}  isStaging:${isStaging}`)

  const env = {
    HOST_API_KEY: (() => {
      if (isDev) return 'http://localhost:1337'
      if (isStaging) return 'http://localhost:1337'
      if (isProd) return 'http://localhost:1337'
      // if (isDev) return 'http://localhost:5000/api'
      // if (isStaging) return 'http://localhost:5000/api'
      // if (isProd) return 'https://grcyberian.herokuapp.com/api'

      return 'HOST_API_KEY:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
 
    // AWS COGNITO AUTH
    AWS_COGNITO_USER_POOL_ID: 'ap-southeast-1_VDB3dY5av',
    AWS_COGNITO_CLIENT_ID: '259icl2kr53n9ent41bem1dom5',
    
  }

  return withTM({
    swcMinify: false,
    trailingSlash: true,
    env
  });

}
