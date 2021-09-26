// this is safe to delete at the moment
import { diffWords, createTwoFilesPatch, structuredPatch } from 'diff';

const oldStr = '나는 짱이다 근데 이거 진짜 됨?';
const newStr = '짱이다 근데 아이고 말이야';
const changes = diffWords(oldStr, newStr);

const oldFileName = 'oldFileName';
const newFileName = 'newFileName';
const oldHeader = 'oldHeader';
const newHeader = 'newHeader';

const patch = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader);
export { changes, patch };
