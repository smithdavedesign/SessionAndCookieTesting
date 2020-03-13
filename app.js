'use strict';

var http = require('http');
var request = require('request');//https://www.npmjs.com/package/request
var Promise = require("bluebird");// adding promise mechanism

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    res.end('Hello world!');
})

server.listen(port, hostname, () => {
    console.log('server started');
})


const j = request.jar()
var theurl = 'http://localhost:9000/test2'//returns session ID
var theurl2 = 'http://localhost:9000/users/loginForSessionID' //logins, gives session statefulness
var theurl3 = 'http://localhost:9000/test' //shows user cookie and session info
//1
//three chained requests one to get session ID
//2
//seccond logins and gets session variable all started
//3
//third tests to see if the session is still valid and running
request(//first request
    {
        method: 'GET'
        , url: theurl
        , gzip: true
        , jar: j
    }
    , function (error, response, body) {//1
        // body is the decompressed response body
        //console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
        //console.log('the decoded data is: ' + body)
        const cookie_string = j.getCookieString(theurl); // "key1=value1; key2=value2; ..."
        const cookies = j.getCookies(theurl);
        //console.log(cookie_string);
        //console.log(cookies);
    }
)
    .on('data', function (data) {
        // decompressed data as it is received
        //console.log('decoded chunk: ' + data)
        console.log('first trip')
        console.log('the cookie returned is: ')
        console.log(j.getCookieString(theurl));
        request(
            {
                method: 'GET'
                , url: theurl
                , gzip: true
                , jar: j
            }
            , function (error, response, body) {//2
                // body is the decompressed response body
                //console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
                //console.log('the decoded data is: ' + body)
                const cookie_string = j.getCookieString(theurl); // "key1=value1; key2=value2; ..."
                const cookies = j.getCookies(theurl);
                //console.log(cookie_string);
                //console.log(cookies);

                request(//seccond request
                    {
                        method: 'POST'
                        , url: 'http://localhost:9000/users/loginForSessionID' 
                        , gzip: true
                        , jar: j
                        ,    
                        json: {
                            Email: 'dgssmith@ucdavis.edu',
                            PassWord: 'Ginger123'
                        }
                    }
                    , function (error, response, body) {
                        if (response.statusCode == 200) {
                            console.log('we posted :D ')
                        } else {
                            console.log('error: ' + response.statusCode)
                            console.log(body)
                        }
                    }
                ).on('data', function (data) {
                    // decompressed data as it is received
                    console.log('return from post trip')
                    console.log('data returned after login post')
                    console.log('decoded chunk: ' + data)
                    console.log('the cookie returned is: ')
                    console.log(j.getCookieString(theurl));
                    request(//third request
                        {
                            method: 'GET'
                            , url: theurl3
                            , gzip: true
                            , jar: j
                        }
                        , function (error, response, body) {//3
                            // body is the decompressed response body
                            console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
                            console.log('the decoded data is: ' + body)
                            const cookie_string = j.getCookieString(theurl); // "key1=value1; key2=value2; ..."
                            const cookies = j.getCookies(theurl);
                            console.log(cookie_string);
                            console.log(cookies);
                        }
                    ).on('data', function (data) {
                            // decompressed data as it is received
                            console.log('decoded chunk: ' + data)
                            console.log('the cookie returned is: ')
                            console.log(j.getCookieString(theurl));
                        })
                });

            }
        ).on('data', function (data) {
            // decompressed data as it is received
            console.log('decoded chunk: ' + data)
            console.log('the cookie returned is: ')
            console.log(j.getCookieString(theurl));
        });
    })
    .on('response', function (response) {
        // unmodified http.IncomingMessage object
        response.on('data', function (data) {
            // compressed data as it is received
            console.log('received ' + data.length + ' bytes of compressed data')
        })

    })



//PART 2 going throw tutorial