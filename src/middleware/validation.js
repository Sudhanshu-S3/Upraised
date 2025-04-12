const validateGadgetId = (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid gadget ID'
        });
    }

    next();
};

const validateGadget = (req, res, next) => {
    const { name, price } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Gadget name is required'
        });
    }

    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
        return res.status(400).json({
            success: false,
            message: 'Price must be a positive number'
        });
    }

    next();
};

const validateSelfDestruct = (req, res, next) => {
    const { code } = req.body;

    if (!code || typeof code !== 'string' || code.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Valid self-destruct code is required'
        });
    }
    next();
};

module.exports = {
    validateGadgetId,
    validateGadget,
    validateSelfDestruct
};