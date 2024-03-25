import { randomUUID } from "crypto";
import { stringify, parse } from "querystring";
import regions from "../boot/regions";
import languages from "../boot/languages";
import mongoose from "mongoose";
let Doc = mongoose.model("Doc");
let Project = mongoose.model("Project");

// TODO: Add query params for filtering by region/language
exports.getAllDocs = async function (req, res) {
  try {
    const docs = await Doc.find({
      projectId: req.project.id,
      archived: false,
    }).exec();
    res.json(docs);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
// TODO: nest languages in regions
exports.getProjectLocales = async function (req, res) {
  try {
    const docs = await Doc.find({
      projectId: req.project.id,
      archived: false,
    }).exec();
    const allRegions = docs
      .reduce((prev, curr, i, arr) => {
        if (arr.indexOf(curr.regionCode) === -1) {
          arr.push(curr.regionCode);
        }
        return arr;
      }, [])
      .map((regCode) => regions.find((x) => x.code == regCode));
    const allLanguages = docs
      .reduce((prev, curr, i, arr) => {
        if (arr.indexOf(curr.languageCode) === -1) {
          arr.push(curr.languageCode);
        }
        return arr;
      }, [])
      .map((langCode) => languages.find((x) => x.code == langCode));
    res.json({
      regions: allRegions,
      languages: allLanguages,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getDoc = async function (req, res) {
  try {
    const doc = await Doc.findOne({
      projectId: req.project.id,
      id: req.params.docId,
      regionCode: req.params.regionCode,
      languageCode: req.params.languageCode,
      archived: false,
    }).exec();
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.updateDoc = async function (req, res) {
  try {
    const projectId = req.project.id;
    const docId = req.params.docId;
    const regionCode = req.params.regionCode;
    const languageCode = req.params.languageCode;

    if (req.project.documentIds.indexOf(docId) === -1) {
      res.status(400).send({
        status: "document id not registered with project",
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
    const docVariants = await Doc.find({
      projectId: req.project.id,
      id: req.params.docId,
      archived: false,
    }).exec();
    const allRegions = docVariants
      .reduce((prev, curr, i, arr) => {
        if (arr.indexOf(curr.regionCode) === -1) {
          arr.push(curr.regionCode);
        }
        return arr;
      }, [])
      .map((regCode) => regions.find((x) => x.code == regCode));
    const allLanguages = docVariants
      .reduce((prev, curr, i, arr) => {
        if (arr.indexOf(curr.languageCode) === -1) {
          arr.push(curr.languageCode);
        }
        return arr;
      }, [])
      .map((langCode) => languages.find((x) => x.code == langCode));
    res.json({
      regions: allRegions,
      languages: allLanguages,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
