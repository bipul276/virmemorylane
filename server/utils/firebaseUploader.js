const admin = require("firebase-admin");
const fs = require("fs");

const bucket = admin.storage().bucket();

async function uploadImageToFirebase(localFilePath, originalName) {
    const fileName = `images/${Date.now()}-${originalName}`;
    const file = bucket.file(fileName);

    try {
      await bucket.upload(localFilePath, { destination: fileName });
      console.log("File uploaded to Firebase:", fileName);
    } catch (uploadError) {
      console.error("Error uploading file to Firebase:", uploadError);
      throw uploadError;
    }

    try {
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2030",
      });
      console.log("Generated signed URL:", url);

      // Delete the temporary file
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.error("Failed to delete temp file:", err);
      }

      return url;
    } catch (urlError) {
      console.error("Error generating signed URL:", urlError);
      throw urlError;
    }
  }


async function deleteImageFromFirebase(firebaseUrl) {
  const baseUrl = `https://storage.googleapis.com/${bucket.name}/`;
  const urlWithoutQuery = firebaseUrl.split('?')[0]; // Remove query parameters
  const filePath = urlWithoutQuery.replace(baseUrl, "");
  const file = bucket.file(filePath);
  try {
    await file.delete();
    console.log(`Deleted file: ${filePath}`);
  } catch (error) {
    console.error("Error deleting image from Firebase:", error);
  }
}

module.exports = { uploadImageToFirebase, deleteImageFromFirebase };
