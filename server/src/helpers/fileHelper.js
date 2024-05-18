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

const moveImage = async (currentImage, uri) => {
  if (currentImage) {
    const oldImagePath = path.join("public", "uploads", currentImage.filename);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  if (!uri) return null;
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
  await image.destroy({ transaction });
};

module.exports = {
  saveImageFile,
  uploadImage,
  getFile,
  moveImage,
  deleteImage,
};
