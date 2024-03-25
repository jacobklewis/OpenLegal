import regions from "../boot/regions";
import languages from "../boot/languages";
exports.getLocales = async function (req, res) {
  res.json({
    regions: regions,
    languages: languages,
  });
};
