/*global $, jQuery, Board, Post, Topic, browserTest*/

String.prototype.contains = function(it) { 
    "use strict";
    return this.indexOf(it) !== -1; 
};
String.prototype.stripHTML = function() { 
    "use strict";
    return this.replace("<", "&lt;").replace(">","&gt;");
};


var parser = {

    methods: function(pageHTML){

        "use strict";

        var newDom = $(pageHTML);

        this.getBookmarks = function(){

            var bookmarks = {},
                boards = [],
                parent = newDom.find('.menubar ~ h1').text(),
                bookmarks = newDom.find('#bookmarks > span > a'),
                title,
                href,
                newBoard,
                i;

            bookmarks.parent = parent;
            bookmarks.boards = boards;
            bookmarks.url    = 'http://endoftheinter.net/main.php';

            for(i = 0; i < bookmarks.length; i+=1){
                title = bookmarks.eq(i).text();
                href = bookmarks.eq(i).attr('href');

                if(href !== undefined){
                    if(!(href.toString().contains("http//"))){
                        href = "http:" + href;
                    }
                    newBoard = Board(title, href);

                    bookmarks.boards.push(newBoard);
                }
            }

            return bookmarks;
        };

        this.getTopics = function(){
            var topics = {},
                topicArray = [],
                parent = newDom.find('.menubar ~ h1').text(),
                topicsList = newDom.find('table.grid tr'),
                newPostLink,
                curr,
                title,
                href,
                idRegex,
                id,
                user,
                msgs,
                date,
                newTopic,
                i;

            topics.parent = parent;
            topics.topics = topicArray;

            for(i = 1; i < topicsList.length; i+=1){

                curr = topicsList.eq(i);
                title = curr.find('td:nth-child(1) div.fl a').text();
                href = curr.find('td:nth-child(1) div.fl a').attr('href');
                
                if(href !== undefined){
                    if(!(href.contains("http//"))){
                        href = "http:" + href;
                    }

                    idRegex = /php\?topic=([0-9]*)/g;
                    id = idRegex.exec(href)[1];
                    user = curr.find('td:nth-child(2) a').text();
                    msgs = curr.find('td:nth-child(3)').text();
                    newPostLink = String(curr.find('td:nth-child(3) a').attr('href'));
                    date = curr.find('td:nth-child(4)').text();

                    

                    if(newPostLink !== 'undefined' && !(newPostLink.contains("http//"))){
                        newPostLink = "http:" + newPostLink;
                    }    

                    if(id !== null){
                        id = id[1];
                        newTopic = new Topic(title,id,user,msgs,date,href,parent,newPostLink);
                        topics.topics.push(newTopic);
                    }
                }
            }

            return topics;
        };

        this.getPosts = function(){

            var posts = {},
                postArray = [],
                topicTitle,
                parent = newDom.find('.menubar ~ h1').text(),
                postsList = newDom.find('#u0_1 div.message-container'),
                postid,
                messageTop,
                dateRegex,
                curr,
                user,
                userid,
                date,
                content,
                newPost,
                imgSrc,
                newImg,
                rand,
                i;

            posts.parent = parent;
            posts.posts = postArray;

            dateRegex = /[0-9]+[\/][0-9]+[\/][0-9]+[\s][0-9]+[\:][0-9]+[\:][0-9]+[\s](AM|PM)/;

            for(i = 0; i < postsList.length; i+=1){

                curr = postsList.eq(i);
                postid = curr.attr('id');
                messageTop = curr.find('div.message-top');
                user = curr.find('div.message-top > a').text();
                userid = curr.find('div.message-top > a').attr('href').replace('//endoftheinter.net/profile.php?user=','');
                date = messageTop.text().match(dateRegex);

                console.log(userid);

                if(date){
                    date = date[0];
                }
                else{
                    date = "Lol date error";
                }
                content = $(curr.find('.message-container .message'));
                content.find('a').each(function(){
                    $(this).removeAttr('href');
                });

                //Make images work properly
                if(browserTest){
                    content.find('img').each(function(){

                        imgSrc = $(this).attr('src');

                        if(!imgSrc.contains('http://')){
                            imgSrc = imgSrc.replace('//','http://');
                            $(this).attr('src',imgSrc);
                        }

                        newImg = $(this).parent().html();

                        $(this).parents('.imgs').html(newImg);

                    });
                }
                else{
                    content.find('.imgs').each(function(){

                        imgSrc = $(this).find('a').attr('imgsrc');

                        rand = (Math.floor(Math.random() * 4) + 1).toString();

                        imgSrc = imgSrc.replace('images.endoftheinter.net/imap/','i' + rand + '.dealtwith.it/i/n/');

                        newImg = $('<img>').attr('src',imgSrc);

                        $(this).html(newImg);

                    });
                }

                newPost = new Post({name:user, id: userid}, date, content.html(), postid);

                posts.posts.push(newPost);

            }
            return posts;
        };

        this.getPages = function(){
            var regex = /([1-9]*) of ([1-9]*)/,
                pagesList = newDom.find('#u0_2 a'),
                pages = [];
                // pages = pagesList.match(regex);
            

            for(var i = pagesList.length - 1; i >= 0; i-=1){
                if(pagesList.eq(i).parent().css('display') !== 'none'){
                    pages.push({text:pagesList[i].text, link:"http:" + pagesList[i].href});
                }
            }
            
            return pages;

        };

        this.getHashes = function(){
            var hash = newDom.find('form.quickpost input[name="h"]').attr('value'),
                topicid = newDom.find('form.quickpost input[name="topic"]').attr('value');

            return {
                hash: hash,
                topicid: topicid
            };
        };
    }

};



