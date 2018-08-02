const events = require("./events");
const { delegate } = require("./responses");

module.exports.handler = function (event, context, callback) {
  console.log(process.env);
  if (!event.headers || event.headers.Authorization !== `Token ${process.env.DAVIS_CLIENT_SECRET}`) {
    return callback(null, { statusCode: 401, body: "Unauthorized" });
  }

  const body = JSON.parse(event.body);
  const eventName = body.event;

  const handler = events[eventName];

  if (!handler) {
    console.error(`Unexpected event from davis: '${eventName}'.`);
    return callback(null, { statusCode: 200, body: delegate() });
  }

  return handler(body, (err, res) => {
    console.log(res);
    callback(err, res);
  });
}
