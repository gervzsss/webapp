1. Create a directory
   mkdir webapp
   cd webapp
   npm init -y

2. Install packages
   npm install bootstrap
   npm install -D postcss postcss-cli autoprefixer postcss-import

3. Create postcss.config.js
   module.exports = {
   plugins: {
   'postcss-import': {},
   autoprefixer: {}
   }
   }

4. Create styles.css
   @import "bootstrap/dist/css/bootstrap.min.css";

5. Add this in package.json
   "scripts": {
   "build:css": "postcss styles.css -o dist/styles.css",
   "watch:css": "postcss styles.css -o dist/styles.css --watch"
   }
