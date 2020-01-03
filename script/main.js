var offsetX;
var offsetY;

var onTicketDrag = function(event) {
    var pageX = event.pageX;
    var pageY = event.pageY;

    event.target.style.left = (pageX - offsetX) + 'px';
    event.target.style.top = (pageY - offsetY) + 'px';
}

var onTicketDrop = function(event) {
    event.target.removeEventListener('mousemove', onTicketDrag, false);
    event.target.removeEventListener('mouseout', onTicketDrag, false);
}

var onTicketGrasp = function(event) {
    offsetX = event.offsetX;
    offsetY = event.offsetY;
    event.target.addEventListener('mousemove', onTicketDrag, false);
    event.target.addEventListener('mouseout', onTicketDrag, false);
}

var onButtonClick = function(event) {
    var newTicket = document.createElement('div');
    newTicket.className = 'ticket';
    newTicket.id = '123';
}

var ticket = document.querySelector('.ticket');
var button = document.querySelector('.createButton');

ticket.addEventListener('mousedown', onTicketGrasp, false);
ticket.addEventListener('mouseup', onTicketDrop, false);
button.addEventListener('click', onButtonClick, false);