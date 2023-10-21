const functions = require("firebase-functions");
const { default: axios } = require("axios");
const admin = require("firebase-admin");
const {
  getContent,
  deleteFolderAndSubCollections,
  recursiveDelete,
} = require("../services/downloads");
const firestore = admin.firestore();
const { CloudTasksClient } = require("@google-cloud/tasks");
const { sendNotifications } = require("../../utils/notifications");
const DOWNLOAD_CONTENT_TYPE = "download_content_update";
const makeContent = async (content, FolderId, folderData, uid, ownerUid, customActions) => {
  const updatedAt = new Date().getTime();
  const response =
    content?.map(async ({ details, collectionId }) => {
      const r =
        details?.map(async (d) => {
          let contentData = {
            FolderId,
            author: folderData?.author || "",
            createdAt: folderData?.createdAt || updatedAt,
            updatedAt: folderData?.updatedAt || updatedAt,
            customOrder: -(folderData?.customOrder || updatedAt),
            parentType: d?.isSubFolder ? "SubFolder" : "Folder",
            title: d.data?.title || "",
            type: collectionId,
            isDownload: true,
            isSync: true,
            ref: {
              id: d.data?.itemId,
              collection: collectionId,
              lastUpdate: updatedAt,
              owner: ownerUid || "",
            },
          };
          if (collectionId === "testCollections") {
            contentData = {
              ...contentData,
              des: d.data?.des || "",
              itemCount: d.data?.itemCount || 0,
              userId: uid,
            };
          } else if (collectionId === "notesforcollection") {
            contentData = {
              ...contentData,
              des: d.data?.des || "",
              userId: uid,
              words: d.data?.words || 0,
            };
          } else if (collectionId === "assetsCollection") {
            contentData = {
              ...contentData,
              des: d.data?.des || "",
              itemCount: d.data?.itemCount || "",
              userId: uid,
            };
          } else if (collectionId === "SubFolders") {
            contentData = {
              ...contentData,
              Select: 0,
              itemCount: d.data?.itemCount || "",
              mark: 0,
              unit: d.data?.unit || "",
              id: uid,
            };
          }
          if (customActions) {
            await customActions({ collectionId, contentData, uid, content: d, ownerUid });
          } else {
            const fData = await firestore.collection(collectionId).add(contentData);
            //   await firestore
            //     .collection(collectionId)
            //     .doc(d.data?.itemId)
            //     .collection("Downloads")
            //     .doc(fData.id)
            //     .set({
            //       id: fData.id,
            //       updatedAt,
            //       isSync: true,
            //       owner: uid,
            //     });
            if (collectionId === "SubFolders" && d?.collection?.length) {
              await makeContent(d.collection, fData.id, contentData, uid, ownerUid, customActions);
            }
            if (collectionId === "assetsCollection" && d?.collection?.length) {
              await Promise.all(
                d?.collection.map(async (a) => {
                  const { collectionId, details } = a;
                  const { itemId, ...rest } = details;
                  const assetsCollectionQ = await firestore.collection(collectionId).add({
                    ...rest,
                    assetsId: fData.id,
                    createdAt: contentData?.createdAt,
                    updatedAt: contentData?.updatedAt,
                    isDownload: true,
                    isSync: true,
                    type: collectionId,
                    ref: {
                      id: itemId,
                      collection: collectionId,
                      lastUpdate: contentData?.updatedAt,
                      owner: ownerUid || "",
                    },
                  });
                }),
              );
            }
            if (collectionId === "testCollections" && d?.collection?.length) {
              await Promise.all(
                d?.collection.map(async (a) => {
                  const { collectionId, details } = a;
                  const { itemId, ...rest } = details;
                  const testCollections = await firestore.collection(collectionId).add({
                    ...rest,
                    testCollectionId: fData.id,
                    createdAt: contentData?.createdAt,
                    updatedAt: contentData?.updatedAt,
                    isDownload: true,
                    isSync: true,
                    type: collectionId,
                    ref: {
                      id: itemId,
                      collection: collectionId,
                      lastUpdate: contentData?.updatedAt,
                      owner: ownerUid || "",
                    },
                  });
                }),
              );
            }
          }
          return true;
        }) || [];
      const rr = await Promise.all(r);
      return rr;
    }) || [];
  const rr = await Promise.all(response);
  return rr;
};
// {
//   // Required for background/quit data-only messages on iOS
//   contentAvailable: true,
// }
module.exports.controller = (app) => {
  app.delete("/api/downloads/:folderId", async (req, res) => {
    const { folderId } = req.params;
    const { user, uid } = req.currentUser;
    if (!folderId) {
      res.status(500).json({
        success: false,
        message: "fields are missing",
      });
      return;
    }
    const snap = await firestore.collection("Folders").doc(folderId).get();
    if (!snap.exists) {
      return res.status(500).json({
        success: false,
        message: "The request folder no exist",
      });
    }
    const folder = snap.data();
    if (folder.id !== uid || !folder.isDownload) {
      return res.status(500).json({
        success: false,
        message: "You do not have permission to perform this operation",
      });
    }
    if (!folder.ref?.id) {
      return res.status(500).json({
        success: false,
        message: "This folder is not linked to any folder as a download.",
      });
    }
    let backupId = folder.backUpRef?.id;
    const deletes = [folderId];
    if (backupId) deletes.push(backupId);

    await Promise.all(
      deletes.map(async (folderId) => {
        await firestore
          .collection("newCollections")
          .doc(folder.ref.id)
          .collection("Downloads")
          .doc(folderId)
          .delete();
        await deleteFolderAndSubCollections(folderId);
      }),
    );
    res.send({ success: true, deletes });
  });
  app.post("/api/downloads/:folderId", async (req, res) => {
    const { folderId } = req.params;
    const { isbackUp } = req.body;
    const { user, uid } = req.currentUser;
    if (!folderId) {
      res.status(500).json({ success: false, message: "fields are missing" });
      return;
    }
    let [folderSnap, existDownload] = await Promise.all([
      firestore.collection("Folders").doc(folderId).get(),
      firestore
        .collection("Folders")
        .doc(folderId)
        .collection("Downloads")
        .where("owner", "==", uid)
        .get(),
    ]);
    if (!folderSnap.exists) {
      res.status(500).json({
        success: false,
        message: "The requested folder does not exist",
      });
      return;
    }
    if (!existDownload.empty && !isbackUp) {
      res.status(500).json({
        success: false,
        message: "The requested folder has already been downloaded",
      });
      return;
    }
    const currentDownload = existDownload.docs?.[0]?.data();
    const folderData = folderSnap.data();
    if (folderData.id === uid) {
      res.status(500).json({
        success: false,
        message: "This content is your property",
      });
      return;
    }
    if (folderData.privacy !== "Public") {
      res.status(500).json({
        success: false,
        message: "The content you are trying to download is not public",
      });
      return;
    }
    const updatedAt = new Date().getTime();
    const folder = {
      title: folderData.title,
      privacy: "Private",
      customOrder: -updatedAt,
      isDownload: true,
      isSync: !(isbackUp && currentDownload),
      hashBackUp: false,
      ref: {
        id: folderId,
        collection: "Folders",
        lastUpdate: updatedAt,
        owner: folderData.id,
      },
      id: uid,
      reviews: folderData?.reviews || 0,
      ratings: folderData?.ratings || 0,
    };
    if (isbackUp && currentDownload) {
      folder.hashBackUp = true;
      folder.backUpRef = {
        id: currentDownload.id,
        collection: "Folders",
        lastUpdate: updatedAt,
        owner: folderData.id,
      };
    }
    if (isbackUp && (folderData?.backUpRef?.id || currentDownload?.currentBackUp)) {
      await deleteFolderAndSubCollections(
        folderData?.backUpRef?.id || currentDownload?.currentBackUp,
      );
    }

    const copy = { ...folder };
    copy.isDownload = false;
    const data = await firestore.collection("Folders").add(folder);
    let createCopy = null;
    if (!isbackUp) {
      createCopy = await firestore.collection("Folders").add(copy);
    }
    //Si es una copia, añadir el campo isCopy en la referencia actual (El folder que estaba antes) y la id del nuevo folder
    await folderSnap.ref
      .collection("Downloads")
      .doc(data.id)
      .set({
        //Validar para una copia, usando update y añadiendo los campos isBackup y currentDownload = este nuevo folder
        id: data.id,
        updatedAt,
        isSync: !(isbackUp && currentDownload), //only in Folders
        owner: uid,
        parentType: "Folders",
        currentBackUp: currentDownload?.id || "",
      });
    if (isbackUp && currentDownload) {
      await firestore
        .collection("Folders")
        .doc(currentDownload.id)
        .update({
          disableUpdate: true,
          isBackup: true,
          backUpRef: {
            id: data.id,
            collection: "Folders",
            lastUpdate: updatedAt,
            owner: folderData.id,
          },
        });
      await folderSnap.ref.collection("Downloads").doc(currentDownload.id).delete();
    }
    const content = await getContent({ folderId });
    await makeContent(content, data.id, folder, uid, folderData.id);
    if (!isbackUp) {
      await makeContent(content, createCopy.id, folder, uid, folderData.id);
    }
    res.send({ success: true, folderId: data.id });
  });
  app.post("/api/downloads/:folderId/createInFolder", async (req, res) => {
    const { folderId } = req.params;
    const { user, uid } = req.currentUser;
    if (!folderId) {
      res.status(500).json({ success: false, message: "fields are missing" });
      return;
    }
    let folderSnap = await firestore.collection("Folders").doc(folderId).get();
    if (!folderSnap.exists) {
      res.status(500).json({
        success: false,
        message: "The requested folder does not exist",
      });
      return;
    }
    const folderData = folderSnap.data();
    if (folderData.id !== uid) {
      res.status(500).json({
        success: false,
        message: "This content isn't your property",
      });
      return;
    }
    if (!folderData.isDownload) {
      res.status(500).json({
        success: false,
        message: "The content you are trying to duplicate is not a Download",
      });
      return;
    }
    const updatedAt = new Date().getTime();
    const folder = {
      title: folderData.title,
      description: folderData?.description || "",
      hashBackUp: false,
      ref: folderData.ref,
      id: folderData.id,
      reviews: folderData?.reviews || 0,
      ratings: folderData?.ratings || 0,
    };

    const data = await firestore.collection("Folders").add(folder);
    const content = await getContent({ folderId });
    await makeContent(content, data.id, folder, uid, folder.ref.owner);
    res.send({ success: true, folderId: data.id });
  });
  app.post("/api/downloads/:folderId/restore", async (req, res) => {
    const { folderId } = req.params;
    const { user, uid } = req.currentUser;
    if (!folderId) {
      return res.status(500).json({
        success: false,
        message: "fields are missing",
      });
    }

    let folderSnap = await firestore.collection("Folders").doc(folderId).get();
    if (!folderSnap.exists) {
      return res.status(500).json({
        success: false,
        message: "The requested folder does not exist",
      });
    }
    const folderData = folderSnap.data();
    if (!folderData.isDownload) {
      return res.status(500).json({
        success: false,
        message: "This folder is not a Download",
      });
    }
    if (folderData.id !== uid) {
      return res.status(500).json({
        success: false,
        message: "This download is not your property",
      });
    }
    if (!folderData.hashBackUp || !folderData.backUpRef?.id || !folderData.ref?.id) {
      return res.status(500).json({
        success: false,
        message: "This download hasn't a backUp 1",
      });
    }
    let backUpFolderSnap = await firestore.collection("Folders").doc(folderData.backUpRef.id).get();
    if (!backUpFolderSnap.exists) {
      return res.status(500).json({
        success: false,
        message: "This download hasn't a backUp 2",
      });
    }
    const backUpFolderData = backUpFolderSnap.data();
    let batch = firestore.batch();
    batch.update(backUpFolderSnap.ref, {
      backUpRef: null,
      disableUpdate: false,
      hashBackUp: false,
      isBackup: false,
    });
    batch.delete(
      firestore.collection("Folders").doc(folderData.ref.id).collection("Downloads").doc(folderId),
    );
    batch.set(
      firestore
        .collection("Folders")
        .doc(folderData.ref.id)
        .collection("Downloads")
        .doc(folderData.backUpRef.id),
      {
        //Validar para una copia, usando update y añadiendo los campos isBackup y currentDownload = este nuevo folder
        id: folderData.backUpRef.id,
        updatedAt: backUpFolderData?.updatedAt || 0,
        isSync: false, //only in Folders
        owner: uid,
        parentType: "Folders",
      },
    );
    await batch.commit();
    await deleteFolderAndSubCollections(folderId);

    res.send({
      success: true,
      folderId: folderData.backUpRef.id,
    });
  });
};

