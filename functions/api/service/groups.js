const admin = require("firebase-admin");
const firestore = admin.firestore();
const getDataAndPermissionsOnGroupByUserUid = async (idGroup, userId) => {
  let [groupData, permissions] = await Promise.all([
    getGroupById(idGroup),
    getPermissionsOnGroupByUserUid(idGroup, userId),
  ]);
  return [groupData, permissions];
};
const getGroupById = async (idGroup) => {
  let groupData = await firestore.collection("Groups").doc(idGroup).get();
  return groupData;
};
const getImageProfileByUserId = async (idUser) => {
  let user = await firestore
    .collection("users")
    .select(
      "profileImage",
      "profileImage_125x125",
      "profileImage_250x250",
      "profileImage_500x500",
      "firstName",
      "lastName",
      "type",
      "companyName",
    )
    .where("uid", "==", idUser)
    .get();
  if (user.empty) return {};
  user = user?.docs?.[0]?.data() || {};
  user.name = (
    user.type === "Organization" ? user.companyName : user.firstName + " " + user.lastName
  ).trim();
  return user;
};
const getMembersByGroupId = async (idGroup) => {
  let members = await firestore.collection("GroupsMembers").where("idGroup", "==", idGroup).get();
  if (members.empty) return [];
  return await Promise.all(
    members.docs.map(async (doc) => {
      let member = doc.data();
      member.id = doc.id;
      let imagesProfile = await getImageProfileByUserId(member.idUser);
      return {
        ...member,
        profile: imagesProfile,
      };
    }),
  );
};
const getGroupMemberDataByUserId = async (idGroup, idUser) => {
  let members = await firestore
    .collection("restaurant")
    .where("idGroup", "==", idGroup)
    .where("idUser", "==", idUser)
    .get();
  if (members.empty) return [];
  return await Promise.all(
    members.docs.map(async (doc) => {
      let member = doc.data();
      member.id = doc.id;
      let imagesProfile = await getImageProfileByUserId(member.idUser);
      return {
        ...member,
        profile: imagesProfile,
      };
    }),
  );
};
const getPermissionsOnGroupByUserUid = async (idGroup, userId) => {
  let groupData = await firestore
    .collection("restaurant")
    .where("idUser", "==", userId)
    .where("idGroup", "==", idGroup)
    .get();
  return groupData.docs[0];
};
exports.getDataAndPermissionsOnGroupByUserUid = getDataAndPermissionsOnGroupByUserUid;
exports.getPermissionsOnGroupByUserUid = getPermissionsOnGroupByUserUid;
exports.getGroupById = getGroupById;
exports.getMembersByGroupId = getMembersByGroupId;
exports.getGroupMemberDataByUserId = getGroupMemberDataByUserId;
