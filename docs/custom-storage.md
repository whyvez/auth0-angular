# Implementing your own Storage

By defalt, auth0-angular sues `ngCookies` to store all your user and token information. This uses client side cookies. If you'd prefer to use localStorage or any other storage service, you just need to implement the `authStorage` service with the following methods:

* **store(idToken, accessToken, state)**: This needs to store the 3 parameters somewhere
* **get()**: This needs to return an object with the `idToken`, `accessToken` and `state` fields
* **remove()**: This needs to remove from local storage all the token information.
