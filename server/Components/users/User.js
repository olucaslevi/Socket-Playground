var Sequelize = require('sequelize');

var connection = require('../../Database/database');

const User = connection.define('users',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    name: {type: Sequelize.STRING,
        allowNull: false,
    },
    email: {type: Sequelize.STRING,
        allowNull: false,
    },
    password: {type: Sequelize.STRING,
        allowNull: false,
    },
});

// User.sync({force:true})

module.exports  = User;