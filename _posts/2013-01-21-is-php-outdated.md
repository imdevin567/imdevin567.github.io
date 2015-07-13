---
layout: post
title: Is PHP Outdated?
categories: [programming languages]
tags: [php, node.js, python]
description: Like many web developers, PHP was the first dynamic language I learned to code. Looking back, it makes perfect sense. Virtually every hosting service, including many free providers, are PHP-enabled. I was able to get a free web hosting account, log into the dashboard to setup a MySQL database, and learn PHP the old-fashioned way--trial and error. I was able to do everything I needed to with PHP. Why fix what isn't broken?
---

Like many web developers, PHP was the first dynamic language I learned to code. Looking back, it makes perfect sense. Virtually every hosting service, including many free providers, are PHP-enabled. I was able to get a free web hosting account, log into the dashboard to setup a MySQL database, and learn PHP the old-fashioned way--trial and error. I was able to do everything I needed to with PHP. Why fix what isn't broken?

Once I began using MVC frameworks such as [Codeigniter](http://ellislab.com/codeigniter), I was able to do even **more** with PHP; and in shorter amounts of time! However, something was missing. If I can get the job done well AND efficiently with PHP, why do I constantly feel the need to try other dynamic back-end languages?

The fact is, PHP feels a bit outdated. Python (more specifically,[ Django](https://www.djangoproject.com/)) introduced me to built-in web servers. Rather than configure the local Apache server to run the code the way I need it to, I could simply type `python manage.py runserver` into the terminal and view my site on port 8000. [PHP 5.4 has actually introduced this feature](http://php.net/manual/en/features.commandline.webserver.php), but most frameworks have yet to implement a simple process for this.

I've recently begun using [Node.js](http://nodejs.org/) and I must say--I finally feel like I am using the most cutting-edge technologies available at my disposal. I am not a native javascript developer, but nowadays it is nearly impossible to get a decent website up and running without javascript. It only makes sense to write the back-end of your site in javascript as well.

[Node Package Manager](https://npmjs.org/) makes it incredibly easy to add dependencies to your project. Gone are the days of downloading jQuery plugins one-by-one and moving them to your public directory. [Need a templating language for your app?](https://github.com/joyent/node/wiki/modules#wiki-templating) Look for one in the NPM directory, add it to your JSON file as a dependency, and run `npm install` in your app's directory.

[Bower by Twitter](http://twitter.github.com/bower/), though still feeling a bit beta, shows the future of package management for front-end assets. A JSON file is all it takes to declare dependencies such as [jQuery](http://jquery.org/),[ Bootstrap](http://twitter.github.com/bootstrap/), and [AngularJS](http://angularjs.org/). Run `bower install` and your packages are conveniently stored in the components directory.

2013 sounds like a big year for PHP. With [Laravel](http://laravel.com/) being the new go-to MVC framework for many PHP developers and [Composer introducing package management](http://getcomposer.org/), PHP is making some huge strides. But how long will that last before Python/Ruby introduce a new feature that PHP lacks?

Only time will tell. For now, I will continue using PHP for most of my static sites. As for web apps? Node.js seems to be the direction to head in.

