// JavaScript Document
// Displays save time on the screen
// Written by Patrick Teague 10/20/12

var SaveDisplay = new Class({
	initialize: function(font){
		this.fontName = font;
		this.myText = "Not Saved";
		this.saveText = paper.print(0,0,this.myText, paper.getFont(this.fontName), 14).attr({'text-anchor': 'start', 'fill': '#FFFFFF',});
		this.saveText.translate(stage.innerWidth - this.saveText.getBBox().width - 10, 40 - this.saveText.getBBox().height - 10);
	},
	reposition: function(){
		var saveX = stage.innerWidth - this.saveText.getBBox().width -10;
		var saveY = 40 - this.saveText.getBBox().height - 10;
		this.saveText.translate( saveX - this.saveText.getBBox().x, saveY - this.saveText.getBBox().y-5);
	},
	updateSave: function(){
		var timeStamp = new Date();
		var hourStamp = timeStamp.getHours();
		var minuteStamp = timeStamp.getMinutes();
		var AM_PM;
		if(minuteStamp < 10)
			minuteStamp = "0" + minuteStamp;
		if(hourStamp > 11)
			AM_PM = "PM";
		else
			AM_PM = "AM";
		if(hourStamp > 12)
			hourStamp -= 12;
		if(hourStamp === 0)
			hourStamp = 12;
		this.saveText.remove();
		this.saveText = null;
		this.myText = "Saved: "+hourStamp+":"+minuteStamp+" "+AM_PM;
		this.saveText = paper.print(0,0, this.myText, paper.getFont(this.fontName), 14).attr({'text-anchor': 'start', 'fill': '#FFFFFF'});
		var saveX = stage.innerWidth - this.saveText.getBBox().width - 10;
		var saveY = 40 - this.saveText.getBBox().height - 10;
		this.saveText.translate(saveX, saveY);
	}
});