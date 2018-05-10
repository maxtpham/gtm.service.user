import { firebaseAdmin } from "./firebase";

export default class FireBaseNotifi {

  public static async sendForTopPic(topic: string, title: string, message: string, fcm: string, screenID: number) : Promise<string> {
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
    firebaseAdmin.messaging().send(topic, payload).then((response) => {
      // console.log(response);
      return Promise.resolve("Gửi tin thành công");
    }).catch((error) => {
      console.log(error);
      return Promise.reject("Lỗi: " +error);
    });
    return Promise.reject("Không gửi được tin");
  } 

  public static  async sendForScreen(title: string, message: string, fcm: string, screenID: number): Promise<string> {

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
      return Promise.resolve("Gửi tin thành công");
    }).catch((error) => {
      return Promise.reject("Lỗi: " +error);
    });
    return Promise.reject("Không gửi được tin");

  } 

  public static async sendForMessage(title: string, message: string, fcm: string, userId: string, screenID: string): Promise<string> {
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
        title: title,
        message: message,
        screenID: screenID,
        userId: userId,
      },
      token: fcm
    };
    firebaseAdmin.messaging().send(payload).then((response) => {
      return Promise.resolve("Gửi tin thành công");
    }).catch((error) => {
      return Promise.reject("Lỗi: " +error);
    });
    return Promise.reject("Không gửi được tin");
  } 

}