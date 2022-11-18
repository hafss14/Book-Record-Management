# book-record-management 

This is a book record management API backend for the management of records and books 

## API documentation link 

https://documenter.getpostman.com/view/19949898/2s8YmHwjzu

# Routes and Endpoints



## /users
POST : create a new user 
GET : Get all list of users

## /users/{id}

GET: get a user by id
PUT: Update a user by id
DELETE: Delete a user by id (check if he/she has an issued book) (is there any fine to be paid)

# /users/subscription-detail/{id}
GET: get user subscription details
1. Date of subscription
2. valid till 3
3. Fine if any 

## /books

GET: get all books
POST: Create/Add a new book

## /books/{id}
GET : Get abook by id
PUT : Update a book by id

## /books/issued/books
GET : get all issued books

## /books/issued/withFine
GET :  all issued books with fine

# subscription types
Basic (3 months)
Standard (6 months)
Premium  (12 months)
NOTE : dates will be in format mm/dd/yyyy

If the subscription date is 01/10/21
and subscription type is Standard
the valid till date will be 01/02/23

If he has an issued book and the issued book is to be returned at 01/01/23
and he missed the date of return, then he gets a fine of Rs. 100

If he has an issued book and the issued book is to be returned at 01/01/23
If he missed the date of return, and his subscription also expires he will get a fine of Rs. 200


