var notificationCount = 0;

$(document).ready(function() {
    console.log("Index page is ready");
    connect();

    $("#send").click(function() {
        sendMessage();
    });

    $("#send-private").click(function() {
        sendPrivateMessage();
    });

    $("#notifications").click(function() {
        resetNotificationCount();
    });
});

function connect() {
	
	 var ws = new WebSocket('ws://localhost:15674/ws');
     var client = Stomp.over(ws);
	
    client.connect('guest', 'guest', function (frame) {
        console.log('Connected: ' + frame);
        updateNotificationDisplay();
        client.subscribe('/topic/messages', function (message) {
            showMessage(JSON.parse(message.body).content);
        });

        client.subscribe('/user/topic/private-messages', function (message) {
            showMessage(JSON.parse(message.body).content);
        });

        client.subscribe('/topic/global-notifications', function (message) {
            notificationCount = notificationCount + 1;
            updateNotificationDisplay();
        });

        client.subscribe('/user/topic/private-notifications', function (message) {
            notificationCount = notificationCount + 1;
            updateNotificationDisplay();
        });
    });
}

function showMessage(message) {
    $("#messages").append("<tr><td>" + message + "</td></tr>");
}

function sendMessage() {
    console.log("sending message");
    client.send("/ws/message", {}, JSON.stringify({'messageContent': $("#message").val()}));
}

function sendPrivateMessage() {
    console.log("sending private message");
    client.send("/ws/private-message", {}, JSON.stringify({'messageContent': $("#private-message").val()}));
}

function updateNotificationDisplay() {
    if (notificationCount == 0) {
        $('#notifications').hide();
    } else {
        $('#notifications').show();
        $('#notifications').text(notificationCount);
    }
}

function resetNotificationCount() {
    notificationCount = 0;
    updateNotificationDisplay();
}