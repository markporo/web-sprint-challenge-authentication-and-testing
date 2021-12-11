const db = require('../../data/dbConfig')

/**
  resolves to an ARRAY with all users, each user having { id, username }
 */
function find() {
    return db('users as us')
    // .select('us.id', 'us.username')
    // .orderBy('us.id', 'asc')
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
    return db('users as us')
        .where(filter)
}

/**
  resolves to the user { id, username } with the given id
 */
async function findById(id) {

    const user = await db('users as us')
        .select('us.id', 'us.username', 'us.password')
        .where('us.id', id)
        .first()

    return user
}

/**
  resolves to the newly inserted user { id, username }
 */
async function add(user) {
    const [id] = await db('users').insert(user, 'id')
    return findById(id);
}


// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = { find, findById, findBy, add }