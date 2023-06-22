useEffect(() => {
    const user = auth.currentUser;
    console.log("this is the user -.", user);
    onAuthStateChanged(auth, async (user) => {
      console.log("inside inside", user);
      if (user) {
        console.log("user is verified");
        const docRef = doc(db, "reduxObj", user.uid);
        const docSnap = await getDoc(docRef);
        console.log("outside ->", docSnap);
  
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setobjArray(docSnap.data().arrayofObject);
        } else {
          console.log("No such document!");
        }
  
        console.log("inside the effect in cart this is the state -> ", objArray);
      } else {
        console.log("User not logged in");
      }
    });
  }, []);