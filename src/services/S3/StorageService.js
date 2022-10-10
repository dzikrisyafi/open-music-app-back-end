const AWS = require('aws-sdk');

class StorageService {
  constructor() {
    this._S3 = new AWS.S3();
  }

  writeFile(file, meta) {
    const parameter = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: +new Date() + meta.filename,
      Body: file._data,
      ContentType: meta.headers['content-type'],
    };

    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data.Location);
      });
    });
  }

  deleteFile(file) {
    const parameter = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file,
    };

    return new Promise((resolve, reject) => {
      this._S3.deleteObject(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
  }
}

module.exports = StorageService;
