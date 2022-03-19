import { rtdb, db } from "../utils/firebase";
import { ref, get, set, child } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";

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
        photoUrl: photoUrl ? photoUrl : "",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async readUserData(uid) {
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

  async getProjectCollaborators(id) {
    try {
      const docRef = doc(db, "Projects", id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data().collaborators;
      } else {
        return null
      }

    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getProjectConversations(id) {
    try {
      const docRef = doc(db, "Conversations", id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data().conversations;
      } else {
        return null
      }

    } catch (error) {
      console.log(error);
      return null
    }
  
  }

  async getNetworkShortestPath(path) {
    try {
      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `${path}/shortestPath`));
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
