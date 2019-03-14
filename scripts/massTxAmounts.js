// Copyright (c) 2018, Fexra
//
// Please see the included LICENSE file for more information.
'use strict'

require('dotenv').config('../')
const db = require('../utils/utils').knex

calculateAmounts()

async function calculateAmounts() {
    try {

        // Select Mass Tx and calculate sum
        const txns = await db('transactions')
        .leftJoin('transfers', 'transactions.id', 'transfers.tid')
        .select('transactions.id')
        .sum('transfers.amount as sum')
        .where('type', 11)
        .groupBy('transactions.id')

        // Update with amount
        txns.map(async (tx) => {
            await db('transactions')
            .update({
                amount: tx.sum || 0
            })
            .where('id', tx.id)
            console.log('[Tx] [' + tx.id + '] updated with an amount of ' + tx.sum + '.')
        })
    }
    catch(err) {
        console.log(err)
    }
}