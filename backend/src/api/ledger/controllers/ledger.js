"use strict";

/**
 *  ledger controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const axios = require("axios");

module.exports = createCoreController("api::ledger.ledger", ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async index(ctx) {
    //creating a mock data format of general journal

    try {
      const generalJournalData = await strapi
        .service("api::general-journal.general-journal")
        .find();
      const ledgerData = await strapi.service("api::ledger.ledger").find();

      const lastData = generalJournalData.results.pop();

      const check1 = ledgerData.results.find(
        (e) => e.title === lastData.debit[0].attributes.title
      );

      //if check1 passes append it to the debit side
      if (check1) {
        console.log("check1 founded");
        await strapi.entityService.update("api::ledger.ledger", check1.id, {
          data: {
            debit: {
              amount: [...check1.debit.amount, parseInt(lastData.debit.amount)],
            },
          },
        });

        // debitDataArray.push(findThat);
      } else {
        await axios.post("http://localhost:1337/api/ledgers", {
          data: {
            title: lastData.debit[0].attributes.title,
            nature: lastData.debit[0].attributes.nature,
            debit: {
              amount: [parseInt(lastData.debit.amount)],
            },
            credit: { amount: [] },
          },
        });
      }

      //if check2 passes append it to the credit side
      const check2 = ledgerData.results.find(
        (e) => e.title === lastData.credit[0].attributes.title
      );
      if (check2) {
        console.log("check2 founded");
        await strapi.entityService.update("api::ledger.ledger", check2.id, {
          data: {
            credit: {
              amount: [
                ...check2.credit.amount,
                parseInt(lastData.credit.amount),
              ],
            },
          },
        });
      } else {
        await axios.post("http://localhost:1337/api/ledgers", {
          data: {
            title: lastData.credit[0].attributes.title,
            nature: lastData.credit[0].attributes.nature,

            debit: {
              amount: [],
            },
            credit: { amount: [parseInt(lastData.credit.amount)] },
          },
        });
      }

      // })

      ctx.send({ message: "success" }, 200);
    } catch (error) {
      return error;
    }
  },
}));
