var globalNotificationCount = 0;
var username = "";
var userQueue = "";

$(document).ready(function() {
    console.log("Index page is ready");
    connect();
    getUsername();

    $("#globalNotifications").click(function() {
        resetGlobalNotificationCount();
    });
    
});

function getUsername() {
        $.get("/username", function (data) {
			username = data;
            console.log("Username: " + data); // You can use the username in any way you want
            // Perform other actions with the username here
  });
}

function connect() {
     var client =  Stomp.client('ws://localhost:61614/ws');
     client.connect('admin', 'admin', function (frame) {
        console.log('Connected: ' + frame);
        updateGlobalNotificationDisplay();
        client.subscribe('/topic/global-notifications', function (globalMessage) {
			console.log('globalMessage: ' + globalMessage);
			globalNotificationCount = globalNotificationCount + 1;
            updateGlobalNotificationDisplay();
            showGlobalMessage(JSON.parse(globalMessage.body).content);
        });
        userQueue='/queue/'+username+'-messages';
        showusername(username);
        console.log('userQueue: ' + userQueue);
         client.subscribe(userQueue, function (userMessage) {
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

function showusername(username) {
    $("#usernameValue").append("<tr><td>" + username + "</td></tr>");
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