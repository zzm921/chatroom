import express = require("express")
export const router = express()

let userdb = require("../models/user")
router.post("/", async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    let { username, pwd } = (req as any).body
    let user = await userdb.login(username, pwd)
    if (user == null) {
        return res.send({ status: 1, data: "登录失败" })
    }
    res.cookie("username", username)
    res.send({ status: 0, data: user })
})
