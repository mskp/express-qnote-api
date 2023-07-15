import jwt from 'jsonwebtoken';

export default function authenticate (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send({message: 'Access denied'});

    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = verified;
        next();
    } catch(error) {
        res.status(400).send({message: error.message});
    }
}