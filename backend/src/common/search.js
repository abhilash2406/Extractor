import { Op } from 'sequelize';

const SearchType = {
    STARTS_WITH: 'STARTS_WITH',
    EACH_WORD: 'EACH_WORD',
    CONTAINS: 'CONTAINS',
};

const CaseType = {
    SENSITIVE: 'SENSITIVE',
    INSENSITIVE: 'INSENSITIVE',
};

const escapeSearchStr = (str) => {
    return str?.replace(/[%_]/g, '\\$&');
};

const searchQry = (str, type = SearchType.CONTAINS, caseType = CaseType.INSENSITIVE) => {
    if (!str) return null;

    const LikeMap = {
        [CaseType.INSENSITIVE]: Op.iLike,
        [CaseType.SENSITIVE]: Op.like,
    };

    const RegexpMap = {
        [CaseType.INSENSITIVE]: Op.iRegexp,
        [CaseType.SENSITIVE]: Op.regexp,
    };

    switch (type) {
        case SearchType.STARTS_WITH:
            return { [LikeMap[caseType]]: `${escapeSearchStr(str)}%` };
        case SearchType.EACH_WORD:
            return { [RegexpMap[caseType]]: `\\m${str}` };
        case SearchType.CONTAINS:
            return { [LikeMap[caseType]]: `%${escapeSearchStr(str)}%` };
        default:
            return null;
    }
};

export default searchQry;
