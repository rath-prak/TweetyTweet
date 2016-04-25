exports.up = function(knex, Promise) {
console.log('Following table created')

  return knex.schema.createTableIfNotExists('Following', function (table) {
    table.integer('followerId')
    table.integer('followingId')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Following').then(function () {
    console.log('Following table was dropped')
  })
};
