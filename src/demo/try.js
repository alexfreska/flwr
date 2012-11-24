$(function ($) {
	window.AppView = Backbone.View.extend({
		  el: $("body"),
	  events: {
		      "click #add-friend":  "showPrompt",
	  },
	  showPrompt: function () {
					      var friend_name = prompt("Who is your friend?");
						    }
	});
	var appview = new AppView;
})(jQuery);
