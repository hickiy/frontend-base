import { getDicts } from '@/api/system/dict/data';

// 字典缓存
const cachedDict = {};

function pruneDict(dictData) {
  const res = [];
  dictData?.forEach?.((dict) => {
    res.push({
      label: dict.dictLabel,
      value: dict.dictValue,
    });
  });
  return res;
}

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = {};
  const dictTypes = []
  args.forEach((dictType) => {
    if (cachedDict[dictType]) {
      res[dictType] = ref(cachedDict[dictType]);
    } else {
      res[dictType] = ref([]);
      dictTypes.push(dictType);
    }
  });
  if (dictTypes.length) {
    Promise.all(dictTypes.map(dictType => getDicts(dictType))).then(dictList => {
      dictTypes.forEach((dictType, index) => {
        res[dictType].value = cachedDict[dictType] = pruneDict(dictList[index]?.data);
      });
    });
  }
  return res;
}
