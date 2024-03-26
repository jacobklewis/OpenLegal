import { randomUUID } from "crypto";
import mongoose from "mongoose";
let Project = mongoose.model("Project");

exports.getProject = async function (req, res) {
  try {
    res.json(req.project);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
exports.updateProject = async function (req, res) {
  try {
    let newProj = new Project(req.body);
    let status = await Project.updateOne(
      {
        id: req.project.id,
      },
      {
        name: newProj.name,
        documentIds: newProj.documentIds,
        owner: newProj.owner,
      }
    ).exec();
    res.json(status);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
exports.deleteProject = async function (req, res) {
  try {
    let status = await Project.deleteOne({
      id: req.project.id,
    }).exec();
    res.json(status);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.addProject = async function (req, res) {
  try {
    let newProj = new Project(req.body);
    newProj.id = randomUUID();
    newProj.token = Buffer.from(randomUUID()).toString("base64");
    res.json(await newProj.save());
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
exports.getProjects = async function (req, res) {
  try {
    res.json(await Project.find({}).exec());
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
