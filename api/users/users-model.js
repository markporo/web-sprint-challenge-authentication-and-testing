const db = require('../../data/dbConfig')

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
    return db('users as us')
    // .select('us.user_id', 'us.username')
    // .orderBy('us.user_id', 'asc')
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
    return db('users as us')
        .where(filter)
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {

    const user = await db('users as us')
        .select('us.user_id', 'us.username')
        .where('us.user_id', user_id)
        .first()

    return user
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
    const [id] = await db('users').insert(user, 'id')
    return findById(id);
}


// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = { find, findById, findBy, add }