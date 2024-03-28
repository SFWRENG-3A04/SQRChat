## Welcome to SQRChat

SQRChat's goal is to ensure secure team collaboration without serving as an external communication tool. This is done using a KDC, which will prevent sensitive information from being leaked.

## Prereq

- For Backend: Setup tailscale on phone and laptop

## Backend

- cd backend
- pip install -r requirements.txt

## Frontend

- cd frontend
- npm install (if any new dependencies)
- npx expo start

## Sample code

### Interacting with DB

#### Listening to DB endpoint

The following will fetch in the DB the messages "table" and then uid key ANYTIME it updates in the DB (pub/sub)
```
  onValue(
    ref(db, "messages/" + uid),
    (snapshot) => {
      if (snapshot.exists()) {
        setMessages(snapshot.val());
      }
    }
  );
```

#### Retrieving Values from DB

The following will fetch in the DB the groups "table" and then groupid key only when you call this function 
```
  const getGroup = async (groupuid) => {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "groups/" + groupuid));

    if (!snapshot.exists() || snapshot.val() == "none") {
        // console.log(snapshot.val().name)
        return snapshot.val().name;
    }
  }
```

#### Setting/Updating values in the DB

The following will set or overwrite the users/uid/group to be equal to groupuid
```
  const joinTeam = async (groupuid) => {
    set(ref(db, "users/" + uid + "/group"), 
      groupuid
    );
  }
```