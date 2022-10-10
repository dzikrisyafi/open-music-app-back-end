const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumsService, storageService, albumsValidator, uploadsValidator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._albumsValidator = albumsValidator;
    this._uploadsValidator = uploadsValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._albumsValidator.validateAlbumPayload(request.payload);
    const albumId = await this._albumsService.addAlbum(request.payload);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._albumsValidator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._albumsService.editAlbumById(id, request.payload);
    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._albumsService.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const { id } = request.params;
    const oldCover = await this._albumsService.getOldCover(id);

    if (!oldCover) {
      const fileLocation = await this._storageService.writeFile(cover, cover.hapi);
      await this._albumsService.editAlbumCover(id, fileLocation);
    } else {
      const filename = oldCover.split('/').splice(-1)[0];
      await this._storageService.deleteFile(filename);
      const fileLocation = await this._storageService.writeFile(cover, cover.hapi);
      await this._albumsService.editAlbumCover(id, fileLocation);
    }

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
