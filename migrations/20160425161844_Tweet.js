exports.up = function(knex, Promise) {
  console.log('TWEET table created')

  return knex.schema.createTableIfNotExists('Tweet', function(table) {
    table.increments('id')
    table.string('tweet')
    table.string('userId')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('Tweet').then(function () {
    console.log('TWEET table was dropped')
  })
};
