import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite"

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.howard.four-musketeers",
  projectId: "677a4b6c0008a8f08524",
  databaseId: "677a4be9001368613e54",
  usersCollectionId: "677a4bf8001fdb9c943b",
  weaponsCollectionId: "677a4cca00125ce56fd5",
  cartCollectionId: "677a4d710024ce71c891",
  viewsCollectionId: "677db59a00136a842218",
  storageId: "677bd95b0015e5bbf5a0"
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  usersCollectionId,
  weaponsCollectionId,
  cartCollectionId,
  viewsCollectionId,
  storageId
} = config

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export async function createUser(username, email, password) {
  try {
    const newAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
      username
    );
    if (!newAccount) throw Error;

    const avatar = avatars.getInitials(username);

    const newUser = await databases.createDocument(
      databaseId,
      usersCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username: username,
        email: email,
        avatar: avatar
      }
    );

    return newUser;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function getAllWeapons() {
  try {
    const weapons = await databases.listDocuments(
      databaseId,
      weaponsCollectionId,
      [Query.orderAsc("$createdAt")]
    )
    return weapons.documents;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function getWeapon(weaponId) {
  try {
    const weapon = await databases.listDocuments(
      databaseId,
      weaponsCollectionId,
      [Query.equal("$id", weaponId)]
    )
    return weapon.documents[0]
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function addItemsToCart(weaponId) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const record = await databases.listDocuments(
      databaseId,
      cartCollectionId,
      [Query.equal("users", currentUser.$id), Query.equal("weapons", weaponId)]
    )
    if (record.documents.length === 0) {
      await databases.createDocument(
        databaseId,
        cartCollectionId,
        ID.unique(),
        {
          users: currentUser.$id,
          weapons: weaponId,
          quantity: 1
        }
      )
    } else {
      await databases.updateDocument(
        databaseId,
        cartCollectionId,
        record.documents[0].$id,
        {
          users: currentUser.$id,
          weapons: weaponId,
          quantity: record.documents[0].quantity + 1
        }
      )
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function getAllCartItems() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const items = await databases.listDocuments(
      databaseId,
      cartCollectionId,
      [Query.equal("users", currentUser.$id), Query.orderDesc("$createdAt")]
    );
    return items.documents;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function modifyCartItem(weaponId, quantity) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw Error;

    const record = await databases.listDocuments(
      databaseId,
      cartCollectionId,
      [Query.equal("users", currentUser.$id), Query.equal("weapons", weaponId)]
    )

    if (quantity > 0) {
      await databases.updateDocument(
        databaseId,
        cartCollectionId,
        record.documents[0].$id,
        {
          users: currentUser.$id,
          weapons: weaponId,
          quantity: quantity
        }
      )
    } else {
      await databases.deleteDocument(
        databaseId,
        cartCollectionId,
        record.documents[0].$id
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export async function getFilePreview(fileId) {
  let fileUrl;

  try {
    fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, "top", 100);
    if (!fileUrl) throw Error;
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export async function uploadFile(file) {
  if (!file) return;

  const { fileName, mimeType, fileSize, uri } = file;
  const asset = { name: fileName, type: mimeType, size: fileSize, uri: uri };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id);
    return fileUrl;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function modifyProfile(username, password, avatar, isNewAvatarPicked) {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    if (username !== currentAccount.name) {
      await account.updateName(username);
    }

    if (password !== "") {
      await account.updatePassword(password);
    }

    const currentUser = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )
    if (!currentUser) throw Error;

    const avatarUrl = avatar && isNewAvatarPicked ? await uploadFile(avatar) : currentUser.documents[0].avatar;

    const newUser = await databases.updateDocument(
      databaseId,
      usersCollectionId,
      currentUser.documents[0].$id,
      {
        username: username,
        avatar: avatarUrl
      }
    );

    return newUser;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function modifyViews(weaponId) {
  try {
    const record = await databases.listDocuments(
      databaseId,
      viewsCollectionId,
      [Query.equal("weapons", weaponId)]
    );
    if (record.documents.length === 0) {
      await databases.createDocument(
        databaseId,
        viewsCollectionId,
        ID.unique(),
        {
          weapons: weaponId,
          views: 1
        }
      );
    } else {
      await databases.updateDocument(
        databaseId,
        viewsCollectionId,
        record.documents[0].$id,
        {
          weapons: weaponId,
          views: record.documents[0].views + 1
        }
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getTrendingItems() {
  try {
    const result = await databases.listDocuments(
      databaseId,
      viewsCollectionId,
      [Query.orderDesc("views"), Query.limit(5)]
    )
    return result.documents;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
