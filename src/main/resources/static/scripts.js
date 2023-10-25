var globalNotificationCount = 0;

$(document).ready(function() {
    console.log("Index page is ready");
    connect();

    $("#globalNotifications").click(function() {
        resetGlobalNotificationCount();
    });
    
});

function connect() {
	
	 var ws = new WebSocket('ws://localhost:15674/ws');
     var client = Stomp.over(ws);
	
    client.connect('guestclient', 'guestclient', function (frame) {
        console.log('Connected: ' + frame);
        client.subscribe('/topic/global-notifications', function (globalMessage) {
			globalNotificationCount = globalNotificationCount + 1;
            updateGlobalNotificationDisplay();
            showGlobalMessage(JSON.parse(globalMessage.body).content);
        });
        
         client.subscribe('/topic/messages', function (userMessage) {
			globalNotificationCount = globalNotificationCount + 1;
            updateGlobalNotificationDisplay();
            showUserMessage(JSON.parse(userMessage.body).content);
        });

    });
}

function showGlobalMessage(globalMessage) {
    $("#globalMessages").append("<tr><td>" + globalMessage + "</td></tr>");
}

function showUserMessage(userMessage) {
    $("#globalMessages").append("<tr><td>" + userMessage + "</td></tr>");
}

function updateGlobalNotificationDisplay() {
    if (globalNotificationCount == 0) {
        $('#globalNotifications').text(globalNotificationCount);
    } else {
        $('#globalNotifications').show();
        $('#globalNotifications').text(globalNotificationCount);
    }
}

function resetGlobalNotificationCount() {
    globalNotificationCount = 0;
    updateGlobalNotificationDisplay();
}
