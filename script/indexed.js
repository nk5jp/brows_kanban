var connection;
var loadingCompleted = false;

var createConnection = function() {
    return new Promise(
        function(resolve, reject) {
            var openRequest = indexedDB.open('kanbanDB');

            openRequest.onupgradeneeded = function() {
                connection = openRequest.result
                connection.createObjectStore('tickets', {keyPath:'id', autoIncrement:true})
                loadingCompleted = true
                resolve()
            }
        
            openRequest.onsuccess = function() {
                connection = openRequest.result
                loadingCompleted = true
                resolve()
            }
        
            openRequest.onerror = function() {
                reject('コネクションの確立に失敗しました．タブを閉じてください．')
            }
        }
    )
}

var ticketRecordFactory = function(text, url, categoryId, left, top, zIndex) {
    return {
        text: text,
        url: url,
        categoryId: categoryId,
        left: left,
        top: top,
        zIndex: zIndex
    }
}

var defaultTicket = function(left, top, zIndex) {
    return ticketRecordFactory('Initial text.', '', 0, left, top, zIndex)
}

/**
 * Indexed Database APIからチケットを全て取得し，返却する．
 */
var getAllTickets = function() {
    return new Promise(
        function(resolve, reject) {
            if (!loadingCompleted) {
                reject()
            } else {
                try {
                    var transaction = connection.transaction('tickets', 'readonly')
                    var request = transaction.objectStore('tickets').getAll()
                    request.onsuccess = function() {
                        resolve(request.result)
                    }
                    request.onerror = function() {
                        reject('チケットのロードに失敗しました．タブを閉じてください．')
                    }
                } catch (error) {
                    alert('Welcome to the kanban board!')
                    resolve([]);
                }
            }
        }
    )
}

/**
 * 何も記述されていない空のチケットを作成し，IDを返却する．
 */
var createNewTicket = function(left, top, zIndex) {
    return new Promise(
        function(resolve, reject) {
            if (!loadingCompleted) {
                reject()
            } else {           
                var transaction = connection.transaction('tickets', 'readwrite')
                var request = transaction.objectStore('tickets').put(defaultTicket(left, top, zIndex))
                request.onsuccess = function () {
                    resolve(request.result)
                }
                request.onerror = function() {
                    reject('チケットを作成できませんでした．')
                }
            }
        }
    )
}

var updateTicket = function(ticket) {
    return new Promise(
        function(resolve, reject) {
            if (!loadingCompleted) {
                reject()
            } else {
                var transaction = connection.transaction('tickets', 'readwrite')
                var request = transaction.objectStore('tickets').put({
                    id: ticket.id,
                    text: ticket.text,
                    url: ticket.url,
                    categoryId: ticket.categoryId,
                    left: ticket.left,
                    top: ticket.top,
                    zIndex: ticket.zIndex
                })
                request.onsuccess = function () {
                    resolve(request.result)
                }
                request.onerror = function() {
                    reject('チケットを保存できませんでした．')
                }
            }
        }
    )
}

var updateAllTickets = function(tickets) {
    return new Promise(
        function(resolve, reject) {
            if (!loadingCompleted) {
                reject()
            } else {
                var transaction = connection.transaction('tickets', 'readwrite')

                transaction.oncomplete = function () {
                    resolve()
                }
                transaction.onerror = function() {
                    reject('チケットを保存できませんでした．')
                }

                tickets.forEach(
                        function(ticket) {
                            if (!ticket.deleted)
                                transaction.objectStore('tickets').put({
                                    id: ticket.id,
                                    text: ticket.text,
                                    url: ticket.url,
                                    categoryId: ticket.categoryId,
                                    left: ticket.left,
                                    top: ticket.top,
                                    zIndex: ticket.zIndex
                                })
                        }
                )
            }
        }
    )
}

var deleteTicket = function(id) {
    return new Promise(
        function(resolve, reject) {
            if (!loadingCompleted) {
                reject()
            } else {
                var transaction = connection.transaction('tickets', 'readwrite')
                var request = transaction.objectStore('tickets').delete(id)
                request.onsuccess = function () {
                    resolve()
                }
                request.onerror = function() {
                    reject('チケットを削除できませんでした．')
                }
            }
        }
    )
}