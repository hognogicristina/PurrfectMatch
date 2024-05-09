async function imageToDTO(image) {
  return {
    url: image.url ? image.url : null,
    uri: image.uri ? image.uri : null,
    filesize: image.filesize ? image.filesize : null,
    filetype: image.filetype ? image.filetype : null,
  };
}

module.exports = { imageToDTO };
