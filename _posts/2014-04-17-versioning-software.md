---
layout: post
title: Versioning Software
categories: [software engineering]
tags: [software, version, opinions]
description: I recently have gotten into a few extensive (heated?) discussions regarding versioning software/applications. It really seems like a trivial task compared to actually coding the app--I mean, as long as the code works and you have a way to update code and rollback code if needed, who cares what your versioning standards are, right?
---

I recently have gotten into a few extensive (heated?) discussions regarding versioning software/applications. It really seems like a trivial task compared to actually coding the app--I mean, as long as the code works and you have a way to update code and rollback code if needed, who cares what your versioning standards are, right?

## Bad Versioning Standards

Before discussing a few good ways to version your software projects, let's first look at a few, um, not so good ways.

#### The Too-Many-Octets Method

Followers of this method will commonly version releases like:

- 1.0.4.2
- 1.5.0.0
- 2.0.0.1

In my eyes, any more than 3 octets and it looks sloppy. Including a patch number or build number is fairly common nowadays but they should not be included as another octet.

#### The Too-Few-Octets Method

The opposite of the culprit above. Using too few octets does one of two things: leaves little room for bug fixes, or lies to your users about how frequently you are actually updating. Windows is a great example of this. Windows has lately been following the pattern of one octet (with the exception of the recent Windows 8.1) for every release. Bug fixes? Well, they just automatically update, so why bother incrementing a version? Because as a user, I have no idea if my system is out of date!

Examples of this method:

- Windows 7
- Windows 8
- Windows 9 (eventually, right?)


#### The Afraid-to-Increment-the-Major-Version method

I see this one quite frequently. An application has frequent updates, commonly increments the micro octet (3rd octet) for minor bug fixes, and every so often increments the minor octet (2nd) when they feel enough has been changed to justify doing so. Then 25 minor versions later, you're downloading v1.25.0.

Followers of this method will usually say *"We need to make a big change to come out with version 2.0!"*

If you are releasing frequently enough to reach 25 minor versions, the problem may not be that you haven't made a big enough change to increment the major version--it may just be that your perception of what constitutes a major release may be off for that application. No two apps are creates equally; a major version for app A may be much larger than a major version for app B.

## So What's Good?

This is all my opinion so please take it with a grain of salt. That being said, I believe these ideas can work well for most applications if given enough thought.

#### Octets
I follow a general rule with octets: use 3. If you release very infrequently like say, an operating system, then you may be able to get away with 2. Don't use 1, and please don't use more than 3.

#### Max Numbers
With the exception of the major octet (1st), no octet **should ever reach the teens.** This means anything 12 or under is usable, but never higher. Why 12? Perhaps it's just me, but the psychological gap between the numbers 12 and 13 is much greater than any two succeeding numbers before them, including 9 and 10. (I would actually like to see some sort of a study on this. Does anyone have a reference to a number psychology study?)

#### Padded Zeroes
Padded zeroes are a matter of personal preference in my eyes. Since you have read this far and understand this is all my opinion: I hate padded zeroes. Version 1.02.009 may give you the freedom to eventually move up to version 1.13.126 while still being able to sort in your Excel spreadsheet, there are many plugins out there nowadays that can successfully sort version numbers and tell you that 1.5.0 comes before 1.12.0. If you are using Ruby, my personal favorite is the [Versionomy gem](http://dazuma.github.io/versionomy/).

#### Octet Meanings
Assuming we are sticking with 3 octets, here are the meanings I generally use when versioning my apps:

- **Major Version:** This is the 1st octet in any versioning scheme. It is also the most flexible number and methods of incrementation are different for every app. If it's different for every app, how do you know when to actually increment it? In my opinion this is completely dependent on the *proportion* of the release in regards to the others. If you are releasing minor versions with a few bug fixes and occasionally a new feature, then a major release should constitute at least a couple new features. As mentioned above, non-major octets should remain 12 and below--so if you are coming close to version 1.13.0, you may want to consider throwing out a major release! One final thought, major UI changes should ***always*** be a major release. Do not tell your user you have a small change then change the look of the app. Be proud of UI changes enough to bump your app to the next major version.
- **Minor Version:** This octet usually comes immediately after the major version number; generally 2nd. Minor versions can be tricky--are bug fixes worth a minor version or should you just stick to a micro version? How do you know when you're releasing too much to be considered a minor release? A good rule here is that a minor version constitutes **a few changes that will be noticed by your users**. Only releasing a fix for one bug? Not a minor release. Releasing a code reformat to abstract your backend a little more? Not a minor release. If the user cannot see it, it's not important enough to bump up a minor version. Usually a few bug fixes and a small new feature are worthy of a minor release.
- **Micro Version:** This final octet is one that I generally increment when there is a **minor change that does not change the usability or look of the application.** Bug fixes, security patches, and minor code reorganization will generally fall into this category.

## Conclusion
Versioning is opinionated, much like I am. As mentioned earlier, these are my personal opinions regarding how a company/individual could version their applications. Regardless of the standard you use, the most important rule is that **you have a standard.** Any standard (even a poor one!) is better than no standard.

Agree? Disagree? Thoughts? Leave a comment and let me know!
