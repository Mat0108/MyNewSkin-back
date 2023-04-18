// const user = process.env.USER;
// const pwd = process.env.PASSWORD;
db.createUser ({
    user : "mdsuser",
    pwd : "mdspass",
    roles : [{
        role : "readWrite", db : "mdsdp"
    }]
});

db.auth('mdsuser','mdspass');