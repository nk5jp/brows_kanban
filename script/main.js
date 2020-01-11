var tickets = []

var calculateZIndex = function(index) {
    let criteria = tickets[index].zIndex
    tickets.forEach(
        (ticket) => {
            if (ticket.zIndex > criteria) ticket.zIndex = ticket.zIndex - 1
        }
    )
    tickets[index].zIndex = tickets.length
}

var saveTicket = function() {
    updateAllTickets(tickets).then(
        () => {}
    ).catch(
        (reason) => alert(reason)
    )            
}

var Ticket = Vue.extend({
    template: '<div class=ticket v-bind:id="elementId" v-bind:style="styles" @mousedown="onTicketGrasp" @mouseup="onTicketDrop">{{ getText() }}</div>', 
    props: {
        ticketId: Number,
        index: Number
    },
    data: function() {
        return {
            offsetX: 0,
            offsetY: 0,
            deleted: false
        }
    },
    computed: {
        elementId: function() {
            return 'ticket' + this.ticketId
        },
        styles: function() {
            return {
                left: tickets[this.index].left + 'px', 
                top: tickets[this.index].top + 'px',
                zIndex: tickets[this.index].zIndex
            }
        }
    },
    methods: {
        onTicketDrag: function(event) {
            let pageX = event.pageX
            let pageY = event.pageY
            tickets[this.index].left = (pageX - this.offsetX)
            tickets[this.index].top = (pageY - this.offsetY)
        },
        onTicketDrop: function() {
            saveTicket()
            document.removeEventListener('mousemove', this.onTicketDrag, false)
        },
        onTicketGrasp: function(event) {
            this.offsetX = event.offsetX
            this.offsetY = event.offsetY
            calculateZIndex(this.index)
            document.addEventListener('mousemove', this.onTicketDrag, false)
        },
        getText: function() {
            return this.ticketId + ':' + tickets[this.index].text + '(' + tickets[this.index].zIndex + ')'
        }
    }
})

var AddTicketButton = Vue.extend({
    template: '<div class=addTicketButton @click="addTicket"></div>', 
    methods: {
        addTicket: function() {
            let zIndex = tickets.length + 1
            createNewTicket(5 * zIndex, 5 * zIndex, zIndex).then(
                (id) => {
                    let zIndex = tickets.length + 1
                    tickets.push({
                        id: id,
                        text: 'Initial Text.',
                        url: '',
                        filePath: '',
                        categoryId: 0,
                        left: 5 * zIndex,
                        top: 5 * zIndex,
                        zIndex: zIndex
                    })
                }
            ).catch(
                (reason) => alert(reason)
            )
        }
    }
});

new Vue({
    el: '#app',
    data: {
        tickets: tickets
    },
    created: function() {
        createConnection().then(
            getAllTickets
        ).then(
            (allTickets) => {
                allTickets.forEach(
                    ticket =>
                    {
                        tickets.push({
                            id: ticket.id,
                            text: ticket.text,
                            url: ticket.url,
                            filePath: ticket.filePath,
                            categoryId: ticket.categoryId,
                            left: ticket.left,
                            top: ticket.top,
                            zIndex: ticket.zIndex
                        })
                    }
                )
            }
        ).catch(
            (reason) => alert(reason)
        )
    },
    components: {
        'ticket': Ticket,
        'add-ticket-button': AddTicketButton
    }
});
