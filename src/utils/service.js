import { rtdb } from "../utils/firebase";
import { ref, set } from "firebase/database";

export class Service {
  static myInstance = null;

  static getInstance() {
    return new Service();
  }

  async writeUserData(uid, email, displayName, photoUrl) {
    try {
      set(ref(rtdb, `Users/${uid}`), {
        email,
        displayName: displayName ? displayName : "User",
        photoUrl : photoUrl ? photoUrl : "",
      });
    } catch (error) {
      console.log(error);
    }
  }
}
export default Service;
