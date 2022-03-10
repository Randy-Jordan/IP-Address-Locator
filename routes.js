const { default: axios } = require('axios');
const url = require('url')
const express = require('express');
const req = require('express/lib/request');
const path = require('path');
const router = express.Router();

const BASE_URL= process.env.BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY = process.env.API_KEY

router.get('/',async (req,res)=>{
    try {
        const params = new URLSearchParams({
            [API_KEY_NAME]: API_KEY,
            ...url.parse(req.url,true).query
            
        })
        
        const apiRes = await axios.get(`${BASE_URL}${params}`)
        res.status(200).json(apiRes.data)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
        
    }
})


module.exports = router;