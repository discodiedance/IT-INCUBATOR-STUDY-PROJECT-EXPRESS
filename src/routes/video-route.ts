// import { Router, Request, Response } from "express";
// import {
//   RequestWithParams,
//   RequestWithBody,
//   ErrorType,
//   RequestWithBodyAndParams,
//   Params,
// } from "../types/common";
// import { CreateVideoDto, UpdateVideoDto } from "../types/video/input";
// import { AvailableResolutions } from "../types/video/output";

// export const videoRoute = Router({});

// videoRoute.get("/videos", (req: Request, res: Response) => {
//   res.send(db.videos);
// });

// videoRoute.get(
//   "/videos/:id",
//   (req: RequestWithParams<Params>, res: Response) => {
//     const id = +req.params.id;

//     const video = db.videos.find((v) => v.id == id);

//     if (!video) {
//       res.sendStatus(404);
//       return;
//     }
//     res.send(video);
//   }
// );

// videoRoute.post(
//   "/videos",
//   (req: RequestWithBody<CreateVideoDto>, res: Response) => {
//     let errors: ErrorType = {
//       errorsMessages: [],
//     };

//     let { title, author, availableResolutions } = req.body;

//     if (typeof title !== "string") {
//       errors.errorsMessages.push({ message: "Invalid title", field: "title" });
//     } else if (title.trim().length < 1 || title.trim().length > 40) {
//       errors.errorsMessages.push({ message: "Invalid title", field: "title" });
//     }

//     if (typeof author !== "string") {
//       errors.errorsMessages.push({ message: "Invalid title", field: "author" });
//     } else if (author.trim().length < 1 || author.trim().length > 20) {
//       errors.errorsMessages.push({
//         message: "Invalid author",
//         field: "author",
//       });
//     }

//     if (
//       !availableResolutions ||
//       !Array.isArray(availableResolutions) ||
//       availableResolutions.length > AvailableResolutions.length ||
//       !availableResolutions.every((el) => AvailableResolutions.includes(el))
//     ) {
//       errors.errorsMessages.push({
//         message: "Invalid availableResolutions",
//         field: "availableResolutions",
//       });
//     }

//     if (errors.errorsMessages.length) {
//       res.status(400).send(errors);
//       return;
//     }

//     const createdAt = new Date();
//     const puiblicationDate = new Date();

//     puiblicationDate.setDate(createdAt.getDate() + 1);

//     const newVideo = {
//       id: +new Date(),
//       canBeDownloaded: false,
//       minAgeRestriction: null,
//       createdAt: createdAt.toISOString(),
//       publicationDate: puiblicationDate.toISOString(),
//       title,
//       author,
//       availableResolutions,
//     };

//     db.videos.push(newVideo);

//     res.status(201).send(newVideo);
//   }
// );

// videoRoute.put(
//   "/videos/:id",
//   (req: RequestWithBodyAndParams<Params, UpdateVideoDto>, res: Response) => {
//     const id = +req.params.id;

//     let errors: ErrorType = {
//       errorsMessages: [],
//     };

//     let {
//       title,
//       author,
//       availableResolutions,
//       canBeDownloaded,
//       minAgeRestriction,
//       publicationDate,
//     } = req.body;

//     if (
//       !title ||
//       typeof title !== "string" ||
//       title.trim().length < 1 ||
//       title.trim().length > 40
//     ) {
//       errors.errorsMessages.push({ message: "Invalid title", field: "title" });
//     }

//     if (
//       !author ||
//       typeof author !== "string" ||
//       author.trim().length < 1 ||
//       author.trim().length > 20
//     ) {
//       errors.errorsMessages.push({
//         message: "Invalid author",
//         field: "author",
//       });
//     }

//     if (
//       !availableResolutions ||
//       !Array.isArray(availableResolutions) ||
//       availableResolutions.length > AvailableResolutions.length ||
//       !availableResolutions.every((el) => AvailableResolutions.includes(el))
//     ) {
//       errors.errorsMessages.push({
//         message: "Invalid availableResolutions",
//         field: "availableResolutions",
//       });
//     }
//     if (!canBeDownloaded || typeof canBeDownloaded !== "boolean") {
//       errors.errorsMessages.push({
//         message: "Invalid canBeDownloaded",
//         field: "canBeDownloaded",
//       });
//     }

//     if (
//       typeof minAgeRestriction !== "undefined" &&
//       typeof minAgeRestriction == "number"
//     ) {
//       minAgeRestriction < 1 ||
//         (minAgeRestriction > 18 &&
//           errors.errorsMessages.push({
//             message: "Invalid minAgeRestriction",
//             field: "minAgeRestriction",
//           }));
//     } else {
//       minAgeRestriction = null;
//     }

//     if (!publicationDate || typeof publicationDate !== "string") {
//       errors.errorsMessages.push({
//         message: "Invalid publicationDate",
//         field: "publicationDate",
//       });
//     }
//     if (errors.errorsMessages.length) {
//       res.status(400).send(errors);
//       return;
//     }

//     const video = db.videos.find((v) => v.id == id);

//     if (!video) {
//       res.sendStatus(404);
//       return;
//     }

//     video.author = author;
//     video.title = title;
//     video.canBeDownloaded = canBeDownloaded;
//     video.minAgeRestriction = minAgeRestriction;
//     video.availableResolutions = availableResolutions;
//     video.publicationDate = publicationDate;

//     return res.sendStatus(204);
//   }
// );

// videoRoute.delete(
//   "/videos/:id",
//   (req: RequestWithParams<Params>, res: Response) => {
//     const id = +req.params.id;
//     const videoIndex = db.videos.findIndex((v) => v.id == id);
//     if (videoIndex == -1) {
//       res.sendStatus(404);
//       return;
//     }
//     db.videos.splice(videoIndex, 1);
//     res.sendStatus(204);
//   }
// );
