const UserRepository = require('../repositories/user-repository');

module.exports.checkIfUserDoesNotExist = async (req, res) => {
    const username = req.params.username;
    if (!username) {
        const error = new Error("No username provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }

    try {
        let user = await UserRepository.getUserByName(username);
        if (!user || user.length === 0) {
            return res.status(200).send({success: true})
        }

        const error = new Error("User already exists, Please choose different name");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})

    } catch (err) {
        console.error(err);
        return res.status(500).render('error', {error: err});
    }

};