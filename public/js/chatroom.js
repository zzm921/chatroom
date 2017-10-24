var socket = io.connect('http://127.0.0.1:3001')
var reader = new FileReader();
$(document).ready(function (e) {
    var username = getCookie("username")
    if (username == undefined || username == null || username == "") {
        location.href = 'login.html'
    }

    $('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);
    $('.uname').hover(
        function () {
            $('.managerbox').stop(true, true).slideDown(100);
        },
        function () {
            $('.managerbox').stop(true, true).slideUp(100);
        }
    );

    $("#uname").html(username)
    $('#fromname').val(username);
    var to_uid = 0; // 默认为0,表示发送给所有用户
    var to_uname = '';

    $('.user_list > li').dblclick(function () {
        to_uname = $(this).find('em').text();
        to_uid = $(this).attr('data-id');
        if (to_uname == username) {
            alert('您不能和自己聊天!');
            return false;
        }
        if (to_uname == '所有用户') {
            $("#toname").val('');
            $('#chat_type').text('群聊');
        } else {
            $("#toname").val(to_uid);
            $('#chat_type').text('您正和 ' + to_uname + ' 聊天');
        }
        $(this).addClass('selected').siblings().removeClass('selected');
        $('#message').focus().attr("placeholder", "您对" + to_uname + "说：");
    });

    $('.sub_but').click(function (event) {
        sendMessage(event, username, to_uid, to_uname);
    });
    //添加表情
    _initialEmoji()
    //添加表情点击事件
    document.getElementById('emoji').addEventListener('click', function (e) {
        var emojiwrapper = document.getElementById('emojiWrapper');
        emojiwrapper.style.display = 'block';
        e.stopPropagation();
    }, false);
    document.body.addEventListener('click', function (e) {
        var emojiwrapper = document.getElementById('emojiWrapper');
        if (e.target != emojiwrapper) {
            emojiwrapper.style.display = 'none';
        };
    });
    //表情点击事件
    document.getElementById('emojiWrapper').addEventListener('click', function (e) {
        //获取被点击的表情
        var target = e.target;
        if (target.nodeName.toLowerCase() == 'img') {
            var messageInput = document.getElementById('message');
            messageInput.focus();
            messageInput.value = (messageInput.value).trim() + '[emoji:' + target.title + ']';
        };
    }, false);

    /*按下按钮或键盘按键*/
    $("#message").keydown(function (event) {
        var e = window.event || event;
        var k = e.keyCode || e.which || e.charCode;
        //按下ctrl+enter发送消息
        if (k == 13 || k == 10) {
            sendMessage(event, username, to_uid, to_uname);
        }
    });
    //获取在线列表
    socket.emit('user', {})
    //登出
    $("#logout").click(function () {
        socket.emit('logout', { username: username });
        clearCookie("username")
        location.href = 'login.html'
    })
    //登出
    window.onbeforeunload = function(event) {
        socket.emit('logout', { username: username });
        clearCookie("username")
        event.returnValue = "logout";
    };
       
});
//发送消息
function sendMessage(event, from_name, to_uid, to_uname, type) {
    var fileurl = ''
    var file = document.getElementById("img").files[0]
    var time = getNowFormatDate()
    if (file) {
        var reader = new FileReader();
        reader.onload = function (event) {
            txt = event.target.result;
            socket.emit('img', { "time": time, "username": from_name, "file": txt })
        };
        reader.readAsDataURL(file);
    }
    var msg = $("#message").val().trim();
    if (msg) {
        if (to_uname != '') {
            msg = '您对 ' + to_uname + ' 说： ' + msg;
        }
        socket.emit('message', { "text": msg, "time": time, "username": from_name })
    }
    $("#message").val('');
    $("#img").val("")
}

//接收信息
socket.on('push message', function (data) {
    var htmlData = '<div class="msg_item fn-clear">'
        + '   <div class="uface"><img src="images/hetu.jpg" width="40" height="40"  alt=""/></div>'
        + '   <div class="item_right">'
        + '<div class="msg own">' + data.text + '</div>'
        + '     <div class="name_time"> ' + data.username + '·' + data.time + '</div>'
        + '   </div>'
        + '</div>';

    htmlData = showemoji(htmlData)
    $("#message_box").append(htmlData);
    $('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);

});
socket.on('push img', function (data) {
    console.log(data.file)
    var htmlData = '<div class="msg_item fn-clear">'
        + '   <div class="uface"><img src="images/hetu.jpg" width="40" height="40"  alt=""/></div>'
        + '   <div class="item_right">'
        + '<div class="msg own" style="width: 400px;height: 400px;"><img style="height:100%;width:100%" src="' + data.file + '"/></div>'
        + '     <div class="name_time"> ' + data.username + '·' + data.time + '</div>'
        + '   </div>'
        + '</div>';


    $("#message_box").append(htmlData);
    $('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);

});
//接收登录ren列表
socket.on('push user', function (data) {
    var users = data.users
    $(".user_list").html("")
    var html = '<li class="fn-clear selected"><em>所有用户</em></li>'
    for (var i = 0; i < users.length; i++) {
        html += '<li class="fn-clear" data-id="1"><span><img src="../images/hetu.jpg" width="30" height="30"  alt=""/></span><em>' + users[i] + '</em><small class="online" title="在线"></small></li>'
    }
    $(".user_list").append(html)
});







function _initialEmoji() {
    var emojiContainer = document.getElementById('emojiWrapper'),
        docFragment = document.createDocumentFragment();
    for (var i = 69; i > 0; i--) {
        var emojiItem = document.createElement('img');
        emojiItem.src = '/face/' + i + '.gif';
        emojiItem.title = i;
        docFragment.appendChild(emojiItem);
    };
    emojiContainer.appendChild(docFragment);
}


function showemoji(msg) {
    var match, result = msg,
        reg = /\[emoji:\d+\]/g,
        emojiIndex,
        totalEmojiNum = document.getElementById('emojiWrapper').children.length;
    while (match = reg.exec(msg)) {
        emojiIndex = match[0].slice(7, -1);
        if (emojiIndex > totalEmojiNum) {
            result = result.replace(match[0], '[X]');
        } else {
            result = result.replace(match[0], '<img class="emoji" src="/face/' + emojiIndex + '.gif" />');
        };
    };
    return result;
}