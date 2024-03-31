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
  fs.writeFileSync(imagePath, file.buffer);

  return { filename, extension, filesize, url };
};

const updateImage = async (model, file) => {
  if (!file) return null;

  let image = await Image.findByPk(model.imageId);
  if (image) {
    const oldImagePath = path.join("public", "files", image.filename);
    fs.unlinkSync(oldImagePath);
  } else {
    image = new Image();
  }

  const newImageData = await saveImageFile(file, "files");
  image.filename = newImageData.filename;
  image.filetype = newImageData.extension.replace(".", "");
  image.filesize = newImageData.filesize;
  image.url = newImageData.url;
  await image.save();

  return image.id;
};

const deleteImage = async (image, folder) => {
  if (!image) return;
  const imagePath = path.join("public", folder, image.filename);
  await fs.unlinkSync(imagePath);
  await image.destroy();
};

module.exports = { saveImageFile, updateImage, deleteImage };
