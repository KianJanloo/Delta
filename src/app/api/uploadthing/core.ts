/* eslint-disable */
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Uploaded file data:", file);

      const fileId = (file as any).id || (file as any).fileId || "unknown-id";
      const url = `https://yourcdn.com/files/${fileId}`;

      return {
        uploadedBy: metadata.userId,
        url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
