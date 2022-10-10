const Joi = require('joi');

const ExportPlaylistSongsSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportPlaylistSongsSchema;
