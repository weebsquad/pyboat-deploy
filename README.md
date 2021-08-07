# pyboat-deploy

## Simple script to deploy PyBoat to a server with Pylon in it.

1. Clone the repo
2. Copy config.js.example -> config.js
3. Edit config.js and input the values
4. `npm test`

### How to get your Pylon token?
1. Go to https://pylon.bot/
2. Login to the site
3. Open DevTools on your browser (Chrome is CTRL+SHIFT+I)
4. Go to the "Console" tab
5. Copy paste the following script to the console and hit enter:
```js
console.log(`Your Pylon Token is: \n\n${localStorage.getItem('token')}\n\n`)
```
6. Copy the output valuee



**NOTES**

This will only work if the deployment for the guild you input already exists, __make sure to deploy anything to your server on the Pylon dashboard before using this script__

Feel free to use this script to deploy other things.


## PyBoat Source Repo:
https://github.com/weebsquad/pyboat
