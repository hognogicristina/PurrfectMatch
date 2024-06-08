const fs = require("fs");
const path = require("path");
const { Image } = require("../../models");

const saveImageFile = async (file, folder) => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const extension = path.extname(file.originalname);
  const filename = `${uniqueSuffix}${extension}`;
  const imagePath = path.join("public", folder, filename);
  const filesize = file.size;
  const url = `${process.env.SERVER_BASE_URL}/${folder}/${filename}`;

  const uri = `public://${folder}/${filename}`;
  fs.writeFileSync(imagePath, file.buffer);

  return { filename, extension, filesize, url, uri };
};

const uploadImage = async (file, folder) => {
  if (!file) return null;
  let image = new Image();

  const newImageData = await saveImageFile(file, folder);
  image.filename = newImageData.filename;
  image.filetype = newImageData.extension.replace(".", "");
  image.filesize = newImageData.filesize;
  image.url = newImageData.url;
  image.uri = newImageData.uri;
  await image.save();

  return image;
};

const getFile = async (absolutePath, filename) => {
  const fileBuffer = fs.readFileSync(absolutePath);

  return {
    fieldname: "file",
    originalname: filename,
    encoding: "7bit",
    mimetype: "multipart/form-data",
    buffer: fileBuffer,
    size: fileBuffer.length,
  };
};

const eliminateImageUser = async (user, uri) => {
  if (!uri.includes("temporary-uploads")) return null;

  if (user) {
    const oldImage = await Image.findOne({ where: { userId: user.id } });

    if (oldImage) {
      const oldImagePath = path.join("public", "uploads", oldImage.filename);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      await deleteImage(oldImage, "uploads", null);
    }
  }

  return null;
};

const eliminateImageCat = async (cat, newUris) => {
  const oldImages = await Image.findAll({ where: { catId: cat.id } });
  const oldUris = oldImages.map((img) => img.uri);

  const urisToDelete = oldUris.filter((uri) => !newUris.includes(uri));
  const urisToAdd = newUris.filter((uri) => !oldUris.includes(uri));

  for (const uri of urisToDelete) {
    const oldImage = oldImages.find((img) => img.uri === uri);
    if (oldImage) {
      const oldImagePath = path.join("public", "uploads", oldImage.filename);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      await oldImage.destroy();
    }
  }

  return urisToAdd;
};

const moveImage = async (uri) => {
  if (!uri) return null;
  if (!uri.includes("temporary-uploads")) return null;

  let image = await Image.findOne({ where: { uri: uri } });
  if (!image) return null;

  const imagePath = path.join("public", "temporary-uploads", image.filename);
  const file = await getFile(imagePath, image.filename);
  const newImage = await uploadImage(file, "uploads");
  await deleteImage(image, "temporary-uploads", null);

  return newImage;
};

const deleteImage = async (image, folder, transaction) => {
  if (!image) return;
  const imagePath = path.join("public", folder, image.filename);
  if (fs.existsSync(imagePath)) await fs.unlinkSync(imagePath);
  if (transaction) await image.destroy({ transaction });
};

module.exports = {
  saveImageFile,
  uploadImage,
  getFile,
  eliminateImageUser,
  eliminateImageCat,
  moveImage,
  deleteImage,
};
