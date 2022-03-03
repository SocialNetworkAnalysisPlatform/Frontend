import { rtdb } from "../utils/firebase";
import { ref, get, set, child } from "firebase/database";

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

  async getUserData(uid) {
    try {
      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `Users/${uid}`));
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return null;
        }
    } catch (error) {
      console.log(error);
    }
  
  }

}
export default Service;
