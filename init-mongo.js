db.createUser(
    {
        user: "fffapp",
        pwd: "fffapp",
        roles: [
            {
                role: "readWrite",
                db: "fffapp"
            }
        ]
    }
)
