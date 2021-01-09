const sayhi = async (reaction, user) => {
  let c = await reaction.message.channel.send("whoa");
};

const dic = {
  "🗡️": sayhi,
};

const reactionhandler = async (reaction, user) => {
  for (i in dic) {
    if (`${reaction.emoji}` === i) {
      return await dic[i](reaction, user);
    }
  }
  await reaction.message.channel.send("no");
};

module.exports = reactionhandler;
