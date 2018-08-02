const axios = require('axios');

const { delegate, say, success } = require("./responses");

module.exports.fullTextInterception = (body, callback) => {
  console.log(body);
  if (body.payload.text.match(/^echo\s+/)) {
    return callback(null, success(say(body.payload.text.replace(/^echo\s+/i, ""))));
  }
  return callback(null, success(delegate()));
};

module.exports.preReport = (body, callback) => {
  callback(null, success(say(`Received event ${body.event}.`)));
};

module.exports.postReport = (body, callback) => {
  if (body.type === "validate") {
    return callback(null, success(say('Say yes to run the next custom action.', 'Or click here')));
  }
  return callback(null, success(say(`Received confirmation for event ${body.event}.`)));
};

module.exports.postProblemDetail = async (body, callback) => {
  console.log(process.env);

  if (body.type === "validate") {
    return callback(null, success(say("Would you like to notify the person on call?", `Notify ${process.env.MY_NAME}`)));
  }

  if (body.type === "custom") {
    return callback(null, success(say(`Notified ${process.env.MY_NAME}`)));
  }
  if (body.type === "confirmed") {
    console.log(body.payload.problem);
    const res = await axios.post('https://textbelt.com/text', {
      phone: process.env.PHONE_NUMBER,
      message: body.payload.problem.title,
      key: process.env.TEXTBELT_KEY,
    });
    console.log(res);
    return callback(null, success(say("Notification sent")));
  }
};

module.exports.postEntityDetail = (body, callback) => {
  if (body.type === "validate") {
    return callback(null, success(say('Say yes to run the next custom action.', "Or click here")));
  }
  return callback(null, success(say(`Received confirmation for event ${body.event}.`)));
};

