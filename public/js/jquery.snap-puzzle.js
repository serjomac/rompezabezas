/*
	jQuery snapPuzzle v1.0.0
    Copyright (c) 2014 Hans Braxmeier / Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/jQuery-snapPuzzle
	License: http://www.opensource.org/licenses/mit-license.php
*/

(function($){
    $.fn.snapPuzzle = function(options){
        var o = $.extend({ pile: '', containment: 'document', rows: 5, columns: 5, onComplete: function(){} }, options);
            
        // public methods
        if (typeof options == 'string') {
            this.each(function(){
                var that = $(this),
                    o = that.data('options'),
                    pieceWidth = that.width() / o.columns,
                    pieceHeight = that.height() / o.rows,
                    pile = $(o.pile),
                    maxX = pile.width() - pieceWidth,
                    maxY = pile.height() - pieceHeight,
                    puzzle_offset = that.closest('span').offset(),
                    pile_offset = pile.offset();

                if (options == 'destroy') {
                    $('.'+o.puzzle_class).remove();
                    that.unwrap().removeData('options');
                    pile.removeClass('snappuzzle-pile');
                } else if (options == 'refresh') {
                    $('.snappuzzle-slot.'+o.puzzle_class).each(function(){
                        var x_y = $(this).data('pos').split('_'), x = x_y[0], y = x_y[1];
                        $(this).css({
                            width: pieceWidth,
                            height: pieceHeight,
                            left: y*pieceWidth,
                            top: x*pieceHeight
                        });
                    });
                    $('.snappuzzle-piece.'+o.puzzle_class).each(function(){
                        if ($(this).data('slot')) {
                            // placed on slot
                            var x_y = $(this).data('slot').split('_'), slot_x = x_y[0], slot_y = x_y[1],
                                x_y = $(this).data('pos').split('_'), pos_x = x_y[0], pos_y = x_y[1];;
                            $(this).css({
                                width: pieceWidth,
                                height: pieceHeight,
                                left: slot_y*pieceWidth+puzzle_offset.left-pile_offset.left,
                                top: slot_x*pieceHeight+puzzle_offset.top-pile_offset.top,
                                backgroundPosition: (-pos_y*pieceWidth)+'px '+(-pos_x*pieceHeight)+'px',
                                backgroundSize: that.width()
                            });
                        } else {
                            // placed anywhere else
                            var x_y = $(this).data('pos').split('_'), x = x_y[0], y = x_y[1];
                            $(this).css({
                                width: pieceWidth,
                                height: pieceHeight,
                                left: Math.floor((Math.random()*(maxX+1))),
                                top: Math.floor((Math.random()*(maxY+1))),
                                backgroundPosition: (-y*pieceWidth)+'px '+(-x*pieceHeight)+'px',
                                backgroundSize: that.width()
                            });
                        }
                    });
                }
            });
            return this;
        }

        function init(that){
            var puzzle_class = 'sp_'+new Date().getTime(),
                puzzle = that.wrap('<span class="snappuzzle-wrap"/>').closest('span'),
                src = that.attr('src'),
                pieceWidth = that.width() / o.columns,
                pieceHeight = that.height() / o.rows,
                pile = $(o.pile).addClass('snappuzzle-pile'),
                maxX = pile.width() - pieceWidth,
                maxY = pile.height() - pieceHeight;

            o.puzzle_class = puzzle_class;
            that.data('options', o);

            //$("#intentos").text(((o.rows * o.columns)+4));
            $("#intentos").html("<h1>"+((o.rows * o.columns)+4)+"</h1>");

            for (var x=0; x<o.rows; x++) {
                for (var y=0; y<o.columns; y++) {
                    $('<div class="snappuzzle-piece '+puzzle_class+'"/>').data('pos', x+'_'+y).css({
                        width: pieceWidth,
                        height: pieceHeight,
                        position: 'absolute',
                        left: Math.floor((Math.random()*(maxX+1))),
                        top: Math.floor((Math.random()*(maxY+1))),
                        zIndex: Math.floor((Math.random()*10)+1),
                        backgroundImage: 'url('+src+')',
                        backgroundPosition: (-y*pieceWidth)+'px '+(-x*pieceHeight)+'px',
                        backgroundSize: that.width()
                    }).draggable({
                        start: function(e, ui){ 
                            
                            let inte = localStorage.getItem("intentos")
                            inte++;
                            localStorage.setItem("intentos", inte)
                            console.log("INTENTOS", inte);

                            //$("#intentos").text(((o.rows * o.columns)+4-inte));
                            $("#intentos").html("<h1>"+((o.rows * o.columns)+4-inte)+"</h1>");

                            if (inte === ((o.rows * o.columns)+4)){
                                alert("PERDISTE");
                                window.location = '/seleccionrompecabeza';
                            }
                            $(this).removeData('slot'); },
                        stack: '.snappuzzle-piece',
                        containment: o.containment
                    }).appendTo(pile).data('lastSlot', pile);

                    $('<div class="snappuzzle-slot '+puzzle_class+'"/>').data('pos', x+'_'+y).css({
                        width: pieceWidth,
                        height: pieceHeight,
                        left: y*pieceWidth,
                        top: x*pieceHeight
                    }).appendTo(puzzle).droppable({
                        accept: '.'+puzzle_class,
                        hoverClass: 'snappuzzle-slot-hover',
                        drop: function(e, ui){
                            var slot_pos = $(this).data('pos');
                            console.log("SLOT POS " + slot_pos);
                            // prevent dropping multiple pieces on one slot
                            $('.snappuzzle-piece.'+puzzle_class).each(function(){
                                if ($(this).data('slot') == slot_pos) slot_pos = false;
                            });
                            if (!slot_pos) return false;

                            ui.draggable.data('lastSlot', $(this)).data('slot', slot_pos);
                            ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
                            if (ui.draggable.data('pos')==slot_pos) {
                                ui.draggable.addClass('correct');
                                // fix piece
                                // $(this).droppable('disable').fadeIn().fadeOut();
                                $(this).droppable('disable').css('opacity', 1).fadeOut(1000);
                                ui.draggable.css({opacity: 0, cursor: 'default'}).draggable('disable');
                                //if ($('.snappuzzle-piece.correct.'+puzzle_class).length == o.rows*o.columns) o.onComplete(that);
                                if ($('.snappuzzle-piece.correct.'+puzzle_class).length == o.rows*o.columns)
                                    {
                                        o.onComplete(that);
                                        var reicinarIntentos = 0;
                                        localStorage.setItem("intentos", reicinarIntentos)
                                        let url = window.origin;
                                        $.post( url+"/seleccionrompecabeza/puntos/"+localStorage.getItem("usuario"), function( data ) {

                                            //console.log(data)
                                            //$("#puntaje").html("<p>"+data.user.puntaje+"</p>");
                                
                                        });
                                        //alert("Ganaste");
                                        //window.location = '/seleccionrompecabeza';
                                    }
                            }
                        }
                    });
                }
            }
        }

        return this.each(function(){
            if (this.complete) init($(this));
            else $(this).load(function(){ init($(this)); });
        });
    };
}(jQuery));
