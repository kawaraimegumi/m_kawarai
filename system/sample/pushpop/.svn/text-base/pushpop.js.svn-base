// var stack;

// stack = store.get('hoge') || [];
// store.remove('hoge');

// var savedData;

// if (stack.length > 0) {
//     if (_.last(stack).type === 0) {
//         savedData = stack.pop();
//     }
// }


// var current = _.last(stack) || {};

// var appId = location.pathname.split('/').pop();

// var pushd;
// function push(url, args, saved) {
//     pushd = true;
//     console.log(url, args, saved);
//     var s = stack.slice();
//     var dstId = url.split('/').pop();

//     s.push({
//         type: 0,
//         saved: saved
//     });
//     s.push({
//         type: 1,
//         args: args,
//         srcUrl: location.href,
//         dstUrl: url,
//         srcId: appId,
//         dstId: dstId
//     });

//     store.set('hoge', s);
//     window.location.href = url;
// }

// function pop() {
//     pushd = true;
//     if (stack.length === 0)
//         return;
//     var s = stack.slice();
//     s.pop();
//     store.set('hoge', s);
//     window.location.href = current.srcUrl;
// }

$(function () {
    // $(window).bind('beforeunload', function () {
    //     if (!pushd)
    //         return 'データが失なわれます';
    // });

    // $('body').delegate('a', 'click', function (ev) {
    //     ev.preventDefault();
    //     clcom.pushPage(ev.currentTarget.href, {
    //         arg1: clcom.pageId
    //     }, {
    //         data: clcom.pageId
    //     });
    //     clcom.pushPage(ev.currentTarget.href, undefined, undefined);
    // });

    $('.back').click(function (ev) {
        clcom.popPage();
    });

    _.each(['srcId', 'dstId', 'srcUrl', 'dstUrl', 'pageArgs', 'pageData'], function(key) {
        var value = clcom[key];
        $('.' + key).text(JSON.stringify(value));
    });
});

// $(function () {
//     'use strict';

//     if (!_.isArray(store.get('hoge')))
//         store.remove('hoge');
//     var id = location.pathname.split('/').pop();
//     // console.log(location.host);
//     // console.log(location.hostname);
//     // console.log(location.href);
//     // console.log(location.origin);
//     // console.log(location.pathname);

//     var list = store.get('hoge') || [];
//     store.clear();
//     console.log('loading', id, list);

//     $('body').delegate('a', 'click', function () {
//         console.log('a');
//     });

//     $(window).bind('beforeunload', function () {
//         console.log('beforeunload', location.href, document.referrer);
//     });

//     $(window).unload(function () {
//         list.push(id);
//         store.set('hoge', list);
//     });

//     $('button').click(function() {
//         list = [];
//     });
// });
