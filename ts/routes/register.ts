import express = require("express")
export const router = express()

let userdb = require("../models/user")
router.post("/", async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    let { username, pwd, repwd } = (req as any).body
    if (pwd !== repwd) {
        return res.send({ "status": 1, "data": "两次输入的密码不一致" })
    }
    let user = await userdb.register(username, pwd)
    res.cookie("username", username)
    res.send({ "status": 0, "data": user })
})



