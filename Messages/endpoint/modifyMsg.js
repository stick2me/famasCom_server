const Response = require("../common/API_Response");
const Dynamo = require("../common/Dynamo");

exports.handler = async (event) => {
  let userId = event.requestContext.authorizer.principalId;
  const { msgId } = event.pathParameters;
  event = JSON.parse(event.body);
  if (!event.pathParameters || !event.pathParameters.msgId) {
    //failed
    Response._400({ message: "missing the msgId from the path" });
  }
  if (
    !event.userName ||
    event.userName.trim() === "" ||
    !event.msg ||
    event.msg.trim() === ""
  ) {
    //failed
    Response._400({
      message: "Post must have a email and password and they must not be empty",
    });
  }
  let msgData = event;

  const data = await Dynamo._update(msgData, msgId, userId).catch((err) => {
    console.log("error in Dynamo msgData update", err);
    return null;
  });

  if (data) {
    //return data
    return Response._200({ message: "The message has been modified.", data });
  }
  return Response._400({ message: "The message has failed to be modified." });
};
