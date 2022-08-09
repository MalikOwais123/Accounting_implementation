'use strict'

/**
 *  adjusted-ledger controller
 */

const { createCoreController } = require('@strapi/strapi').factories
const axios = require('axios')

module.exports = createCoreController(
  'api::adjusted-ledger.adjusted-ledger',
  ({ strapi }) => ({
    // ~ Method 1: Creating an entirely custom action
    async index(ctx) {
      // * mock data format for adjusted-ledgers ---> (CHECK IN THE CONTENT TYPE SCHEMA)

      try {
        const adjustedEntiresData = await strapi
          .service('api::adjusted-entries-record.adjusted-entries-record')
          .find()
        const adjustedLedgersData = await strapi
          .service('api::adjusted-ledger.adjusted-ledger')
          .find()

        console.log('adjustedLedgersData', adjustedLedgersData)
        const lastAdjustedEntry = adjustedEntiresData.results.pop()

        // ~ check if the last adjusted-entry has a debit side
        const check1 = adjustedLedgersData.results.find(
          (e) => e.title === lastAdjustedEntry.debit[0].attributes.title,
        )
        // * if check1 passes append it to the debit side of the adjusted-ledger
        if (check1) {
          console.log('check1 founded')
          await strapi.entityService.update(
            'api::adjusted-ledger.adjusted-ledger',
            check1.id,
            {
              data: {
                debit: {
                  amount: [
                    ...check1.debit.amount,
                    parseInt(lastAdjustedEntry.debit.amount),
                  ],
                },
              },
            },
          )
        } else {
          // * if check1 fails create a new adjusted-ledger with the debit side
          console.log('BEFORE')
          await axios.post('http://localhost:1337/api/adjusted-ledgers', {
            data: {
              title: lastAdjustedEntry.debit[0].attributes.title,
              nature: lastAdjustedEntry.debit[0].attributes.nature,
              debit: {
                amount: [parseInt(lastAdjustedEntry.debit.amount)],
              },
              credit: { amount: [] },
            },
          })
          console.log('AFTER')
        }

        // ~ check if the last adjusted-entry has a credit side
        const check2 = adjustedLedgersData.results.find(
          (e) => e.title === lastAdjustedEntry.credit[0].attributes.title,
        )
        // * if check2 passes append it to the credit side of the adjusted-ledger
        if (check2) {
          console.log('check2 founded')
          await strapi.entityService.update(
            'api::adjusted-ledger.adjusted-ledger',
            check2.id,
            {
              data: {
                credit: {
                  amount: [
                    ...check2.credit.amount,
                    parseInt(lastAdjustedEntry.credit.amount),
                  ],
                },
              },
            },
          )
        } else {
          // * if check2 fails create a new adjusted-ledger with the credit side
          await axios.post('http://localhost:1337/api/adjusted-ledgers', {
            data: {
              title: lastAdjustedEntry.credit[0].attributes.title,
              nature: lastAdjustedEntry.credit[0].attributes.nature,
              debit: {
                amount: [],
              },
              credit: { amount: [parseInt(lastAdjustedEntry.credit.amount)] },
            },
          })
        }

        // ? return the adjusted-ledgers data
        // ctx.send(adjustedLedgersData)
        ctx.send({ message: 'success' }, 200)
      } catch (error) {
        return error
      }
    },
  }),
)
