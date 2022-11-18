const express = require("express");

const { users } = require("../data/users.json");

const router = express.Router();


/** 
 * Route: /users
 * Method : GET
 * Description : Get all users
 * Access : Public
 * Parameters : None
 */
router.get("/", (req, res) => {
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

router.get("/:id", (req, res) => {
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

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const user = users.find((each) => each.id === id);

    if (!user)
        return res.status(404).json({ success: false, message: "user not found" });

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
 * Route: users/users/id
 * Method : DELETE
 * Description : Delete a user by id
 * Access : Public
 * Parameters : id
 */
router.delete('/:id', (req, res) => {
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

/** 
 * Route: /subscription-details/:id
 * Method : DELETE
 * Description : Get all users subscription details
 * Access : Public
 * Parameters : id
 */

router.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id === id);

    if (!user)
        return res.status(404).json({
            success: false,
            message: "user not found",

        });

    const getDateInDays = (data = "") => {
        let date;
        if (data === "") {
            // current date
            date = new Date();
        } else {
            // getting date on basis of data variable
            date = new Date(data);
        }
        let days = Math.floor(date / (1000 * 60 * 60 * 24));
        return days;
    };

    const subscriptionType = (date) => {
        if (user.subscriptionType === "Basic") {
            date = date + 90;
        } else if (user.subscriptionType === "standard") {
            date = date + 180;
        } else if (user.subscriptionType === "premium") {
            date = date + 365;
        }
        return date;



    };

    // subscription expiration calculation
    // january 1, 1970, UTC. //milliseconds
    let returnDate = getDateInDays(user.returnDate)
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    console.log("Return Date", returnDate);
    console.log("Current Date", currentDate);
    console.log("Subscription Date", subscriptionDate);
    console.log("Subscription expiry Date", subscriptionExpiration);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        daysLeftForExpiration:
            subscriptionExpiration <= currentDate
                ? 0
                : subscriptionExpiration - currentDate,
        fine:
            returnDate < currentDate
                ? subscriptionExpiration <= currentDate
                    ? 200
                    : 100
                : 0,


    };

    res.status(200).json({
        success: true,
        data,


    })
});




module.exports = router;