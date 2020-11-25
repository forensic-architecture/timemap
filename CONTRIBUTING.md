# Contributing to TimeMap

Hi there! Thank you already, for taking the time to try and contribute and
improve timemap. This document is the place to start on your journey. Read it
thoroughly!

## What do I need to know to help?
### Javascript / React / Redux
In order to contribute code upstream, you'll likely need to have a sense of ES6
Javascript, React, and Redux. If these terms are new to you, or not as familiar
as you might like, here's a good tutorial to get you up to speed:

- [Building a voting app with Redux and React](https://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html)

### Node JS and Docker
Timemap doesn't actually use these technologies; but the main way of getting up
and running with a data provider for timemap,
[datasheet-server](https://github.com/forensic-architecture/datasheet-server),
does, and so they're helpful to know.

## Do I need to be an experienced JS developer? 
Contributing can of course be about contributing code, but it can also take
many other forms. A great amount of work that remains to be done to make
timemap a usable community tool doesn't involve writing a line of code. The
following are all very welcome contributions:

- Updating or correcting documentation
- Fixing an open issue
- Requesting a feature
- Reporting a bug

If you're new to this project, you could check the issues that are tagged ["good first issue"](https://github.com/forensic-architecture/timemap/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22). These are generally those that are considered easy ways in.

## How do I make a contribution? 

1. Make sure you have a [GitHub account](https://github.com/signup/free)
2. Fork the repository on GitHub. This is necessary so that you can push your
    changes, as you can't do this directly on our repo.

3. Get set up with a local instance of timemap and datasheet-server. The easiest
    way to do this is by reading [this blog post on our website](https://forensic-architecture.org/investigation/timemap-for-cartographic-platforms).
4. [Join our Discord server](https://discord.gg/PjHKHJD5KX). Here you'll be able
    to track commits that are actively being made across our projects; but more
    importantly it's where you can ask questions if something's not clear or
    not working as you expect. The #timemap and #support channels are the two
    best places to ask questions about setting timemap up.

Once you're set up with a local copy of timemap and datasheet-server, you can
start modifying code and making changes. 

When you're ready to submit a contribution, you can do it by making a pull
request from a branch on your forked copy of timemap to this repository. You
can do this with the following steps:
1. Push the changes to a remote repository. If the changes you have made
   address a bug, you should name it `bug/{briefdesc}`, where `{briefdesc}` is
   a hyphen-separated description of your change. If instead you are
   contributing changes as a feature request, name it `feature/{briefdesc`}. If
   in doubt, prefix your branch with `feature/`.
2. Submit a pull request to the `develop` branch of `forensic-architecture/timemap`.
3. Wait for the pull request to be reviewed by a maintainer.
4. Make changes to the pull request if the reviewing maintainer recommends
   them.
5. Celebrate your success once your pull request is merged!

## How do I validate my changes?
We are still working on a set of tests. Right now, it is enough to confirm that
the application runs as expected with `npm run dev`. If your changes introduce
other issues, a maintainer will flag it in stage 3 of the submission process
above.

## Credits 
This contributing guide is based on the guidelines of both the 
[SuperCollider contributing guide](https://raw.githubusercontent.com/supercollider/supercollider/develop/CONTRIBUTING.md),
and the [nteract contributing
guide](https://github.com/nteract/nteract/blob/master/CONTRIBUTING.md) (two
excellent open source projects!).

Thanks to [Scott Carver](https://github.com/scztt) for advice on how to put
a guide together.
