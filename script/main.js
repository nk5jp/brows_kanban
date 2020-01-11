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

var saveAllTicket = function() {
    updateAllTickets(tickets).then(
        () => {}
    ).catch(
        (reason) => alert(reason)
    )            
}

var Ticket = Vue.extend({
    template: 
        '<div class="ticket" v-bind:id="ticketElementId" v-bind:style="styles" @mousedown="onTicketGrasp" @mouseup="onTicketDrop" v-if="!deleted">' + 
            '<p @dblclick="startEditMode">{{ ticketText | textFilter }}</p>' + 
            '<div class="linkButton" @click="webClick" v-bind:title="ticketURL">URL</div>' +
            '<div class="editView" v-show="isEditMode" @mousedown="stopPropagationForEdit">' + 
                '<label>text:</label><br>' + 
                '<textarea rows="10" cols="60" v-model="ticketText"></textarea><br>' + 
                '<label>URL:</label><br>' + 
                '<input type=text size="40" v-model="ticketURL"><br>' + 
                '<input type=button value="更新" @click="editTicket"><input type=button value="キャンセル" @click="endEditMode">' + 
                '<div class="deleteButton" @click="dumpTicket">削除</div>' +
            '</div>' + 
        '</div>',
    props: {
        ticketId: Number,
        index: Number
    },
    data: function() {
        return {
            offsetX: 0,
            offsetY: 0,
            deleted: false,
            isEditMode: false,
            ticketText: tickets[this.index].text,
            ticketURL: tickets[this.index].url
        }
    },
    computed: {
        ticketElementId: function() {
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
    filters: {
        textFilter: function(value) {
            if (value.length <= 30) return value
            return value.replace(/\r?\n/g, ' ').substr(0, 30) + '...'
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
            saveAllTicket()
            document.removeEventListener('mousemove', this.onTicketDrag, false)
        },
        onTicketGrasp: function(event) {
            if (event.target.className != 'linkButton') {
                this.offsetX = event.offsetX
                this.offsetY = event.offsetY
                calculateZIndex(this.index)
                document.addEventListener('mousemove', this.onTicketDrag, false)
            }
        },
        startEditMode: function(event) {
            this.isEditMode = true
            event.stopPropagation()
        },
        endEditMode: function(event) {
            this.ticketText = tickets[this.index].text
            this.ticketURL = tickets[this.index].url
            this.isEditMode = false
            event.stopPropagation()
        },
        stopPropagationForEdit: function(event) {
            event.stopPropagation()
        },
        editTicket: function() {
            tickets[this.index].text = this.ticketText
            tickets[this.index].url = this.ticketURL
            updateTicket(tickets[this.index])
            .then(
                () => this.isEditMode = false
            )
            .catch(
                (reason) => alert(reason)
            )
        },
        webClick: function(event) {
            if (this.ticketURL !== '') {
                window.open(this.ticketURL)
                event.stopPropagation()
            }
        },
        dumpTicket: function() {
            if (window.confirm('本当に削除しますか？削除されたチケットは復元できません．')){
                deleteTicket(this.ticketId).then(
                    () => {
                        this.deleted = true
                        tickets[this.index].deleted = true
                    }
                ).catch(
                    (reason) => alert(reason)
                )
            }
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
                    let tempAxis = 5 * zIndex
                    tickets.push({
                        id: id,
                        text: 'Initial Text.',
                        url: '',
                        categoryId: 0,
                        left: tempAxis,
                        top: tempAxis,
                        zIndex: zIndex,
                        deleted: false
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
                            categoryId: ticket.categoryId,
                            left: ticket.left,
                            top: ticket.top,
                            zIndex: ticket.zIndex,
                            deleted: false
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
