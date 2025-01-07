import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite"

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.howard.four-musketeers",
  projectId: "677a4b6c0008a8f08524",
  databaseId: "677a4be9001368613e54",
  usersCollectionId: "677a4bf8001fdb9c943b",
  weaponsCollectionId: "677a4cca00125ce56fd5",
  cartCollectionId: "677a4d710024ce71c891"
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  usersCollectionId,
  weaponsCollectionId,
  cartCollectionId
} = config

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

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