async function imageToDTO(image) {
  return {
    url: image.url,
    uri: image.uri,
    filesize: image.filesize,
    filetype: image.filetype,
  };
}

module.exports = { imageToDTO };
