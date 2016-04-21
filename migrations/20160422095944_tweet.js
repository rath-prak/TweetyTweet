exports.up = function(knex, Promise) {
  console.log('TWEET table created')

  return knex.schema.createTableIfNotExists('tweet', function(table) {
    table.increments('id')
    table.string('name')
    table.string('tweet')
    table.string('personId')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tweet').then(function () {
    console.log('TWEET table was dropped')
  })
};
