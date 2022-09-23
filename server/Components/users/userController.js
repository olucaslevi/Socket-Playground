const express = require('express');
const User = require('./User');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../../Database/database');

router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.json(users);
    });
});

router.post("/users/create", (req, res) => {
    const {name,email,password} = req.body;

    if (email == undefined || name == undefined || password == undefined) {
        res.status(400);
        res.json({ err: "Dados inválidos" });
        return;
    }else{
        User.findOne({where:{email:email}}).then(user=>{
            if(!user){
                const salt = bcrypt.genSaltSync(10);
                bcrypt.hash(password, salt).then(hash => {
                    User.create({
                        email: email,
                        name: name,
                        password: hash,
                    }).then(() => {
                        res.status(200);
                        res.send("Usuário criado com sucesso !");
                        console.log("Usuário criado com sucesso !");
                    }).catch((err) => {
                        res.status(400);
                        res.json({ err: err });
                    }
                    );
                });
            }else{
                res.status(406);
                res.json({err:"Email já cadastrado"});
            }
        });
    }
});

module.exports = router;