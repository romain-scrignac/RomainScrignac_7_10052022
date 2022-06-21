# Installation

First install `mySQL` and `Node.js`

After this, run `npm install` to install node modules

# Generate a self-signed certificate for localhost (https)

Open your terminal or git bash and run the following command:

`openssl req -nodes -new -x509 -keyout server.key -out server.cert`

After running this command, we would get some options to fill. We can keep those options default or empty by entering ‘.‘ (dot). We would fill only two options for current as that would work fine for us.

`Common Name (e.g. server FQDN or your name): localhost`
`Email Address : *************@****** (enter your email)`

# Start API

Run `node server` or `nodemon server`
