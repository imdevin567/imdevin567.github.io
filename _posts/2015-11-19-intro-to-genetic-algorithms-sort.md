---
layout: post
title: Intro to Genetic Algorithms - Implementing a Sort
categories: [algorithms]
tags: [genetic algorithms, sort, ruby]
description: TODO Write a description for this post.
---

Two things have been on my mind a lot lately: sorting algorithms and [genetic algorithms](https://en.wikipedia.org/wiki/Genetic_algorithm). They've actually been on my mind for two completely different reasons. At [Topgolf](http://topgolf.com), we've been interviewing candidates to join our software engineering team. In hopes of finding the best candidates, we started a new process (new for us, definitely not new in general): a live coding challenge. Sparing you all the boring details, one of the challenges we used was having the candidate sort a list without actually using a built-in sort method. This proved to be very helpful in watching how the mind solves a problem like that.

As far as genetic algorithms go, I have been reading a lot on [artificial intelligence](https://en.wikipedia.org/wiki/Artificial_intelligence) lately. I have always been fancinated by AI. Recently a buddy of mine brought up genetic algorithms and it really peaked my interest. However, I had a difficult time actually grasping the concept at the beginning.

## What exactly is a genetic algorithm?
Genetic algorithms don't really have anything to do with genetics specifically. You can use them to solve many problems outside the realm of genetics. The reason they are called genetic algorithms is due to their behavior. A GA (I got tired of typing *genetic algorithm*) mimics the process of evolution in nature by implementing ideas such as *crossover* and *mutation*. These additional qualities make GAs more effective than trial and error through randomization. If you're confused, don't worry, I was too.

# A Genetic Sorting Algorithm in Ruby
Since I had both sorting and genetic algorithms on my mind, I thought to myself: ***What if I created a genetic algorithm to solve the sorting challenge we give our interview candidates?*** So I did. And I'm going to walk you through exactly how I did it in hopes that it will help you understand genetic algorithms a little more.

*A quick note before we get started here. This is an **extremely** inefficient way to sort a list. I cannot stress this enough. If you do this in an interview, you will probably not get the job because your interviewers will think you're crazy. There's also a possibility they will appreciate how you took a different direction. But in all honesty, you should probably not plan to use this in practice.*

## The Problem Set
To start out, we're going to sort a list of 5 integers from 1 to 5. Obviously we don't need any kind of a computer algorithm to actually sort this list, but it's a small sample that will let us test. The list looks like this:

{% highlight ruby %}
"1,2,3,4,5"
{% endhighlight %}

Now, let's start coding!

## The Individual
First we're going to start with the individual. In a genetic algorithm, an individual is **a single data set in a population.** Just like in biology, an individual contains a genome, which is the data that will be crossed with other individuals during crossover. In our case, a genome will be an array of the integers in our list, in random order. For example, a genome may look like:

{% highlight ruby %}
[2, 4, 5, 1, 3]
{% endhighlight %}

Let's create a class for our individual that will hold this data for us.

{% highlight ruby %}
# Contains attributes for a single individual in a population
class Individual

  # The genome for the individual. In this case, a random array with the values from the input
  attr_accessor :genome

  def initialize(genome = [])
    @genome = genome
  end
end
{% endhighlight %}

We start with a very basic class with one property: the genome. We require this to be set during initialization so we don't have any individuals without a genome!

### Fitness
The most important part of a genetic algorithm is the fitness function. **An individual's fitness is a calculation of how strong the data is in relation to the given problem.** This could be represented in many different ways. For example, your problem may involve finding the best driving path between several locations. In that case, the fitness would be the total mileage of the drive.

So why is it called fitness? Well, remember "survival of the fittest"? It's the same concept here. The "fittest" individual is the one that produces the best result for our problem. After considering that, how would you determine the fitness for our sorting problem? You could come up with a few ways to calculate it, but to keep it simple I determined the fitness to be **the number of digits sorted correctly in the genome.** If we use our genome example from above, you can see the first three digits are already sorted: 2, 4, and 5. The fourth digit is not in order, so the fitness score would be 3. To keep it even simpler, we will always start with the first digit. So with the following genome:

{% highlight ruby %}
[5, 1, 2, 3, 4]
{% endhighlight %}

The fitness score would be 1. Even though digits 2 through 5 are sorted properly, it makes our function much simpler to always start at one. So let's write out this fitness function.

{% highlight ruby %}
# Calculates the fitness score for the individual.
# This calculates how close the individual is to being sorted by starting
# from the beginning and removing all values in front that are not in order.
def fitness
  fitness_check = []
  self.genome.each do |gene|
    # Add the first element to the check, and every subsequent element that is in order.
    if fitness_check.empty? || gene > fitness_check.last
      fitness_check.push(gene)
    end
  end

  # Fitness is the length of the check, which is the number of digits in order from the genome.
  return fitness_check.length
end
{% endhighlight %}

Our final Individual class should look like this:

{% highlight ruby %}
# Contains attributes for a single individual in a population
class Individual

  # The genome for the individual. In this case, a random array with the values from the input
  attr_accessor :genome

  def initialize(genome = [])
    @genome = genome
  end

  # Calculates the fitness score for the individual.
  # This calculates how close the individual is to being sorted by starting
  # from the beginning and removing all values in front that are not in order.
  def fitness
    fitness_check = []
    self.genome.each do |gene|
      # Add the first element to the check, and every subsequent element that is in order.
      if fitness_check.empty? || gene > fitness_check.last
        fitness_check.push(gene)
      end
    end

    # Fitness is the length of the check, which is the number of digits in order from the genome.
    return fitness_check.length
  end
end
{% endhighlight %}

## The Population
A population is a group of individuals, just like biology. In our case, the population will simply be an array of individuals. Let's stub out a class for this.

{% highlight ruby %}
# Contains attributes for a population of individuals
class Population
  # The array of individuals
  attr_accessor :individuals

  def initialize
    @individuals = []
  end

  # Adds an individual to the population
  def add(individual)
    @individuals.push(individual)
  end
end
{% endhighlight %}

This looks very similar to the beginning of our Individual class. We also add an *add* method that lets us insert a new individual into the population. This will come in handy later on.

One other thing we will need from the population is the ability to find the individual with the highest fitness score. This will let us know if we have solved our problem or, at the very least, advance them to the next generation.

{% highlight ruby %}
# Finds the individual with the highest fitness.
# If there is a tie, the first one found is used.
def best_individual
  best_fitness = 0
  best_indv = nil
  @individuals.each do |individual|
    if individual.fitness > best_fitness
      best_fitness = individual.fitness
      best_indv = individual
    end
  end

  return best_indv
end
{% endhighlight %}

This method loops over the individuals in the population and returns the individual with the highest fitness. Our final Population class should look like this:

{% highlight ruby %}
# Contains attributes for a population of individuals
class Population
  # The array of individuals
  attr_accessor :individuals

  def initialize
    @individuals = []
  end

  # Adds an individual to the population
  def add(individual)
    @individuals.push(individual)
  end

  # Finds the individual with the highest fitness.
  # If there is a tie, the first one found is used.
  def best_individual
    best_fitness = 0
    best_indv = nil
    @individuals.each do |individual|
      if individual.fitness > best_fitness
        best_fitness = individual.fitness
        best_indv = individual
      end
    end

    return best_indv
  end
end
{% endhighlight %}

## The Algorithm
Now for the fun part! We're going to write an Algorithm class with four methods:

- *evolve*: Evolves the population using *crossover* and *mutation*
- *crossover*: Merges the genes of two individuals
- *mutate*: Randomly swaps two genes in an individual
- *run*: Runs the algorithm

### Crossover
There are different ways of handling crossover, so we need to pick a method that will work best for our scenario. For this problem, we are going to use **ordered crossover**. In this method we select a subset from the first parent, and then add that subset to the offspring. Any missing values are then added to the offspring from the second parent in the order that they are found. Let's consider this example:

##### Parents

||1|||2|||3|||4|||5|||**6**|||**7**|||**8**|||9||

||9|||8|||7|||6|||5|||4|||3|||2|||1||

##### Offspring

||**9**|||**5**|||**4**|||**3**|||**2**|||6|||7|||8|||**1**||

Here, a subset of the first parent is chosen (6,7,8) and merged with the second parent. **The starting index of the subset remains the same**. The remaining values are then filled in with the remaining unique genes from the second parent in the order they appear. i.e. 9 is the first digit, then 5 is the second digit before 8, 7, and 6 already exist in the offspring's genome.

Let's write out this method.

{% highlight ruby %}
# Creates offspring from two individuals
def self.crossover(father, mother, start_index, end_index)
  # A subset of the father based on the start and end indices
  sperm = father[start_index..end_index]

  # Remove the duplicate genes from the mother
  fetus = mother - sperm

  # The offspring is the result of the two parents' genes merging together.
  # It is key that the subset remains at the same index. The remaining genes
  # are filled in by the mothers' genes.
  baby = fetus[0..(start_index - 1)] + sperm
  baby = baby + fetus[start_index..(fetus.length - 1)] if baby.length < father.length
  return Individual.new(baby)
end
{% endhighlight %}

That might look confusing at first, so be sure to read the comments. Ruby has a lot of syntactic sugar with arrays, so it may look strange if you aren't familiar with it. Once you get past the syntax, you will notice that this code is representative of the crossover method mentioned above.

### Mutate
Next we're going to focus on mutation. Mutation is based on a rate that determines the probability a genome will mutate. There isn't a standard rate that needs to be used, so you can use as high or low a rate as you would like. However, I would recommend a very low rate to avoid randomizing the data too much. So how is mutation performed? In our situation, we consider a mutation to be **swapping two random genes in a genome**. Using the offspring from the example above:

##### Before Mutation

||9|||5|||**4**|||3|||2|||6|||7|||8|||**1**||

##### After Mutation

||9|||5|||**1**|||3|||2|||6|||7|||8|||**4**||

You can see where this can become an issue if the mutation rate is too high! Let's go ahead and implement this method.

{% highlight ruby %}
# Mutates the population based on a given rate. 0 is no mutation, while 1 is 100% mutation.
def self.mutate(population, rate)
  population.individuals.map! { |individual|
    # Since rand() creates a random float between 0 and 1, the probability that rand()
    # will be less than the rate is equal to the rate itself.
    if rand() < rate
      # Fun Ruby trick to grab two random indices from an array.
      # Create an array from a range of 0 to the length - 1, then shuffle.
      # The first two elements in the new array are your two random indices.
      swap_indices = (0..(individual.genome.length - 1)).to_a.shuffle

      # Swap the genes at the indices determined above.
      individual.genome[swap_indices[0]], individual.genome[swap_indices[1]] = individual.genome[swap_indices[1]], individual.genome[swap_indices[0]]
    end
    individual
  }

  return population
end
{% endhighlight %}

Like the *crossover* method, there is some syntactic sugar here so be sure to read the comments in the code.

### Evolve
After implementing the *crossover* and *mutate* methods, the *evolve* method is pretty straightforward. The concept of evolution in a genetic algorithms involves four steps:

- Create a new population. This is the *next generation*.
- Copy the *fittest* individual to the new population. This is representative of *survival of the fittest*.
- Perform *crossover* on the population by mating the individuals.
- *Mutate* a percentage of the population based on the *mutation rate*.

The trickiest part of the evolution process is determining *which individuals mate with each other*. There are many ways you could do this. You could randomize which individuals mate. Maybe the fittest individual is a stud and all other individuals mate with it. To keep things simple, we're going to crossover *sequentially*. In other words, *individual 1* mates with *individual 2*. *Individual 2* mates with *individual 3*. And so on. To keep our population from growing in size, *the last individual does not mate with the first individual*. That will give us *population_size - 1* offspring. And since we moved our fittest individual on to the next population, that will keep our size the same.

{% highlight ruby %}
# Evolves the population. This creates a new population by moving the individual with the
# highest fitness score to the new population and mating the individuals from the old population
# in sequential order. i.e. 1 mates with 2, 2 mates with 3, 3 mates with 4, etc.
def self.evolve(population, mutation_rate)
  new_population = Population.new

  # Keep the individual with the highest fitness
  new_population.add(population.best_individual)

  population.individuals.each_with_index do |individual, i|
    # Find a random crossover start point
    start_at = rand(0..(individual.genome.length - 1))

    # Find a random crossover end point
    stop_at = rand(start_at..(individual.genome.length - 1))

    # Create offspring with the next individual in the population, unless this is the last individual.
    baby = self.crossover(individual.genome, population.individuals[i + 1].genome, start_at, stop_at) unless i == (population.individuals.length - 1)

    # Add the offspring to the population unless there is none (the last individual)
    new_population.add(baby) unless baby.nil?
  end
{% endhighlight %}

This method should be fairly straightforward since it primarily just calls the methods we have already implemented. If you are stuck, I would recommend re-reading the sections on *crossover* and *mutation*.

### Run
Finally! The method we call that will actually *run* our algorithm. The first thing to note is that we will need a few parameters: the population size, the mutation rate, and the actual data we want to use for our genomes. With that in mind, our *run* method should do a few things:

- Transform our initial data into an array (since we are providing the data as a string)
- Create a random population for the first generation
- Continuously evolve the population until the fittest individual contains the solution we need

We're going to log a few things as well so you can see the output as it's being run.

{% highlight ruby %}
# Actually runs the algorithm.
def self.run(input, population_size, mutation_rate)
  # Create an array of integers from a comma-delimited string
  gene_array = input.split(",").map { |i| i.to_i }

  # Create a new random population
  population = Population.new
  population.random_population(gene_array, population_size)

  # Start at generation 1. This will increase by 1 each time the population evolves.
  generation = 1

  # Continue to evolve the population until we found our solution (the best fitness is equal to the length of the genome)
  while population.best_individual.fitness < gene_array.length
    p "Generation: #{generation}"
    population = self.evolve(population, mutation_rate)
    p "Best fitness: #{population.best_individual.fitness}"
    puts "\n"
    generation = generation + 1
  end

  # Output the solution to verify it worked
  p "Solution found!"
  p population.best_individual
end
{% endhighlight %}

The output here will allow you to see the number of generations it takes to compute the solution. The final Algorithm class should look like this:

{% highlight ruby %}
# Main algorithm class
class Algorithm
  # Evolves the population. This creates a new population by moving the individual with the
  # highest fitness score to the new population and mating the individuals from the old population
  # in sequential order. i.e. 1 mates with 2, 2 mates with 3, 3 mates with 4, etc.
  def self.evolve(population, mutation_rate)
    new_population = Population.new

    # Keep the individual with the highest fitness
    new_population.add(population.best_individual)

    population.individuals.each_with_index do |individual, i|
      # Find a random crossover start point
      start_at = rand(0..(individual.genome.length - 1))

      # Find a random crossover end point
      stop_at = rand(start_at..(individual.genome.length - 1))

      # Create offspring with the next individual in the population, unless this is the last individual.
      baby = self.crossover(individual.genome, population.individuals[i + 1].genome, start_at, stop_at) unless i == (population.individuals.length - 1)

      # Add the offspring to the population unless there is none (the last individual)
      new_population.add(baby) unless baby.nil?
    end

    # Mutate the population before finishing
    return mutate(new_population, mutation_rate)
  end

  # Creates offspring from two individuals
  def self.crossover(father, mother, start_index, end_index)
    # A subset of the father based on the start and end indices
    sperm = father[start_index..end_index]

    # Remove the duplicate genes from the mother
    fetus = mother - sperm

    # The offspring is the result of the two parents' genes merging together.
    # It is key that the subset remains at the same index. The remaining genes
    # are filled in by the mothers' genes.
    baby = fetus[0..(start_index - 1)] + sperm
    baby = baby + fetus[start_index..(fetus.length - 1)] if baby.length < father.length
    return Individual.new(baby)
  end

  # Mutates the population based on a given rate. 0 is no mutation, while 1 is 100% mutation.
  def self.mutate(population, rate)
    population.individuals.map! { |individual|
      # Since rand() creates a random float between 0 and 1, the probability that rand()
      # will be less than the rate is equal to the rate itself.
      if rand() < rate
        # Fun Ruby trick to grab two random indices from an array.
        # Create an array from a range of 0 to the length - 1, then shuffle.
        # The first two elements in the new array are your two random indices.
        swap_indices = (0..(individual.genome.length - 1)).to_a.shuffle

        # Swap the genes at the indices determined above.
        individual.genome[swap_indices[0]], individual.genome[swap_indices[1]] = individual.genome[swap_indices[1]], individual.genome[swap_indices[0]]
      end
      individual
    }

    return population
  end

  # Actually runs the algorithm.
  def self.run(input, population_size, mutation_rate)
    # Create an array of integers from a comma-delimited string
    gene_array = input.split(",").map { |i| i.to_i }

    # Create a new random population
    population = Population.new
    population.random_population(gene_array, population_size)

    # Start at generation 1. This will increase by 1 each time the population evolves.
    generation = 1

    # Continue to evolve the population until we found our solution (the best fitness is equal to the length of the genome)
    while population.best_individual.fitness < gene_array.length
      p "Generation: #{generation}"
      population = self.evolve(population, mutation_rate)
      p "Best fitness: #{population.best_individual.fitness}"
      puts "\n"
      generation = generation + 1
    end

    # Output the solution to verify it worked
    p "Solution found!"
    p population.best_individual
  end
end
{% endhighlight %}

To run our algorithm, you just need to provide the required parameters and call the *run* method:

{% highlight ruby %}
input = "1,2,3,4,5"
population_size = 10
mutation_rate = 0.005
Algorithm.run(input, population_size, mutation_rate)
{% endhighlight %}

# Results
Results are *highly* dependent on the size of the input data and the size of the population. A small data sample and a high population size will increase the chance of finding the solution faster. This is not necessarily due to the genetic algorithm, but probability in general. For example, with a sample size of three digits, a population size of ten will have a very high probability of containing the right solution *on the initial random generation*. (*Note: This is not how probability works. Regardless of your population size, you would have a 1:6 chance of randomly generating the right solution. If you flip a coin 10 times and it lands on heads ALL 10 times, your probability of it landing on heads again is **still** 1:2. But the Law of Averages states that this is unlikely to happen.*) So how do the results actually look? I graphed a few different test cases to highlight the number of generations it took to solve the sort. All cases started with the number 1; i.e. a sample size of 5 looked like *"1,2,3,4,5"* and a sample size of 10 looked like *"1,2,3,4,5,6,7,8,9,10"*.

![Sample size of 5, Population size of 10](https://dl.dropboxusercontent.com/u/281059208/sample5-pop10.png)

![Sample size of 5, Population size of 20](https://dl.dropboxusercontent.com/u/281059208/sample5-pop20.png)

![Sample size of 10, Population size of 100](https://dl.dropboxusercontent.com/u/281059208/sample10-pop100.png)

![Sample size of 10, Population size of 1000](https://dl.dropboxusercontent.com/u/281059208/sample10-pop1000.png)

As you can see, a larger population was able to solve the problem faster. It's worth noting that the problem was solved faster in terms of *number of generations*. As far as raw speed goes, this algorithm is ***slow*** as the sample size and population size increase. On the last test, with the sample size of 10 and population size of 1000, it took an average of ***6 seconds*** to solve. For just ten numbers! So there you have it, the most *inefficient* way to get a job at Topgolf!

While this certainly isn't an efficient sorting algorithm, I hope you learned something along the way. Genetic algorithms can be used to solve a variety of problems and this is just an introduction to writing them. If there is any interest, I will write a follow-up post highlighting a real-life problem that can be solved with a genetic algorithm. If you are interested in seeing the full code for this post, you can find it at [github.com/imdevin567/genetic-sort](https://github.com/imdevin567/genetic-sort).
