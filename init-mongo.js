const user = process.env.user;
const pwd = process.env.password;
db.createUser ({
    user : user,
    pwd : pwd,
    roles : [{
        role : "readWrite", db : "mdsbp"
    }]
});

db.auth(user, pwd);