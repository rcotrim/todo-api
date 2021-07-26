var bcrypt = require('bcrypt');
var _ = require('underscore');

const {
    DataTypes
} = require('sequelize');

module.exports = function (sequelize) {
    const user = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);

                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword)
            }
        }
    }, {
        hooks: {
            beforeValidate: function (user, options) {
                if (typeof user.email === 'string') {
                    user.email = user.email.toLowerCase()
                }
            }
        }
    });

    user.prototype.toPublicJSON = function () {
        var json = this.toJSON();
        return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
    }

    user.authenticate = function (body) {
        return new Promise(function (resolve, reject) {
            if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                return reject();
            }
            user.findOne({
                where: {
                    email: body.email
                }
            }).then(function (user) {
                if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                    return reject();
                }
                resolve(user);
            }, function (e) {
                reject();
            })

        })
    }


    return user;
}