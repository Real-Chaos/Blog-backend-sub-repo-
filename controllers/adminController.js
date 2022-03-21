const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res) => {
    const { username, password } = req.body;

    const saltRounds = 6;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const admin = new Admin({
        username,
        passwordHash,
    });

    const savedAdmin = await admin.save();

    res.json(savedAdmin);
};

// const getTokenFrom = (req) => {
//     const authorization = req.get("authorization");
//     if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//         return authorization.substring(7);
//     }

//     return null;
// };

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    // const token = getTokenFrom(req);
    // const decodedToken = jwt.verify(token, process.env.SECRET);
    // if (!decodedToken.id) {
    //     return res.json({ error: "token missing or invalid" });
    // }

    const admin = await Admin.findOne({ username });

    const passwordCorrect =
        admin === null ? false : bcrypt.compare(admin.passwordHash, password);

    if (!(admin && passwordCorrect))
        return res.json({ error: "Incorrect login" });

    const adminToken = {
        username: admin.username,
        id: admin._id,
    };

    const token = jwt.sign(adminToken, process.env.SECRET, {
        expiresIn: "1d",
    });

    // res.cookie("token", token, {
    //     maxAge: 60 * 60,
    //     httpOnly: true,
    // });

    res.json({ token });
};

const handleLogin = async (req, res) => {
    const count = await Admin.find({});

    if (count.length < 1) {
        createAdmin(req, res);
    } else {
        loginAdmin(req, res);
    }
};

module.exports = {
    handleLogin,
};
