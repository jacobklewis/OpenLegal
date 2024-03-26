import regions from "./regions";
import languages from "./languages";

function getRegionLanguages(obj) {
    const allRegions = obj
      .reduce((arr, curr) => {
        if (arr[curr.regionCode] == undefined) {
          arr[curr.regionCode] = [curr.languageCode];
        } else {
          arr[curr.regionCode].push(curr.languageCode);
        }
        return arr;
      }, {})
    const allRegionsMapped = Object.keys(allRegions).map((regCode)=>{
      const regLangs = allRegions[regCode];
      return {
        ...regions.find((x) => x.code.toLocaleLowerCase() == regCode.toLocaleLowerCase()),
        languages: regLangs.reduce((arr, langCode) => {
            if (!arr.find((x)=>x.code == langCode)){
                arr.push(languages.find((x) => x.code.toLocaleLowerCase() == langCode.toLocaleLowerCase()))
            }
            return arr
        }, [])
      }
    })
    return allRegionsMapped;
}

export { getRegionLanguages };