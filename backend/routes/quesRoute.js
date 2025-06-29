const express=require("express")
const router = express.Router();


const {toggleQues ,updateQues, addQuesToSession} =require("../controller/questioncontroller");
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

router.post("/add",ClerkExpressRequireAuth(),addQuesToSession);
router.patch("/:id/pin/",ClerkExpressRequireAuth(),toggleQues);
router.post("/:id/update",ClerkExpressRequireAuth(),updateQues);

module.exports =router;