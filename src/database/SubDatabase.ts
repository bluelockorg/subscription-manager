import { addRxPlugin, createRxDatabase } from "rxdb";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";

addPouchPlugin(require("pouchdb-adapter-idb"));
addRxPlugin(RxDBReplicationCouchDBPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);

const subscriptionsSchema = {
  title: "subscription schema",
  version: 0,
  description: "subscription details",
  primaryKey: "subId",
  type: "object",
  properties: {
    subId: {
      type: "string",
      maxLength: 16,
    },
    icon: {
      type: "string",
    },
    name: {
      type: "string",
    },
    startDate: {
      type: "string",
    },
    period: {
      type: "string",
    },
    nextDate: {
      type: "string",
    },
    price: {
      type: "string",
    },
    url: {
      type: "string",
    },
    note: {
      type: "string",
    },
    notify: {
      type: "boolean",
    },
    notificationId: {
      type: "string",
    },
    createdOn: {
      type: "string",
    },
  },
  required: ["subId", "name", "startDate", "period"],
};

let dbPromise: any = null;

const _create = async () => {
  console.info("DatabaseService: creating database");
  const db = await createRxDatabase({
    name: "subscriptionsdb",
    storage: getRxStoragePouch("idb"),
    multiInstance: false,
    ignoreDuplicate: true,
  }).then((db: any) => {
    console.info("DatabaseService: created database");
    return db;
  });

  await db.waitForLeadership().then(() => {
    console.info("isLeader now");
  });

  console.info("DatabaseService: creating collections");
  await db.addCollections({
    subscriptions: {
      schema: subscriptionsSchema,
    },
  });
  console.info("DatabaseService: created collection");

  return db;
};

export const get = () => {
  if (!dbPromise) dbPromise = _create();
  return dbPromise;
};
