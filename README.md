# JS bundle size
Github action for comparing javascript bundle size.
See if your build size changed significantly as a github-actions comment
on a pull request (or commit).

![How to use JSBundle Size action](https://i.imgur.com/koKtvty.gif)

![github actions bot comment bundle size](https://i.imgur.com/GhElRd1.png)

## Usage:

Checkout [example.yml](./example.yml)

A user makes a pull request with an unknowingly bad change:

![Example of a code diff.](pr1.png)

Get a comment warning of a possible increase in your build size on the pull request:

![Example of a comment on a pull request](pr2.png)

## License
The scripts and documentation in this project are released under the [MIT License](./LICENSE)
