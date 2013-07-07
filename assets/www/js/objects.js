/*global $*/

function Board(title, href){

    "use strict";

    var topics = [];

    return{
        title: title,
        href: href,
        type: "board",
        topics: topics
    };
}

function Topic(title, id, user, messages, date, href, parent, newPostLink){

    "use strict";

    var posts = [],
        postHash = newPostLink !== "undefined" ? newPostLink.split('#')[1] : "#";

    return{
        parent: parent,
        title: title,
        id: id,
        user: user,
        messages: messages,
        date: date,
        href: href,
        posts: posts,
        type: "topic",
        newPostLink: newPostLink,
        postHash: postHash
    };

}

function Post(user, date, content, id){

    "use strict";

    return{
        username: user.name,
        userid: user.id,
        date: date,
        content: content,
        type: "post",
        id: id
    };
}

