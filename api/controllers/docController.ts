import regions from "../boot/regions";
import languages from "../boot/languages";
import mongoose from "mongoose";
import { getRegionLanguages } from "../boot/localeTools";
import exp = require("constants");
let Doc = mongoose.model("Doc");

exports.getAllDocs = async function (req, res) {
  try {
    if (!req.project) {
      res.status(404).send({
        status: "Project not found",
      });
      return;
    }
    const regionCode = req.query.region?.toLocaleLowerCase();
    const languageCode = req.query.language?.toLocaleLowerCase();
    if (
      regionCode &&
      !regions.find((r) => r.code.toLocaleLowerCase() == regionCode)
    ) {
      res.status(400).send({
        status: "document region not valid",
      });
      return;
    }
    if (
      languageCode &&
      !languages.find((l) => l.code.toLocaleLowerCase() == languageCode)
    ) {
      res.status(400).send({
        status: "document language not valid",
      });
      return;
    }
    const q = {
      projectId: req.project.id,
      archived: false,
    };
    if (regionCode) {
      q["regionCode"] = regionCode;
    }
    if (languageCode) {
      q["languageCode"] = languageCode;
    }
    const docs = await Doc.find(q).exec();
    res.json(docs);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getAllDocsPreview = async function (req, res) {
  try {
    if (!req.project) {
      res.status(404).send({
        status: "Project not found",
      });
      return;
    }
    const q = {
      projectId: req.project.id,
      archived: false,
    };
    const docs = await Doc.find(q).exec();
    const tree = {};
    docs.forEach((doc) => {
      const { id, regionCode, languageCode } = doc;
      if (!tree[id]) {
        tree[id] = {};
      }
      if (!tree[id][regionCode]) {
        tree[id][regionCode] = {};
      }
      tree[id][regionCode][languageCode] = {
        name: doc.name,
        version: doc.version,
        regionCode: doc.regionCode,
        languageCode: doc.languageCode,
      };
    });
    res.json(tree);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getProjectLocales = async function (req, res) {
  try {
    if (!req.project) {
      res.status(404).send({
        status: "Project not found",
      });
      return;
    }
    const docs = await Doc.find({
      projectId: req.project.id,
      archived: false,
    }).exec();
    if (docs.length == 0) {
      res.status(404).send({
        status: "no locales found",
      });
      return;
    }
    res.json({
      regions: getRegionLanguages(docs),
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getDoc = async function (req, res) {
  try {
    if (!req.project) {
      res.status(404).send({
        status: "Project not found",
      });
      return;
    }
    const doc = await Doc.findOne({
      projectId: req.project.id,
      id: req.params.docId,
      regionCode: req.params.regionCode.toLocaleLowerCase(),
      languageCode: req.params.languageCode.toLocaleLowerCase(),
      archived: false,
    }).exec();
    if (!doc) {
      res.status(404).send({
        status: "doc not found",
      });
      return;
    }
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getDocHistory = async function (req, res) {
  try {
    if (!req.project) {
      res.status(404).send({
        status: "Project not found",
      });
      return;
    }
    if (!req.writeAccess) {
      res.status(403).send({
        status: "Forbidden",
      });
      return;
    }
    const docs = await Doc.find({
      projectId: req.project.id,
      id: req.params.docId,
      regionCode: req.params.regionCode.toLocaleLowerCase(),
      languageCode: req.params.languageCode.toLocaleLowerCase(),
    }).exec();
    if (docs.length == 0) {
      res.status(404).send({
        status: "doc not found",
      });
      return;
    }
    res.json(docs);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getDocByHistoryId = async function (req, res) {
  try {
    if (!req.project) {
      res.status(404).send({
        status: "Project not found",
      });
      return;
    }
    if (!req.writeAccess) {
      res.status(403).send({
        status: "Forbidden",
      });
      return;
    }
    const doc = await Doc.findOne({
      projectId: req.project.id,
      id: req.params.docId,
      regionCode: req.params.regionCode.toLocaleLowerCase(),
      languageCode: req.params.languageCode.toLocaleLowerCase(),
      version: req.params.historyId,
    }).exec();
    if (!doc) {
      res.status(404).send({
        status: "doc not found",
      });
      return;
    }
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.updateDoc = async function (req, res) {
  try {
    if (!req.project) {
      res.status(404).send({
        status: "Project not found",
      });
      return;
    }
    if (!req.writeAccess) {
      res.status(403).send({
        status: "Forbidden",
      });
      return;
    }
    const projectId = req.project.id;
    const docId = req.params.docId;
    const regionCode = req.params.regionCode.toLocaleLowerCase();
    const languageCode = req.params.languageCode.toLocaleLowerCase();

    if (req.project.documentIds.indexOf(docId) === -1) {
      res.status(400).send({
        status: "document id not registered with project",
      });
      return;
    }
    if (
      regions.find((r) => r.code.toLocaleLowerCase() == regionCode) ===
      undefined
    ) {
      res.status(400).send({
        status: "document region not valid",
      });
      return;
    }
    if (
      languages.find((l) => l.code.toLocaleLowerCase() == languageCode) ===
      undefined
    ) {
      res.status(400).send({
        status: "document language not valid",
      });
      return;
    }

    let newDoc = new Doc(req.body);
    const existingDoc = await Doc.findOne({
      projectId: projectId,
      id: docId,
      regionCode: regionCode,
      languageCode: languageCode,
      archived: false,
    }).exec();
    if (existingDoc) {
      await Doc.updateOne(
        {
          projectId: projectId,
          id: docId,
          regionCode: regionCode,
          languageCode: languageCode,
          archived: false,
        },
        { archived: true }
      ).exec();
    }

    newDoc.id = docId;
    newDoc.projectId = req.project.id;
    newDoc.version = (existingDoc?.version || 0) + 1;
    newDoc.regionCode = regionCode;
    newDoc.languageCode = languageCode;
    newDoc.archived = false;
    res.json(await newDoc.save());
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getDocLocales = async function (req, res) {
  try {
    if (!req.project) {
      res.status(404).send({
        status: "Project not found",
      });
      return;
    }
    const docVariants = await Doc.find({
      projectId: req.project.id,
      id: req.params.docId,
      archived: false,
    }).exec();
    res.json({
      regions: getRegionLanguages(docVariants),
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
