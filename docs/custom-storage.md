# Implementing your own Storage

By defalt, auth0-angular uses `localStorage` if available and otherwise it uses `ngCookies` to store all your user and token information. If you'd prefer to use localStorage or any other storage service, you just need to implement the `authStorage` service with the following methods:

* **store(idToken, accessToken, state, refreshToken)**: This needs to store the 4 parameters somewhere
* **get()**: This needs to return an object with the `idToken`, `accessToken`, `state` and `refreshToken` fields
* **remove()**: This needs to remove from local storage all the token information.