const customActions = async ({ collectionId, contentData, uid, content, ownerUid }) => {
  const folderSnap = await firestore
    .collection(collectionId)
    .where("FolderId", "==", contentData.FolderId)
    .where(collectionId === "SubFolders" ? "id" : "userId", "==", uid)
    .where("ref.id", "==", content.data?.itemId)
    .where("ref.owner", "==", ownerUid)
    .select(...["FolderId"])
    .get();
  let id = null;
  functions.logger.log(`collection: ${collectionId} 
    FolderId: ${contentData.FolderId}
    userId: ${uid}
    ref.id: ${content.data?.itemId}
    ref.owner: ${ownerUid};
  `);

  if (!folderSnap.empty) {
    const doc = folderSnap.docs[0];
    id = doc.id;
    await doc.ref.update(contentData);
  } else {
    const fData = await firestore.collection(collectionId).add(contentData);
    id = fData.id;
  }

  if (collectionId === "SubFolders" && content.collection?.length) {
    await makeContent(content.collection, id, contentData, uid, ownerUid, customActions);
  }

  if (collectionId === "assetsCollection" && content?.collection?.length) {
    await Promise.all(
      content?.collection.map(async (a) => {
        const { collectionId: cID, details } = a;

        const { itemId, ...rest } = details;
        const assetsProduct = await firestore
          .collection(cID)
          .where("assetsId", "==", id)
          .where("ref.id", "==", itemId)
          .where("ref.owner", "==", ownerUid)
          .select(...["assetsId"])
          .get();
        let idA = "";
        const data = {
          ...rest,
          assetsId: id,
          createdAt: contentData?.createdAt,
          updatedAt: contentData?.updatedAt,
          isDownload: true,
          isSync: true,
          type: cID,
          ref: {
            id: itemId,
            collection: cID,
            lastUpdate: contentData?.updatedAt,
            owner: ownerUid || "",
          },
        };
        if (!assetsProduct.empty) {
          const doc = assetsProduct.docs[0];
          idA = doc.id;
          await doc.ref.update(data);
        } else {
          const fData = await firestore.collection(cID).add(data);
          idA = fData.id;
        }
      }),
    );
  }
  if (collectionId === "testCollections" && content?.collection?.length) {
    await Promise.all(
      content?.collection.map(async (a) => {
        const { collectionId: cID, details } = a;
        const { itemId, ...rest } = details;
        const testCollectionsSet = await firestore
          .collection(cID)
          .where("testCollectionId", "==", id)
          .where("ref.id", "==", itemId)
          .where("ref.owner", "==", ownerUid)
          .select(...["testCollectionId"])
          .get();
        let idA = "";
        const data = {
          ...rest,
          testCollectionId: id,
          createdAt: contentData?.createdAt,
          updatedAt: contentData?.updatedAt,
          isDownload: true,
          isSync: true,
          type: cID,
          ref: {
            id: itemId,
            collection: cID,
            lastUpdate: contentData?.updatedAt,
            owner: ownerUid || "",
          },
        };
        if (!testCollectionsSet.empty) {
          const doc = testCollectionsSet.docs[0];
          idA = doc.id;
          await doc.ref.update(data);
        } else {
          const fData = await firestore.collection(cID).add(data);
          idA = fData.id;
        }
      }),
    );
  }
};
module.exports.controllerDownloads = (app) => {
  app.post("/downloads/:folderId/synchronizeFolder", async (req, res) => {
    const { docPath, filterDocs } = req.body;
    const { folderId } = req.params;
    const hasfilterDocs = filterDocs && Array.isArray(filterDocs) && filterDocs.length;
    if (!folderId) return res.status(500).send({ error: "Folder not found" });
    try {
      functions.logger.log({
        hasfilterDocs,
        filterDocs,
        folderId,
      });
      if (!hasfilterDocs) {
        await firestore
          .collection("ContentEvents")
          .doc(folderId)
          .collection("DownloadsEvent")
          .doc(folderId)
          .delete();
      }
      const folderSnap = await firestore.collection("Folders").doc(folderId).get();
      if (!folderSnap.exists) return res.status(500).send({ error: "Folder not found" });
      const folderData = folderSnap.data();
      const [payload, content] = await Promise.all([
        firestore.collection("Folders").doc(folderId).collection("Downloads").get(),
        getContent({ folderId }),
      ]);
      functions.logger.log("childs: " + payload.docs.length);

      await Promise.all(
        payload.docs
          .filter((doc) => {
            if (!hasfilterDocs) return true;
            return filterDocs.includes(doc.id);
          })
          .map(async (doc) => {
            const folderRef = firestore.collection("Folders").doc(doc.id);
            const existSnap = await folderRef.get();
            const existFolder = existSnap.exists;
            const { isSync, updatedAt, owner: uid, currentBackUp } = doc.data() || {};
            if (!uid) {
              return functions.logger.log(`Folder ${doc.id} does not have the owner configured.`);
            }
            if (currentBackUp && isSync) {
              doc.ref.update({ currentBackUp: null });
              if (existFolder) {
                await folderRef.update({ backUpRef: null, hashBackUp: false });
              }
              const taskDelete = await firestore
                .collection("ContentEvents")
                .doc(currentBackUp)
                .collection("DeleteEvents")
                .doc(currentBackUp)
                .get();
              if (taskDelete?.data()?.taskName) {
                try {
                  taskDelete.ref.delete();
                  const tasksClient = new CloudTasksClient();
                  await tasksClient.deleteTask({ name: taskDelete.data().taskName });
                } catch (error) {}
              }
              await deleteFolderAndSubCollections(currentBackUp);
            }

            await doc.ref.update({ updatedAt: folderData?.updatedAt });
            if (!isSync) {
              if (!existFolder) {
                return functions.logger.log(
                  `Folder ${doc.id} does not have synchronization enabled.`,
                );
              }
              await folderRef.update({
                "ref.lastUpdate": folderData?.updatedAt || updatedAt,
                reviews: folderData?.reviews || 0,
                ratings: folderData?.ratings || 0,
              });
              if (updatedAt < folderData?.updatedAt) {
                await sendNotifications(uid, DOWNLOAD_CONTENT_TYPE, {
                  updatedAt,
                  folderId: doc.id,
                  title: folderData.title,
                  isSync,
                });
              }
              return functions.logger.log(
                `Folder ${doc.id} does not have synchronization enabled.`,
              );
            }

            // firestore
            //     .collection("Folders")
            //     .doc(doc.id).delete()
            if (!existFolder) {
              return;
            }
            await folderRef.update({
              title: folderData.title,
              privacy: "Private",
              customOrder: folderData?.customOrder || -(folderData?.updatedAt || updatedAt),
              isDownload: true,
              isSync: isSync || false,
              "ref.lastUpdate": folderData?.updatedAt || updatedAt,
              reviews: folderData?.reviews || 0,
            });
            if (updatedAt >= folderData?.updatedAt) {
              return functions.logger.log(`Folder ${doc.id} up to date.`);
            }
            await makeContent(
              content,
              doc.id,
              folderData,
              uid,
              folderData.id,
              async ({ collectionId, contentData, content }) => {
                return customActions({
                  collectionId,
                  contentData,
                  uid,
                  content,
                  ownerUid: folderData.id,
                });
              },
            );
            await sendNotifications(uid, DOWNLOAD_CONTENT_TYPE, {
              updatedAt,
              folderId: doc.id,
              title: folderData.title,
              isSync,
            });
            return doc.data();
          }),
      );

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  app.delete("/downloads/:folderId/deleteBuckUp", async (req, res) => {
    const { docPath } = req.body;
    const { folderId } = req.params;
    if (!folderId) return res.status(500).send({ error: "Folder not found" });
    let batch = firestore.batch();
    let error = "";
    try {
      await firestore
        .collection("ContentEvents")
        .doc(folderId)
        .collection("DeleteEvents")
        .doc(folderId)
        .delete();
      let transition = await firestore.runTransaction(async (t) => {
        const folderRef = firestore.collection("Folders").doc(folderId);
        const folderSnap = await t.get(folderRef);
        if (!folderSnap.exists) {
          error = "Folder not found";
          return;
        }
        const folderData = folderSnap.data();
        if (
          !folderData.isBackup ||
          !folderData.backUpRef?.id ||
          folderId === folderData.backUpRef?.id
        ) {
          error = "Folder not is backUp";
          return;
        }
        const folderRef2 = firestore.collection("Folders").doc(folderData.backUpRef.id);
        const realFolderSnap = await t.get(folderRef2);
        if (realFolderSnap.exists) {
          const ownerFolderId = folderData.ref?.id || realFolderSnap.data()?.folderData.ref?.id;
          if (ownerFolderId) {
            const ref = firestore
              .collection("Folders")
              .doc(ownerFolderId)
              .collection("Downloads")
              .doc(folderData.backUpRef.id);
            t.update(ref, {
              currentBackUp: null,
            });
          }
          t.update(folderRef2, {
            backUpRef: null,
            isBackup: false,
            hashBackUp: false,
          });
        }
      });
      if (error) {
        functions.logger.log(error);
        return res.status(500).send({ error });
      }
      await deleteFolderAndSubCollections(folderId);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
};
