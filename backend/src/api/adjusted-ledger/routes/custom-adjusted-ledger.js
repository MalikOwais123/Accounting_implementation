// custom routes for the adjusted-ledger
module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: 'GET',
      path: '/adjusted-ledger/work',
      handler: 'adjusted-ledger.index',
    },
  ],
}
