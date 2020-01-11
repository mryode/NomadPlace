# TODOs

## Things I need to do before moving on to the next step :construction:

### Global TODOs

[:construction:] Use WebPack

- Bundled .js files

[ ] Prevent CSRF/XSS/DOS
[ ] Sanitize FORM submissions
[ ] Create access control (isLoggedIn / attach permissions code to user)

### Step 1 - Environment Setup

[:white_check_mark:] Setting ESLint and Prettier

1.  Install `npm i -D babel-eslint eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-html eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks prettier`
2.  Setup `.eslintrc`

[:white_check_mark:] Setup project structure - **MVC**

1.  Run `npx express-generator`
2.  Add `controllers` and `models` directories

[:white_check_mark:] Make start.js script

[:white_check_mark:] Setup sass directory for .scss files

1.  Create `sass` directory
2.  Use `node-sass-middleware`
3.  Configure `sassMiddleware`
4.  Link the output `style.css` in `layout.pug`

## Step 2 - Layout Setup

[:white_check_mark:] Pick a logo

[Logo source]()

[:white_check_mark:] Modify `layout.pug`

4 Sections created:

1.  Header
2.  Messages
3.  Content
4.  Scripts

[:white_check_mark:] Pick color palettes

1.  [Palette #1](https://colorhunt.co/palette/166114)
2.  [Palette #2](https://www.schemecolor.com/aladdin-genie-blue-color-scheme.php)

## Step 3 - Create header

[:white_check_mark:] Create and style navbar

Icons:
a. [Places]
b. [Tags](https://www.flaticon.com/free-icon/hashtag_1827975?term=hashtag&page=1&position=5)
c. [Top](https://www.flaticon.com/free-icon/top-three_2282603?term=top&page=1&position=16)
d. [Add](https://www.flaticon.com/free-icon/plus-sign-in-circle_16909?term=add&page=1&position=17)
e. [Map]

Main colors:
a. \#efefef
b. \#303030
c. \#f5dea3
d. \#1d80c3
e. \#42e6a4
f. \#02a8a8
g. \#018383

## Step 4 - Create Home, Add Place and Places pages

[:white_check_mark:] Create Place model

1. name
2. description
3. slug
4. tags
5. photo
6. created

[:white_check_mark:] Create routes

1. GET / - Home page
2. GET /add - Add place
3. POST /add - Submit addition
4. GET /places - Display places

[:white_check_mark:] Implement controller at `placeController`

[:white_check_mark:] Create `.pug` files to render

## Step 5 - Users register, login and forgot password

[:white_check_mark:] Create User model

1. email
2. name
3. resetPasswordToken
4. resetPasswordExpires
5. created
6. hash - added using passport
7. salt - added using passport

[:white_check_mark:] Configure Passport.js

1. Choose strategy - passport-local-mongoose
2. Add the passport plugin to your mongoose model
3. Configure passport-local (serialize and deserialize User)
4. Setup passport middleware in your express app

[:white_check_mark:] Create routes

Authentication:

1. **/login**
   -- GET display login form
   -- POST submit login
2. **/register**
   -- GET display register form
   -- POST submit register
3. **/logout**
   -- GET logout user

Account:

1. **/account**
   -- GET display account page
   -- POST submit changes
2. **/account/forgot**
   -- POST submit email to reset password
3. **/account/reset/:token**
   -- GET display reset password form
   -- POST submit form - reset password and login

[:white_check_mark:] Implement controller at `placeController`, `userController` and `authController`

- `userController` - account information and operations
- `authController` - login, logout and reset password

[:white_check_mark:] Send mail

Used `nodemailer`

[:white_check_mark:] Create `.pug` files to render

- `account.pug` - display account info for update
- `_forgotForm.pug` - display forgot form
- `reset.pug` - display reset form
- `email/*` - email message
- Modified `_placeCard.pug` - add edit action on place that the logged in user created.

## Step 6 - Place info and edit pages

[:white_check_mark:] Create routes

1. Place page given place id
   -- GET **/place/:slug**

2. Edit place given place id
   -- GET **/places/:id/edit**
   -- POST **/add/:id** - reuse route

[:white_check_mark:] Register to API services

1. [Algolia Place.js](www.algolia.com) - Places auto complete
2. [Mapbox](https://www.mapbox.com/maps/) - Map support (static and dynamic)

[:white_check_mark:] Add `location` to Place model

[:white_check_mark:] Implement controllers

1. Enable place address autocomplete in add/edit place pages
   -- Add Webpack to bundle all `.js` files
   -- Create autocomplete module
2. Create static map according to the place's location

[:white_check_mark:] Create .pug files

1. `place.pug` - render static map and place details
2. `editPlace.pug` - modify enctype, fix photo upload support
