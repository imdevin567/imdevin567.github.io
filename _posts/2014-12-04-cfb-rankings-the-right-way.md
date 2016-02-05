---
layout: post
title: College Football Rankings - The Right Way
categories: [random]
tags: [football, rankings, python, data science]
description: College football is way too subjective. How do we fix it? With raw stats and a bit of code.
---

***Updated on 12-7-2014 to reflect conference championship games and slightly modified formula.***

***After getting WAY more viewership than I expected, I decided to post the scripts on GitHub. You can find the project [here](https://github.com/imdevin567/cfb-rankings).***

I might be a nerd, but I'm a big sports fan too. This is both nerdy and sporty, so bear with me here.

As we near the end of the 2014 college football season, it's becoming incredibly apparent just how subjective the new [CFB playoff ranking system](http://espn.go.com/college-football/rankings/_/poll/21) really is. While the old BCS system wasn't perfect, it at least gave a *fairly* unbiased ranking of the best teams in the nation. People have agendas--computers do not. The people programming those computers might, but what if we only looked at the things that really mattered?

Naturally as a sports fanatic and a guy that knows a thing or two about programming, I sought to find a fix to this madness. I first came up with a basic system that would calculate the best teams in the country. The system has only two criteria for the ratings: win/loss quality and strength of schedule. **EDIT: The formula was recently modified to iterate through the rankings one time to give a better indicator of win/loss quality.**

## Win/Loss Quality
- The base value of a home win is 1 and the base value of a road loss is -1.
- The point differential of the game ***up to 28 points*** is added to a win and subtracted from a loss, with the value of each point being 0.01.
- A road win is awarded an additional touchdown (0.07) and a home loss is penalized by an additional touchdown (0.07).
- The resulting value is multiplied by the opponents' winning percentage for a win or multiplied by the inverse of the opponents' winning percentage for a loss.
- Non-FBS teams' winning percentages are cut in half (effectively making a 12-0 Div II team equivalent to a 6-6 FBS team).
- The final win/loss quality rating of a team is their average win/loss quality normalized on a scale of 0 to 1.

Let's start with an example. Early in the season, [Arizona](http://espn.go.com/college-football/team/_/id/12/arizona-wildcats) beat [Oregon](http://espn.go.com/college-football/team/_/id/2483/oregon-ducks) 31-24 on the road. To calculate the quality of Arizona's win:

- 1 point for a win
- 0.07 points for point differential
- 0.07 additional points for a road win
- 1.14 * 0.917 (Oregon's winning percentage) = 1.045

This win against the Ducks gets a rating of 1.045 for Arizona, which happened to be the 4th best win out of any team in the nation this season. Arizona is rewarded for beating a good team on the road. On the flip side, you can calculate the cost of this loss for Oregon:

- -1 points for a loss
- -0.07 points for point differential
- -0.07 additional points for a home loss
- -1.14 * 0.1667 (inverse of Arizona's winning percentage) = -0.19

As you can see, while Arizona was rewarded greatly for winning this game, Oregon was not highly penalized for losing (rated about 600th on the list of losses) against a good Arizona team.

A few notes on win/loss quality:

- Conferences are not taken into account whatsoever. This means beating a 10-2 Boise State team at home by 7 points is equivalent to beating a 10-2 Michigan State team at home by 7. I believe this is a **good** thing. Conference bias is subjective--on-the-field play is not.
- Point differential is capped at 28 points to prevent teams being ranked highly solely for blowouts.
- The final win/loss quality is the average of **all** win/loss qualities for the team normalized on a scale of 0 to 1. This ensures consistent play throughout a season in order to be ranked highly.
- Win/loss quality is **95%** of the final rating. This is mainly because it inheritly takes into account strength of opponent.

## Strength of Schedule
A team's strength of schedule is essentially the **average win/loss quality of their opponents**. This accounts for a small portion of the final ranking (5%), mainly to use as a tiebreaker between teams with similar win/loss qualities. After the iteration, strength of schedule counts for an additional 1%. The strength of schedule seen in the rankings is essentially the **average rating of their opponents**.

## Iteration
After the calculation of rankings is complete, win/loss qualities are *recalculated* using the final rating vs. the opponents' winning percentage. This gives a slightly more accurate view of win/loss quality. In the final iteration, strength of schedule counts for only 1% of the final rating (totaling roughly 6% of the final rating including the previous round of calculations).

### Alright, enough numbers. Show me the rankings!!!
Ok, ok. Some of these are obvious, some not so much. It was interesting to take a look at these teams after the numbers ran and see what my subjective opinion was.

Ladies and gents, your 2014 College Football Rankings:

| **Rank** | **Team**                | **Record** | **Win Quality** | **SOS** | **Final Rating** |
|----------|-------------------------|------------|-----------------|---------|------------------|
| 1        | ***Alabama***           | 12-1       | 1.000           | 0.639   | ***0.996***      |
| 2        | ***Florida State***     | 13-0       | 0.997           | 0.583   | ***0.993***      |
| 3        | ***Ohio State***        | 12-1       | 0.993           | 0.570   | ***0.988***      |
| 4        | ***Oregon***            | 12-1       | 0.972           | 0.588   | ***0.968***      |
| 5        | ***Ole Miss***          | 9-3        | 0.884           | 0.684   | ***0.882***      |
| 6        | ***TCU***               | 11-1       | 0.885           | 0.523   | ***0.881***      |
| 7        | ***Mississippi State*** | 10-2       | 0.865           | 0.594   | ***0.863***      |
| 8        | ***Boise State***       | 11-2       | 0.865           | 0.530   | ***0.862***      |
| 9        | ***Baylor***            | 10-2       | 0.855           | 0.490   | ***0.852***      |
| 10       | ***UCLA***              | 9-3        | 0.854           | 0.640   | ***0.852***      |
| 11       | ***Michigan State***    | 10-2       | 0.841           | 0.550   | ***0.839***      |
| 12       | ***Georgia Tech***      | 10-3       | 0.832           | 0.602   | ***0.829***      |
| 13       | ***Arizona***           | 10-3       | 0.820           | 0.587   | ***0.818***      |
| 14       | ***Missouri***          | 10-3       | 0.809           | 0.592   | ***0.807***      |
| 15       | ***Wisconsin***         | 10-3       | 0.808           | 0.574   | ***0.806***      |
| 16       | ***Auburn***            | 8-4        | 0.803           | 0.692   | ***0.802***      |
| 17       | ***Georgia***           | 9-3        | 0.801           | 0.586   | ***0.799***      |
| 18       | ***Marshall***          | 12-1       | 0.797           | 0.384   | ***0.793***      |
| 19       | ***Kansas State***      | 9-3        | 0.771           | 0.575   | ***0.769***      |
| 20       | ***Clemson***           | 9-3        | 0.761           | 0.569   | ***0.759***      |
| 21       | ***Arizona State***     | 9-3        | 0.758           | 0.573   | ***0.756***      |
| 22       | ***Louisville***        | 9-3        | 0.754           | 0.546   | ***0.752***      |
| 23       | ***Nebraska***          | 9-3        | 0.754           | 0.546   | ***0.752***      |
| 24       | ***Colorado State***    | 10-2       | 0.734           | 0.449   | ***0.731***      |
| 25       | ***USC***               | 8-4        | 0.731           | 0.580   | ***0.729***      |

## Some Stats
Here are some interesting stats after running these rankings:

- The SEC benefits greatly from strength of schedule. Ole Miss is ranked much higher here than in the current CFB rankings, primarily due to their very high strength of schedule and wins against two top 10 opponents.
- Boise State is ranked **significantly** higher here than they are in the current CFB rankings.
- Baylor is ranked much lower than TCU here than in the current CFB rankings. This is mainly due to quality of loss. Baylor has the more impressive win over TCU, but a worse loss against West Virginia.

## Final Thoughts
Obviously this brought to light some of the flaws with the current subjective ranking system. Florida State ranks #2 in this system (#1 last week), only behind Alabama because of win/loss quality.

At the same time, this system also highlights some of the successes of the CFB committee. Many have claimed [Baylor should be ranked ahead of TCU](http://www.nola.com/lsu/index.ssf/2014/12/should_tcu_be_ranked_above_bay.html) due to their same record with Baylor winning the head-to-head matchup. This shows that while TCU has dominated their fairly weak schedule, Baylor has not dominated their even *weaker* schedule. TCU also has a close loss against a good team, whereas Baylor has a worse loss against West Virginia. **EDIT: Baylor is now ranked above TCU in the final CFB rankings because the Big 12 couldn't make up their mind on a conference champion.**

I hope this generates some buzz, otherwise why bother? Let me know your thoughts below if you feel so inclined.  As for the tech part of this, all scripts were written in Python and data was grabbed from [NCAA.com](http://ncaa.com) using HTML parsing. If there is enough interest, I might post the project on GitHub. **EDIT: I posted the project on [GitHub](https://github.com/imdevin567/cfb-rankings).**
