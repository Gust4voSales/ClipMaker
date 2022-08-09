// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Data = {
  name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const ffmpeg = createFFmpeg({ log: true });
  const dir = path.resolve("public", "overlays");

  // (async () => {
  //   await ffmpeg.load();
  //   ffmpeg.FS("writeFile", "test.mp4", await fetchFile(dir + "/fire.mp4"));
  //   await ffmpeg.run("-i", "test.mp4", "test.avi");
  //   await fs.promises.writeFile("./test.avi", ffmpeg.FS("readFile", "test.avi"));

  //   var stat = fs.statSync("./test.avi");
  //   res.writeHead(200, {
  //     "Content-Type": "video/avi",
  //     "Content-Length": stat.size,
  //   });

  //   var readStream = fs.createReadStream("./test.avi");
  //   // We replaced all the event handlers with a simple call to readStream.pipe()
  //   readStream.pipe(res);
  // })();

  // res.status(200).json({ name: "John Doe" });
}
