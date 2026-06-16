const { z } = require('zod');

const registerValidator = z.object({
    name: z.string().min(3, "Name length should be greater than 3").max(255, "Name length should be less than 255"),
    email: z.string().email({ required_error: "Email is required" }),
    password: z.string().min(8, "Password length should be greater than 8").max(15, "Password length should be less than 15"),
    role: z.enum(['admin', 'student', 'faculty'], { message: "Invalid Role" })
});

const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        const message = error.errors.map(err => err.message).join(", ");
        console.log(message);
        res.status(400).json({ message: message });
    }
};

module.exports = { validate, registerValidator };
