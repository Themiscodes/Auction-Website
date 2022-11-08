# Auction Point

Auction Point is a website where users can buy and sell items. My aim with this Full Stack project was the design and development of an online auction platform, similar to eBay. The implementation follows a REST-api architecture and some of the key features are:

- **Secure Authorisation and Authentication**
- **Role-based Access Control**
- **Mail Client within the Application** 
- **Recommendations using Matrix Factorisation**

### Technologies
A Javascript stack was used for easier and faster deployment, comprised of **Express** and **Node.js** for the back-end, **MySQL** for the database and **React** for the front-end. A different relational database can also be used since the data modeling, associations and queries are handled with object-relational mapping using **Sequelize**.

![l (3)](https://user-images.githubusercontent.com/73662635/200635580-4c026c13-12cf-45b7-85cb-4ac30a77d22f.png)

## Requirements & Setup
### Back-end
1. For the back-end MySQL or a similar relational database is required as well as the installation of [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

2. In the [config.json](api/config/config.json) file add your personal MySQL settings. 

3. To install express, cors and other necessary modules, in the [api](api/) folder run: `npm install`

4. To connect sequelize to the database, run the command: `sequelize init`

5. The transactions are encrypted through the SSL/TLS protocol. To create the certificate locally you can use `mkcert` and then add the path in:

```js
const sslServer = https.createServer({
    key: fs.readFileSync('/yourpath/key.pem'),
    cert: fs.readFileSync('/yourpath/cert.pem')
}, app);
```
- When the server starts with a "clean" database, the tables are automatically created based on the object-oriented models defined in [models](api/models/).
- Also, a user with the administrator role is automatically created with the username: admin and initial password: 1234, which can be changed.
- Nodemon is also set up, so that the server automatically restarts every time the code of back-end is changed, while the server is running.

To start up the server simply run in the [api](api/) directory: 

```
npm start
```

### Front-end
For the front-end all the necessary dependencies are defined in the `package.json` file. To install them simply run in the [front](front/) directory: `npm install`

To start up the front-end in the [front](front/) directory run: 

```
npm start
```

## Design

For the design of the application I used pure CSS and a few Material UI components. A few animations were added for the page transitions, as well as the editing page. For the titles and main elements I used Futura, which is a simple and timeless typeface, while for the body and details I used Roboto and other similar Sans-Serif fonts.

### Welcome Page

<img width="1512" alt="site" src="https://user-images.githubusercontent.com/73662635/200633778-6dbf1679-2d50-4e8d-a62b-4ecf8b2e433b.png">

The site's welcome page is rather simple, aiming to get the new visitors interested in entering the site. There is only a login button and a brief summary of the services provided, so that they're not overwhelmed with information.

### Auctions
<img width="1512" alt="Screenshot 5" src="https://user-images.githubusercontent.com/73662635/200637869-5e10eaa3-123c-40d9-b31b-d59ce29cd48d.png">

From the Auctions page the user can browse the listings by category, search or filter. The categories have a hierarchical structure, which was achieved in MySQL by using a self referencing foreign key and by building the tree on both the front-end and the back-end recursively when needed.

### Auction Page

![loc3](https://user-images.githubusercontent.com/73662635/200637954-649235f9-b5de-4f19-8873-49ab1f40c3e2.png)

The auction page has all the details of an item and depending if a buyer or the seller is viewing it, they are presented with different options. The photos are displayed in a carousel and for the photo upload I used the **Multer** api in the back-end. To display the location I used **OpenStreetMap** and **leaflet**. The user can add the exact location by dropping a pin or by searching. I designed a polaroid-like container for the map as can been seen in the screenshot above, where the coordinates are displayed in the DMS format.

### Login & Registration

![l(1)](https://user-images.githubusercontent.com/73662635/200635962-fb11ea13-2612-4b86-86e3-89e40ae56a1d.png)

For the registration fields, as well as the other forms of the website, I used **yup** to perform the schema validation in combination with the **formik** library. The user's password is stored in the database hashed using the **bcrypt** function, which is based on the blowfish cipher.

### Profile

<img width="1512" alt="Scr2" src="https://user-images.githubusercontent.com/73662635/200641590-d7d6e328-0d6a-4cfa-b666-2925e167d9db.png">

On the profile page, a buyer can see all the available items of a seller. A similar dashboard page is provided for each user, where items are also recommended to them. The recommendation system uses the Matrix Factorisation algorithm, while the data for it are gathered while the users are visiting an auction or bidding on it.

### Mail

![messages](https://user-images.githubusercontent.com/73662635/200645707-3bf565d2-fad0-463d-84d5-19143286a3d9.png)

Aside from inbox, outbox and the ability to send a new message, in the mail client there is also a messaging interface. There aside from the messages, the buyer can rate a seller when an item has arrived and the seller respectively can rate a buyer when they have completed the payment.

### Admin
![admin](https://user-images.githubusercontent.com/73662635/200645652-01baa2d1-acd0-43db-aeaa-885327d56ed4.png)

When logged in the administrator can approve user applications, as well as export the auction details in XML, JSON or CSV format following the ebay DTD template. Also, to populate the database and train the recommender algorithm, I used real data from the eBay website in XML format provided by [UCLA](http://web.cs.ucla.edu/classes/winter15/cs144/projects/index.html).

## Built with
- [Express](https://expressjs.com)
- [Node.js](https://nodejs.org/en/)
- [MySQL](https://www.mysql.com)
- [Sequelize](https://sequelize.org)
- [React](https://reactjs.org)
