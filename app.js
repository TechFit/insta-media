const { IgApiClient } = require('./node_modules/instagram-private-api/dist/core/client');
const { sample } = require('lodash');
const ig = new IgApiClient();
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const fetch = require("node-fetch")
const { lasss } = require('./Messages')
const fastXmlParser = require('fast-xml-parser');
const MESSAGE_NOT_READ = 1;

// TODO
// 1. Load all messages (by time)
// 2. Save last message id
// 3. Check new messages by last stored id in db.

ig.state.generateDevice('video-dealer');
(async () => {
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login('', '');
  process.nextTick(async () => await ig.simulate.postLoginFlow());
  // Create UserFeed instance to get loggedInUser's posts
  // const userFeed = ig.feed.user(loggedInUser.pk);
  // const myPostsFirstPage = await userFeed.items();
  // All the feeds are auto-paginated, so you just need to call .items() sequentially to get next page
  // setInterval(async () => {
  //   const messages = await ig.feed.directInbox().items();
  //   const messagesRequest = await ig.feed.directPending().items();
  //   console.log(messages);
  // },1000)

    const pendingMessages = await ig.feed.directPending().items();
    await pendingMessages.forEach((item, i) => {
      ig.directThread.approveParticipantRequests(item.thread_id, item.users['pk']);
    });
    const messages = await ig.feed.directInbox().items();
    const records = await ig.feed.directInbox().records();
    const request = await ig.feed.directInbox().request();
    const countOfUnseenMessages = request.inbox.unseen_count;

    const unreadMessages = messages.filter((item, i) => {
      return item.read_state === MESSAGE_NOT_READ;
    });

    const deleteItem  = await ig.directThread.deleteItem(,  );
    let a = 1;

  // let mediaId = await axios.get('https://api.instagram.com/oembed/?url=https://instagram.com/p/CBpkAftAEkV/')
  // .then(response => {
  //   return response.data.media_id;
  // })
  // .catch(error => {
  //   console.log(error);
  // });

  // const myPostsSecondPage = await ig.media.info(mediaId);
  // let xml = await myPostsSecondPage.items[0].video_dash_manifest;

  // var jsonObj = fastXmlParser.parse(xml);
  // let videoUrl = jsonObj.MPD.Period.AdaptationSet[0].Representation[0].BaseURL;
  // var urlString = videoUrl.replace(/&amp;/g, '&');
  // const file = fs.createWriteStream("1.mp4");
  // const request = await https.get('urlString', function(response) {
  //   response.pipe(file);
  // });

})();
