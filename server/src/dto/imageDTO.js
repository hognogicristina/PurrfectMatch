async function transformImageToDTO(image) {
  return {
    url: image.url,
    uri: image.uri,
    filesize: image.filesize,
    filetype: image.filetype,
  };
}

module.exports = { transformImageToDTO };
