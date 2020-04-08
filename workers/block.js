// Copyright (c) 2018-2020, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const promisify = require('../libs').promisify
const db = require('../libs').knex

// Processes all blocks it receives from the producer collectBlock.js

module.exports = async function (Blocks) {
  try {

    // 1:1
    // Consume one message at a time for optimum speed,
    // stability and data integrity.
    Blocks.prefetch(1)
    Blocks.consume('blocks', processBlock)
  }
  catch(err) {

    console.error('[Block]: ' + err.toString())
  }

  async function processBlock (msg) {

    // Parse message content
    const block = JSON.parse(msg.content.toString())
  
    // Start db transaction
    const txn = await promisify(db.transaction.bind(db))
  
    try {
  
      // Store block
      await txn('blocks').insert({
        index: block.height,
        reference: block.reference,
        generator: block.generator,
        signature: block.signature,
        size: block.blocksize || 0,
        count: block.transactionCount || 0,
        fee: block.fee / +process.env.ATOMIC_NUMBER || 0,
        version: block.version || 0,
        timestamp: block.timestamp,
        verified: +process.env.VERIFY_CACHE === 0 ? true : false
      })
  
      // Store block consensus
      await txn('consensus').insert({
        index: block.height,
        target: block['nxt-consensus']['base-target'],
        signature: block['nxt-consensus']['generation-signature']
      })
  
      // Store block feature
      if (block.features) {
        await txn('features').insert({
          index: block.height,
          features: JSON.stringify(block.features)
        })
      }
  
      // Commit db transaction
      await txn.commit()
    
      // Acknowledge message
      await Blocks.ack(msg)
  
      console.log('[Block] [' + block.height + '] collected')
  
    } catch (err) {
  
      // SQL errror 1062 = duplicate entry
      if(err.errno === 1062) {
  
        // Acknowledge message 
        await Blocks.ack(msg)
  
        console.warn('[Block] [' + block.height + '] duplicate')
      } else {

        // Rollback db transaction
        await txn.rollback()

        // Send message back to the queue for a retry
        await Blocks.nack(msg)

        console.error('[Block] [' + block.height + '] ' + err.toString())
      }
    }
  }
}

