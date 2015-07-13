---
layout: post
title: php.suspected Hack
categories: [security]
tags: [security, hacking]
description: Are you finding *.php.suspected files on your web server? No, this is not an anti-virus software doing its job.
---

Recently I began getting strange errors on one of my PHP sites claiming that a file could not be found for a 'require'. When looking deeper into the issue, I noticed the file had actually been *renamed* to *filename*.php.suspected. ***What??***

As it turns out, this is happening to [a lot of people](https://wordpress.org/support/topic/link-templatephpsuspected). This is not just limited to Wordpress, but it appears Wordpress sites have been targeted more than others. Using the following grep command I found **over 25 malware files on the server**:

{% highlight bash %}
egrep -Rl '\$GLOBALS.*\\x|function.*for.*strlen.*isset|isset.*eval' /path/to/webserver
{% endhighlight %}

There were a few false positives, but I had a ~90% success rate with that command. I dug deeper and found the reason these hackers want the server--**spam mail**. A PHP mailer script was installed on the server and the hackers were POSTing to it to send (lovely) spam messages.

After shutting down the mail server and setting up a honeypot to trick the hackers, I halted their activities for the time being.

**Have you experienced this hack? If you need help resolving this issue on your site, [contact me today](mailto:devin@devinyoungweb.com).**
