const AWS = require('aws-sdk');
const config = require('../../utils/config');

class StorageService {
  constructor() {
    this._S3 = new AWS.S3();
  }

  writeFile(file, meta) {
    const parameter = {
      Bucket: config.s3.bucketName,
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

  deleteFile(filename) {
    const parameter = {
      Bucket: config.s3.bucketName,
      Key: filename,
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
