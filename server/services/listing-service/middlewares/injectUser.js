export const injectUser = (req, res, next) => {
    const user = req.headers["x-user"];
    if (user) {
        req.user = JSON.parse(user);
    }
    next();
};