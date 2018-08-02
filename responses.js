module.exports.delegate = () => ({
  delegate: true,
});

module.exports.say = (text, confirmation, actions) => ({
  response: {
    text,
    actions,
    confirmationButtonName: (confirmation && (typeof confirmation === "string")) ?
      confirmation :
      undefined,
  },
  confirmation: !!confirmation,
});

module.exports.success = (body) => {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};
