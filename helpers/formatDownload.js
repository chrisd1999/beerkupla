const formatDownload = (fileName, recipeId) => {
  const extension = fileName.split('.')[1];
  return `${recipeId}.${extension}`;
};

exports.formatDownload = formatDownload;
