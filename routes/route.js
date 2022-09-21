const express = require('express');
const jwt = require("jsonwebtoken");

const { isAuthenticated } = require("../helper/helper");
const { verifyRefresh } = require("../helper/helper");

const router = express.Router();

router.get("/hello", (req, res) => {
    res.json({
        "success": "ok"
    })
    });

router.post("/login", (req, res) => {
    const { username } = req.body;
    const { password } = req.body;
    if (!username && !password) {
        return res
        .status(400)
        .json({ success: false, error: "enter valid credientials" });
       }

       const accessToken = jwt.sign({ username: username }, "a1b2c3d1e2f3", {
        expiresIn: "1m",
        });
       const refreshToken = jwt.sign({ username: username }, "refreshSecret", {
        expiresIn: "1m",
        });
        //Ps. The expiresIn time is just for testing purpose you can    change it later accordingly.
       return res.status(200).json({ accessToken,refreshToken });
})

// This will be your getCallcontrolId route
router.get("/protected", isAuthenticated, (req, res) => {
  res.json({ success: true, msg: "Welcome user!!", email: req.email
  });
});

router.post("/refresh", (req, res) => {
const { username, refreshToken } = req.body;
const isValid = verifyRefresh(username, refreshToken);
if (!isValid) {
return res
.status(401)
.json({ success: false, error: "Invalid token,try login again" });
}
const accessToken = jwt.sign({ username: username }, "a1b2c3d1e2f3", {
expiresIn: "20m",
});
return res.status(200).json({ success: true, accessToken });
});

module.exports = router;

