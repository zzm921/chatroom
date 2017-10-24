import Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'zzm', '824781', {
    'dialect': 'mysql',  // 数据库使用mysql
    'host': 'localhost', // 数据库服务器ip
    'port': 3306,        // 数据库服务器端口
    'define': {
        // 字段以下划线（_）来分割（默认是驼峰命名风格）
        'underscored': true
    }
})

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    pwd: Sequelize.STRING

});


export async function register(username: string, pwd: string): Promise<any> {
    var user = await User.create({
        "username": username,
        "pwd": pwd
    })
    return user
}

export async function login(username: string, pwd: string): Promise<any> {
    var user = await User.find({
        "where": {
            "username": username,
            "pwd": pwd
        }
    })
    return user
}