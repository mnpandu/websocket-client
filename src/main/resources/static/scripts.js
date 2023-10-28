var globalNotificationCount = 0;

$(document).ready(function() {
    console.log("Index page is ready");
    connect();

    $("#globalNotifications").click(function() {
        resetGlobalNotificationCount();
    });
    
});

function connect() {
     var client =  Stomp.client('ws://localhost:61614/ws');
     client.connect('admin', 'admin', function (frame) {
        console.log('Connected: ' + frame);
        client.subscribe('/topic/global-notifications', function (globalMessage) {
			globalNotificationCount = globalNotificationCount + 1;
            updateGlobalNotificationDisplay();
            showGlobalMessage(JSON.parse(globalMessage.body).content);
        });
        
         client.subscribe('/queue/i2vm-messages', function (userMessage) {
			 console.log('userMessage: ' + userMessage);
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