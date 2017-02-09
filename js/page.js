$(document).ready(function(){     
	
	function SpriteTimer ( ) {
		var time_start = Date.now();
		var time_stop = Date.now();
		var time_elapsed = 0;
		this.get_time_elapsed = function(){
			return this.time_elapsed;
		};
	    this.startTimer = function() {
	        this.time_start = Date.now();
	    };
	    this.stopTimer = function() {
	        this.time_stop = Date.now();
	        this.time_elapsed = this.time_stop - this.time_start;
	    };
	    this.frameIncrementer = function(fps) {
			this.time_start = this.time_stop - (this.time_elapsed % (1000/fps));//1000/fps is frame interval
	    };
	}
	
	function my_sprite(sprite_src, sprite_class){
		// var sprite_image = new Image();
		// sprite_image.src = sprite_src;
		var div_ratio =[$(sprite_class).width()/$(sprite_class).parent().width(), $(sprite_class).height()/$(sprite_class).parent().height()];
		$(sprite_class).width(Math.round($(sprite_class).parent().width()*div_ratio[0]));
		$(sprite_class).height(Math.round($(sprite_class).parent().height()*div_ratio[1]));
		var sprite_height_unit = $(sprite_class).height();
		var sprite_width_unit = $(sprite_class).width();
		var self = this;
		var sprite_timer = new SpriteTimer();
		var sprite_src = sprite_src;
		var sprite_class = sprite_class;
		var frame_counter = 0;
		var x_total = 0;
		var y_total = 0;
		var x_current = 0;
		var y_current = 0;
		var frame_animation = null;
		var animation_names = new Map();
		var current_animation;
		
		this.sprite_init = function(x_tot, y_tot, x_init, y_init) {
			x_init = (typeof x_init !== 'undefined') ?  x_init : 0;
			y_init = (typeof y_init !== 'undefined') ?  y_init : 0;
			x_total = (typeof x_tot !== 'undefined') ?  x_tot : 0;
			y_total = (typeof y_tot !== 'undefined') ?  y_tot : 0;
			// sprite_height_unit =  Math.floor(sprite_image.height/y_tot);
			// sprite_width_unit =  Math.floor(sprite_image.width/x_tot);
			$(sprite_class).css({
				'background-image': 'url("'+ sprite_src + '")',
				'background-size': x_total*100+'% '+ y_total*100 + '%',
				'background-position': x_init*sprite_width_unit+'px '+ y_init*sprite_height_unit + 'px'
			});
		};
		
		this.add_animation = function(animation_name, frms, fpss, repeats){
			var frames = (typeof frms !== 'undefined') ?  frms : [1];
			var fps = (typeof fpss !== 'undefined') ?  fpss : 8;
			var repeat = (typeof repeats !== 'undefined') ?  repeats : 0;
			var animation = {frame: frames, fps:fps, repeat:repeat};
			animation_names.set(animation_name, animation);
		};
		
		this.sprite_mover = function(animation_name){
			if(!animation_names.has(animation_name)){
				console.log('invalid animation name:' + animation_name);
				return true;
			}
			current_animation = animation_names.get(animation_name);
			sprite_timer.startTimer();
			frame_changer();
		};
		this.sprite_stopper = function(){
			cancelAnimationFrame(frame_animation);
			frame_counter = 0;
		};
		this.set_frame = function( frame_index ){
			cancelAnimationFrame(frame_animation);
			frame_counter = 0;
			x_current = (frame_index)%x_total;
			y_current = Math.floor(frame_index/x_total);
			$(sprite_class).css({
				'background-position': x_current*sprite_width_unit +'px '+ y_current*sprite_height_unit + 'px'
			});
		};
		function frame_changer(){
			frame_animation = requestAnimationFrame(frame_changer);
			sprite_timer.stopTimer(); 
			if (sprite_timer.get_time_elapsed() > 1000/current_animation.fps){
				sprite_timer.frameIncrementer(current_animation.fps);
				x_current = (current_animation.frame[frame_counter])%x_total;
				y_current = Math.floor(current_animation.frame[(frame_counter)]/x_total);
				$(sprite_class).css({
					'background-position': x_current*sprite_width_unit+'px '+ y_current*sprite_height_unit + 'px'
				});
				if(!current_animation.repeat&&frame_counter>current_animation.frame.length-1){
					cancelAnimationFrame(frame_animation);
				}
				if(frame_counter>current_animation.frame.length-1){
					frame_counter = 0;
				} else{
					frame_counter++;
				}
			}
		};
		$(window).resize(function(){
			$(sprite_class).width(Math.round($(sprite_class).parent().width()*div_ratio[0]));
			$(sprite_class).height(Math.round($(sprite_class).parent().height()*div_ratio[1]));
			sprite_height_unit = $(sprite_class).height();
			sprite_width_unit = $(sprite_class).width();
		});
	}
	
	var my_sprite = new my_sprite("heater.png" , '.elephant_sprite');
	my_sprite.sprite_init(4, 1);
	my_sprite.add_animation('walk',[1,2,3] , 15, 1);
	my_sprite.add_animation('moonwalk',[1,6,5,4,3,2] , 15, 1);
	
	// // my_sprite.new_animation('walk',[1,2] , 5, 1);
	my_sprite.sprite_mover('walk');
// 	 
	// setTimeout(function(){
		// my_sprite.sprite_stopper();
	// }, 3000);
	// setTimeout(function(){
		// my_sprite.sprite_mover('moonwalk');
	// }, 6000);
	// setTimeout(function(){
		// my_sprite.set_frame(5);
	// }, 8000);
	$(window).resize(function(){
			console.log('resize1');
		});


// sprite_init( , 6, 1 , 3, 0);
});	