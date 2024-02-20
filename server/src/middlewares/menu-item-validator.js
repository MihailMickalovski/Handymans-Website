const ApiError = require('../util/ApiError');

exports.menuItemValidator = (req, res, next) => {
    let {
        name,
        description,
        price,
        category,
        available,
    } = req.body;

    if (
        !name ||
        !description ||
        !price ||
        !category ||
        available === undefined
    ) {
        return next(ApiError.badRequest('Please check all the fields and try again!'));
    }
    next();
};
