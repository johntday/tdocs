## private directory

Meteor gathers any files under the private subdirectory and makes the contents of these files available to server code via the
[Assets](http://docs.meteor.com/#assets) API.  The private subdirectory is the place for any files that should be accessible to
server code but not served to the client, like private data files.

There are more assets to consider on the client side. Meteor gathers all JavaScript files in your tree, with the exception of the server,
public, and private subdirectories, for the client. It minifies this bundle and serves it to each new client. You're free to use a single
JavaScript file for your entire application, or create a nested tree of separate files, or anything in between.

