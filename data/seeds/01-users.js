
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'Jeff',
          password: '$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq', // password "1234"        
        },
        {
          username: 'JUNE',
          password: '$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiVoGSShTvuJVGw8CpsCiq', // password "1234"
        }
      ])
    });
};
