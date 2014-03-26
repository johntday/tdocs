# tdocs

## Application Structure

### Meteor Info
Application in such a way that it is insensitive to the order in which files are loaded,
for example by using Meteor.startup, or by moving load order sensitive code into [packages](http://docs.meteor.com/#usingpackages),
which can explicitly control both the load order of their contents and their load order with respect to other packages.
However sometimes load order dependencies in your application are unavoidable.
The JavaScript and CSS files in an application are loaded according to these rules:

- Files in the `lib` directory at the root of your application are loaded first.
- Files that match `main.*` are loaded after everything else.
- Files in subdirectories are loaded before files in parent directories, so that files in the deepest subdirectory are loaded first (after `lib`),
and files in the root directory are loaded last (other than `main.*`).
- Within a directory, files are loaded in alphabetical order by filename.
- These rules stack, so that within lib, for example, files are still loaded in alphabetical order; and if there are multiple files named `main.js`,
the ones in subdirectories are loaded earlier.

### Notes


## Standards
### Prefixes
- **pubsub**: name of Meteor.publish and/or Meteor.subscribe
- **tmpl**: name of template
- **coll**: name of Collection

## Dependencies
 - **Raphael**: 2.1.2
 - **js-sequence-diagrams**: 1.0.4

## License

<pre>
Copyright 2014 Day Software, Inc.

Licensed under the Creative Commons 3.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at
<a href="http://creativecommons.org/licenses/by-nc-nd/3.0/" target="_blank">http://creativecommons.org/licenses/by-nc-nd/3.0/</a>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

For more information, please contact Day Software, Inc. at this
address:

<a href="mailto:johntday@gmail.com" target="_blank">johntday@gmail.com</a>
</pre>
