import { rtdb } from "../utils/firebase";
import { ref, set } from "firebase/database";

export const writeUserData = (uid, email, displayName = "User", photoUrl = "") => {
    try {
      console.log("writeUserData");
      set(ref(rtdb, `Users/${uid}`), {
        email,
        displayName,
        photoUrl,
      });
    } catch (error) {
      console.log(error);
    }
  };
