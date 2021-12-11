const usersModel = require('../users/users-model')

// function restricted(req, res, next) {
//   if (req.session && req.session.user) {
//     next()
//   } else {
//     res.status(401).json({ "message": "You shall not pass!" })
//   }
// }

// 3- On FAILED registration due to `username` or `password` missing from the request body,
// the response body should include a string exactly as follows: "username and password required".
function passwordAndUsernameInReqBody(req, res, next) {
    if (!req.body.username || !req.body.password) {
        res.status(401).json({ "message": "username and password required" })
    } else if (req.body.username === '' || req.body.password === '') {
        res.status(401).json({ "message": "username and password required" })
    } else if (typeof req.body.username !== "string") {
        res.status(401).json({ "message": "username and password required" })
    } else {
        next()
    }
}

//4- On FAILED registration due to the `username` being taken,
// the response body should include a string exactly as follows: "username taken".
function checkUsernameFree(req, res, next) {
    const filter = { username: req.body.username }

    usersModel
        .findBy(filter)
        .then(nameFound => {
            if (nameFound[0]) {
                res.status(422).json({ "message": "username taken" })
            } else {
                next()
            }
        })
}


//If password -- 4 chars or shorterstatus 422 {"message": "Password must be longer than 4 chars"}
function checkPasswordLength(req, res, next) {
    if (req.body.password.length <= 4 || req.body.password === "") {
        res.status(422).json({ "message": "Password must be longer than 4 chars" })
    } else {
        next()
    }
}

// 4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
// the response body should include a string exactly as follows: "invalid credentials".
async function checkUsernameExists(req, res, next) {
    try {
        const [user] = await usersModel.findBy({ username: req.body.username })
        if (!user) {
            res.status(401).json({ "message": "invalid credentials" })
        } else {
            req.user = user; // this way we already have the the pasword on the 
            //request object when it comes time to compare it
            next()
        }
    } catch (err) {
        res.status(500).json({ "message": "An error happened in the DB" })
    }
}

// Add these to the `exports` object so they can be required in other modules
module.exports = { checkPasswordLength, passwordAndUsernameInReqBody, checkUsernameFree, checkUsernameExists }


