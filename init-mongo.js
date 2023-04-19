const user = process.env.USER;
const password = process.env.PASSWORD;
db.createUser ({
    user : `${user}`,
    pwd : `${password}`,
    roles : [{
        role : "readWrite", db : "mdsdp"
    }]
});

db.auth(`${user}`,`${password}`);