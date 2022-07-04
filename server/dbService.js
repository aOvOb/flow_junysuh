const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();
const mybatisMapper = require('mybatis-mapper')
mybatisMapper.createMapper(['./xml/query.xml'])

const dbInfo = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'flow',
    port: 3306
}

let params = {}
    ,query = {}

const connection = mysql.createConnection(dbInfo)
let excQuery
// const dbInfo = {
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     port: process.env.DB_PORT
// }

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('🏔 mysql is connected successfully!🏔  threaId : ' + connection.threadId)
});


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    static getAllData() {
      
        return new Promise((resolve, reject) => {
            params.sGetList = {}
            query.sGetList = mybatisMapper.getStatement('flow', 'getBannedExtList', params, {language: 'sql', indent: '  '})
            connection.query(query.sGetList, (err, data) => {
                if (err) reject(err.message);
                console.log(data)
                resolve(data);
            })
        });
    
    }


    static insertNewName(client) {
        return new Promise((resolve, reject) => {
            // const query = "INSERT INTO fw_ext_ban (SYS_ID, SYS_FLAG, SYS_CREATE_DATE, SYS_MODIFY_DATE, FW_EXT_NAME, FK_USER_ID) VALUES (getNewID(), 1, now(), now(), ?, '' );";
            params.sInsertBanExt = {
                FW_EXT_NAME: client.name
            }
            query.sInsertBanExt = mybatisMapper.getStatement('flow', 'insertExtName', params, {language: 'sql', indent: '  '})
            // console.log('real query : ',query.sInsertBanExt)
            connection.query(query.sInsertBanExt, (err, data) => {
                if (err) reject(err)
                // console.log('your Data!!! ',data)
                resolve(data);
            })
        });
    }

    static deleteRowById(id) {
        return new Promise((resolve, reject) => {
            params.sDeleteExt = {
                SYS_ID: id
            }
            query.sDeleteExt = mybatisMapper.getStatement('flow', 'deleteBannedExt', params, {language: 'sql', indent: '  '})
            connection.query(query.sDeleteExt, (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        });
    }

    static updateNameById(client) {
        // console.log('이건 아이디',id)
        // console.log('이건 이름',name)
        return new Promise((resolve, reject) => {
            params.sUpdateExt = {
                SYS_ID: client.id,
                FW_EXT_NAME: client.name
            }
            const queryres = query.sUpdateExt = mybatisMapper.getStatement('flow', 'updateBannedExt', params, {language: 'sql', indent: '  '})
            console.log(queryres)
            connection.query(query.sUpdateExt, (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        });
    }

    static searchByName(name) {
        
        return new Promise((resolve, reject) => {
            params.sSearchExt = {
                FW_EXT_NAME: name
            }
            query.sSearchExt = mybatisMapper.getStatement('flow', 'searchExtByName', params, {language: 'sql', indent: '  '})

            connection.query(query.sSearchExt, (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        });
    }
}

module.exports = DbService;