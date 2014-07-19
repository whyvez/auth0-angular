# Html5 Mode on auth0-angular

This shows how to use html5mode with Auth0-angular.

There's a bug with ngRoute, so the response with the accessToken which is `http://yoururl.com/#id_token` gets rewritten and the hash is removed: `http://yoururl.com/id_token`, so we need to implement a work around for this.
