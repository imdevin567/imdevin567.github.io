---
layout: post
title: Google+ Sign-in with Ruby on Rails
categories: [ruby on rails]
tags: [ruby, rails, api, google+]
description: Google+ is improving every day, leading to more developers creating apps with support for the social network. Recently there seems to be a build-up of hype regarding the Google+ API. Google's documentation is not bad, but since authentication is performed on the client side, there isn't much support for how to integrate this into the back-end of an application. This tutorial shows the way I use Google+ to authenticate users in Ruby on Rails.
---

Google+ is improving every day, leading to more developers creating apps with support for the social network. Recently there seems to be a build-up of hype regarding the Google+ API. [Google's documentation is not bad](https://developers.google.com/+/), but since authentication is performed on the client side, there isn't much support for how to integrate this into the back-end of an application. This tutorial shows the way I use Google+ to authenticate users in Ruby on Rails.


## The Setup

I am using [Ruby 1.9.3](http://www.ruby-lang.org/en/) with [Rails 3.2.11](http://rubyonrails.org/) on [Ubuntu 12.04](http://www.ubuntu.com/). This assumes basic knowledge of ROR and Javascript. Start by creating a new rails app called "googlePlusApp":

{% highlight bash %}
rails new googlePlusApp
{% endhighlight %}

Don't forget to run `bundle install` to install your gems! Next, generate a resource called "user". This will create a controller, model, and views folder to handle the module. Default routes will also be added in the routes config file. We're going to pass a few parameters to this command as well:

{% highlight bash %}
rails generate resource user name gplus
{% endhighlight %}

This command will **generate** a **resource **called "**user**" with parameters called "**name**" and "**gplus**". This will create a database schema for us: a table called "users" with columns "id", "name", and "gplus". We can then create this database by running:

{% highlight bash %}
rake db:migrate
{% endhighlight %}

Congratulations! You just created the skeleton for our app!


## The Model

We'll begin our code in the model. Open up /googlePlusApp/app/models/users.rb and insert this code:

{% highlight ruby %}
attr_accessible :gplus, :name
validates :name, :presence => true
validates :gplus, :uniqueness => true, :presence => true
{% endhighlight %}

Even with minimal Ruby knowledge, this block of code is pretty easy to understand. Our accessible attributes are "name" and "gplus". We validate the presence of "name" and "gplus", as well as validate the uniqueness of "gplus". This is to be sure that a Google+ user does not authenticate themselves more than once. Just like that, our model is done!


## The View

Next, we're going to move on to the view to work on the client-side validation. Create a file in /googlePlusApp/app/views/users and name it "login.html.erb". First, we're going to want to add a Google+ sign-in button. [According to the Google+ API manual](https://developers.google.com/+/web/signin/#step_3_adding_a_button_to_your_page), we can do that with this code:

{% highlight html %}
<span id="signinButton">
  <span
    class="g-signin"
    data-callback="signinCallback"
    data-clientid="CLIENT_ID"
    data-cookiepolicy="single_host_origin"
    data-scope="https://www.googleapis.com/auth/plus.login">
  </span>
</span>
{% endhighlight %}

Where "CLIENT_ID" is the client ID you are given when registering your app through the [Google API console](https://code.google.com/apis/console). Notice the callback function named "signinCallback"? This will allow us to get the profile data from Google via ajax after the button is clicked and the user has authorized. Before doing this, we need to create a form with hidden fields to send over to our controller later:

{% highlight erb %}
<%= form_tag(:controller => "users", :action => "new", :method => "post") do %>
  <%= hidden_field_tag :fullname %>
  <%= hidden_field_tag :gplus %>
<% end %>
{% endhighlight %}

"is-this-you" will be used to display the user's name and image after we get the data via ajax. In order to do this, let's include the Google+ API at the top of our page.

{% highlight html %}
<script type="text/javascript">
    (function() {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/client:plusone.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
</script>
{% endhighlight %}

Now it's time to write our callback function "signinCallback". Let's go ahead and add the whole function first inside our script tags, then I'll explain the details:

{% highlight js %}
function signinCallback(authResult) {
  var token = gapi.auth.getToken();
  var accessToken = token.access_token;
  if (authResult['access_token']) {
    var accessUrl = 'https://www.googleapis.com/plus/v1/people/me?access_token=' + accessToken;
    $.ajax({
      type: 'GET',
      url: accessUrl,
      async: false,
      contentType: 'application/json',
      dataType: 'jsonp',
      success: function(data) {
        var originalImage = data.image.url;
        var imageUrl = originalImage.slice(0, -2);
        var gplusImage = imageUrl + "200";
        $('#fullname').val(data.displayName);
        $('#gplus').val(data.id);
        $('.is-this-you').html("<h3>Is this you?</h3><img src='" + gplusImage + "'><br><h4>" + data.displayName + "</h4><br><input type='submit' value='Login or Register'>");
      },
      error: function(e) {
        console.log(e);
      }
    });
  } else if (authResult['error']) {
    $('.is-this-you').html("<h4>Your request could not be completed at this time</h4>");
  };
}
{% endhighlight %}

There's a lot going on here! Let's go through it step by step.

{% highlight js %}
function signinCallback(authResult) {
  var token = gapi.auth.getToken();
  var accessToken = token.access_token;
{% endhighlight %}

Here we define our access token variable. This is a temporary token that is needed in the authorization URL.

{% highlight js %}
if (authResult['access_token']) {
  var accessUrl = 'https://www.googleapis.com/plus/v1/people/me?access_token=' + accessToken;
{% endhighlight %}

If we are successful in getting our access token, we begin our main callback function. We also define the authorization URL given by Google with the addition of our access token at the end.

{% highlight js %}
$.ajax({
  type: 'GET',
  url: accessUrl,
  async: false,
  contentType: 'application/json',
  dataType: 'jsonp',
{% endhighlight %}

This starts our ajax request to get the profile data from Google. This is a typical "GET" HTTP request at the URL we defined previously. This returns a JSON object.

{% highlight js %}
success: function(data) {
  var originalImage = data.image.url;
  var imageUrl = originalImage.slice(0, -2);
  var gplusImage = imageUrl + "200";
{% endhighlight %}

This starts our success function if the ajax request is successful. This part here may seem a bit confusing. When Google+ returns the profile image, they specify a size of 50px (it's a square image). This is noted by the "?sz=50" at the end of the image URL. To make the image a little bit larger, I slice the last two characters of the URL and replace it with "200". This will give our image a size of 200px so it is easier to see.

{% highlight js %}
  $('#fullname').val(data.displayName);
  $('#gplus').val(data.id);
  $('.is-this-you').html("<h3>Is this you?</h3><img src='" + gplusImage + "'><br><h4>" + data.displayName + "</h4><br><input type='submit' value='Login or Register'>");
},
error: function(e) {
  console.log(e);
}
{% endhighlight %}

This is the end of our success function, but the most important part! Here we fill the hidden fields we created earlier with profile data. The "fullname" field is populated with the user's display name and the "gplus" field is populated with the user's profile ID. For added spice and security, we also display the user's name and profile image inside the "is-this-you" div so they can double check that they are signing in with the right profile! Finally, if the ajax request is unsuccessful, we log an error message in the console.

{% highlight js %}
} else if (authResult['error']) {
  $('.is-this-you').html("<h4>Your request could not be completed at this time</h4>");
}
{% endhighlight %}

The end of our callback function that displays an error message on the page if Google+ authentication fails. This is all you need on the client side--now it's time to validate this data in the back-end of our app.

## The Controller

Head on over to /googlePlusApp/app/controllers/users_controller.rb. We’re going to need a few methods here. First:

{% highlight ruby %}
def login
end
{% endhighlight %}

This is a simple method defining “login” that will allow us to open a login view.

{% highlight ruby %}
def new
  user = User.find_by_gplus(params[:gplus])
  if user
    redirect_to root_url, notice: "You are already registered!"
  else
    @fullname = params[:fullname]
    @gplusId = params[:gplus]
    u = User.new(:name => params[:fullname], :gplus => params[:gplus])
    u.save
    redirect_to root_url, notice: "User with name #{@fullname} and Google+ ID #{@gplusId} has been successfully registered!"
  end
end
{% endhighlight %}

This method does multiple things. First, it checks if the user already exists in our system. We try to find the user by their Google+ ID. If there is already a user registered with the specified Google+ ID, the page redirects to the root URL and shows a notice telling the user they have already registered. If the user doesn’t exist in our system, it creates a new user. It fills in the fields in our database with the user’s name and Google+ ID that we sent over from the login form. Once the user is saved, the page redirects to the root URL and shows a notice telling the user they have been successfully registered with their name and ID displayed.

And there you have it! This is a very simple authentication system using the Google+ API for Ruby on Rails. The profile ID acts as the user’s password in this sense–since our system can only log in users after they have validated on the client side through Google+, we can skip the usual username/password login. Of course, extra security should be considered if you are planning to launch a live application!

Feel free to leave a comment if you have any questions or suggestions!
