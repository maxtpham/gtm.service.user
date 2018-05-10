import { firebaseAdmin } from "./firebase";

export default class FireBaseNotifi {

  static sendForTopPic = (topic: string, title: string, message: string, fcm: string, screenID: number) => {
    var payload = {
      notification: {
          title: title,
          body: message,
          // icon: "new",
          // sound: "default",
          // clickAction: "fcm.ACTION.HELLO",
          // badge: '1'
      },
      data: {
        screenID: screenID,
      }
    };
    return  firebaseAdmin.messaging().send(topic, payload).then((response) => {
      // console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  } 

  static sendForScreen = (title: string, message: string, fcm: string, screenID: number) => {

    var payload = {
      notification: {
          title: title,
          body: message,
          // icon: "new",
          // sound: "default",
          // clickAction: "fcm.ACTION.HELLO",
          // badge: '1'
      },
      data: {
        screenID: screenID,
      },
      token: fcm
    };

    firebaseAdmin.messaging().send(payload).then((response) => {
      // console.log(response);
    }).catch((error) => {
      console.log(error);
    });

  } 

  static sendForMessage = (title: string, message: string, fcm: string, userId: string, screenID: string) => {
    var payload = {
      notification: {
          title: title,
          body: message,
          // icon: "new",
          // sound: "default",
          // clickAction: "fcm.ACTION.HELLO",
          // badge: '1'
      },
      data: {
        title: "Tin nhắn: " + title,
        message: message,
        screenID: screenID,
        userId: userId,
      },
      token: fcm
    };
    return firebaseAdmin.messaging().send(payload).then((response) => {
      // console.log(response);
    }).catch((error) => {
      console.log("Error: " + error);
    });
  } 

}