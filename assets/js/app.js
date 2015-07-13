$( document ).ready(function() {

	$.material.init();

	/* Sidebar height set */
	$('.sidebar').css('min-height',$(document).height());

	/* Secondary contact links */
	var scontacts = $('#contact-list-secondary');
	var contact_list = $('#contact-list');

	scontacts.hide();
	contact_list.mouseenter(function(){ scontacts.fadeIn(); });
	contact_list.mouseleave(function(){ scontacts.fadeOut(); });

	var bio = "My name is Devin Young. I am a Software Engineer based in Dallas, TX. I have three 🐕s and will soon be marrying a wonderful 👰. I like to golf ⛳️ and drink scotch; preferably Lagavulin. I'm disappointed there isn't a scotch emoji. ";
	var bio_div = document.getElementById('bio');
	new TuringType(bio_div, bio, { accuracy: 0.97, interval: 100 });

});
