const express = require("express");

const dotenv = require("dotenv");
// database  connection 
const DbConnection = require("./databaseConnection");

// JSON data import
const { users } = require("./data/users.json");

//importing routes
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

dotenv.config();

const app = express();

const PORT = 8081;
app.use(express.json());
DbConnection();

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running",
    });
});

app.use("/users", usersRouter);
app.use("/books", booksRouter);

/** 
 * Route: /users
 * Method : GET
 * Description : Get all users
 * Access : Public
 * Parameters : None
 */
app.get("/users", (req, res) => {
    res.status(200).json({
        success: true,
        data: users,
    });
});

/** 
 * Route: /users/id 
 * Method : GET
 * Description : Get single  user by id
 * Access : Public
 * Parameters : id
 */

app.get('/users/:id', (req, res) => {
    const { id } = req.params
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user not found",
        });
    }

    return res.status(200).json({
        success: true,
        data: user,

    });
});

/** 
 * Route: /users
 * Method : POST
 * Description : Create new user
 * Access : Public
 * Parameters : none
 */

app.post("/users", (req, res) => {
    const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;

    const user = users.find((each) => each.id === id);

    if (user) {
        return res.status(404).json({
            success: false,
            message: "user exists with this id",
        });
    }

    users.push({
        id,
        name,
        surname,
        subscriptionType,
        subscriptionDate,
    });
    return res.status(201).json({
        success: true,
        data: users,
    });
});


/** 
 * Route: /users/id
 * Method : PUT (u can also use patch)
 * Description : Updating user data
 * Access : Public
 * Parameters : id
 */

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const user = users.find((each) => each.id === id);
    if (!user) return res.status(404).json({ success: false, message: "user not found" });
    const updatedUser = users.map((each) => {
        if (each.id === id) {
            return {
                ...each,
                ...data,

            };
        }
        return each;
    });

    return res.status(200).json({
        success: true,
        data: updatedUser,
    });
});

/** 
 * Route: /users/id
 * Method : DELETE
 * Description : Delete a user by id
 * Access : Public
 * Parameters : id
 */
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user to be deleted was not found",

        });
    }

    const index = users.indexOf(user);
    users.splice(index, 1);
    return res.status(202).json({ sucess: true, data: users });
})

app.get("*", (req, res) => {
    res.status(404).json({
        message: "This route does not exist",
    });
});

app.listen(PORT, () => {

    console.log(`Server is running at port ${PORT}`);
});