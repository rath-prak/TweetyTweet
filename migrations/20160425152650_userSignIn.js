exports.up = function(knex, Promise) {
  console.log('User table created')

  return knex.schema.createTableIfNotExists('User', function(table) {
    table.increments('id')
    table.string('name')
    table.string('password')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('User').then(function () {
    console.log('User table was dropped')
  })
};
