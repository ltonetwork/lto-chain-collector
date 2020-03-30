// Copyright (c) 2018-2020, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const db = require('../utils').knex

// Create 'blocks' table if it does not exist
db.schema.hasTable('blocks').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `blocks` created')

    return db.schema.createTable('blocks', function (table) {
      table.integer('index').unique().notNullable()
      table.string('reference').notNullable()
      table.string('generator').notNullable()
      table.string('signature').notNullable()
      table.integer('size').notNullable()
      table.integer('count').notNullable()
      table.decimal('fee', [15, 9]).notNullable()
      table.integer('version').notNullable()
      table.bigInteger('timestamp').notNullable()
      table.datetime('datetime')
      table.boolean('confirmed').defaultTo(false)
    })
  }
})

// Create 'consensus' table if it does not exist
db.schema.hasTable('consensus').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `consensus` created')

    return db.schema.createTable('consensus', function (table) {
      table.integer('index').unique().notNullable()
      table.integer('target').notNullable()
      table.string('signature').notNullable()
    })
  }
})

// Create 'features' table if it does not exist
db.schema.hasTable('features').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `features` created')

    return db.schema.createTable('features', function (table) {
      table.increments('id').primary()
      table.integer('index').notNullable()
      table.json('features').notNullable()
    })
  }
})

// Create 'transactions' table if it does not exist
db.schema.hasTable('transactions').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `transactions` created')

    return db.schema.createTable('transactions', function (table) {
      table.string('id').unique().primary().notNullable()
      table.integer('type').notNullable()
      table.integer('block').notNullable()
      table.string('recipient')
      table.string('sender')
      table.string('senderPublicKey')
      table.decimal('amount', [15, 9])
      table.decimal('fee', [15, 9]).notNullable()
      table.string('signature')
      table.string('attachment')
      table.bigInteger('timestamp').notNullable()
      table.datetime('datetime')
      table.integer('version')
      table.string('leaseId')
      table.boolean('confirmed').defaultTo(false)
    })
  }
})

// Create 'transfers' table if it does not exist
db.schema.hasTable('transfers').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `transfers` created')

    return db.schema.createTable('transfers', function (table) {
      table.increments('id').primary()
      table.string('tid').notNullable()
      table.string('recipient').notNullable()
      table.decimal('amount', [15, 9]).notNullable()
    })
  }
})

// Create 'proofs' table if it does not exist
db.schema.hasTable('proofs').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `proofs` created')

    return db.schema.createTable('proofs', function (table) {
      table.increments('id').primary()
      table.string('tid').notNullable()
      table.json('proofs').notNullable()
    })
  }
})

// Create 'anchors' table if it does not exist
db.schema.hasTable('anchors').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `anchors` created')

    return db.schema.createTable('anchors', function (table) {
      table.increments('id').primary().notNullable()
      table.string('tid').notNullable()
      table.json('anchors').notNullable()
    })
  }
})

// Create 'addresses' table if it does not exist
db.schema.hasTable('addresses').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `addresses` created')

    return db.schema.createTable('addresses', function (table) {
      table.string('address').unique().primary().notNullable()
      table.string('label')
      table.string('url')
      table.decimal('regular', [15, 9])
      table.decimal('generating', [15, 9])
      table.decimal('available', [15, 9])
      table.decimal('effective', [15, 9])
      table.datetime('updated').defaultTo(db.fn.now())
    })
  }
})
