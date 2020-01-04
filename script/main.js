var offsetX;
var offsetY;

var Ticket = Vue.extend({
    template: '<div class=ticket @mousedown="onTicketGrasp" @mouseup="onTicketDrop">test</div>', 
    methods: {
        onTicketDrag: function(event) {
            var pageX = event.pageX;
            var pageY = event.pageY;        
            event.target.style.left = (pageX - offsetX) + 'px';
            event.target.style.top = (pageY - offsetY) + 'px';
        },
        onTicketDrop: function(event) {
            event.target.removeEventListener('mousemove', this.onTicketDrag, false);
            event.target.removeEventListener('mouseout', this.onTicketDrag, false);
        },
        onTicketGrasp: function(event) {
            offsetX = event.offsetX;
            offsetY = event.offsetY;
            event.target.addEventListener('mousemove', this.onTicketDrag, false);
            event.target.addEventListener('mouseout', this.onTicketDrag, false);
        }
    }
});

new Vue({
    el: '#app', 
    components: {
        'ticket': Ticket
    }
});

/**

var onButtonClick = function(event) {
    var newTicket = document.createElement('div');
    newTicket.className = 'ticket';
    newTicket.id = '123';
}

var button = document.querySelector('.createButton');

button.addEventListener('click', onButtonClick, false);
*/