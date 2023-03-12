import { FiltersDto } from '@/common/dto/filters.dto';

export const buildFilterCondition = (filtersDto: FiltersDto) => {
    const params = {} as any;
    const conditions = [];

    const proportion = filtersDto.proportion ?? undefined;
    const upscalesOnly = filtersDto.upscales_only === 'true';

    const includeWords = filtersDto.includeWords ?
        filtersDto.includeWords.split(/[,\s]+/).filter(Boolean)
        : undefined;
    const excludeWords = filtersDto.excludeWords ?
        filtersDto.excludeWords.split(/[,\s]+/).filter(Boolean)
        : undefined;

    if (upscalesOnly) {
        conditions.push(`content.isUpscaled = :isUpscaled`);
        params.isUpscaled = true;
    }
    if (proportion) {
        conditions.push(`content.proportion = :proportion`);
        params.proportion = proportion;
    }
    if (includeWords) {
        const includeParams = includeWords.reduce((params, word, i) => {
            params[`includesWord${ i }`] = `%${ word }%`;
            return params;
        }, {});

        const includesOperator = filtersDto.includeAllWords ? 'AND' : 'OR';
        const includesCondition = includeWords
            .map((word, i) => `content.keywords LIKE :includesWord${ i }`)
            .join(` ${ includesOperator } `);
        conditions.push(`(${ includesCondition })`);
        Object.assign(params, includeParams);
    }
    if (excludeWords) {
        const excludeParams = excludeWords.reduce((params, word, i) => {
            params[`excludesWord${ i }`] = `%${ word }%`;
            return params;
        }, {});

        const excludesCondition = excludeWords
            .map((word, i) => `content.keywords NOT LIKE :excludesWord${ i }`)
            .join(` AND `);
        conditions.push(`(${ excludesCondition })`);
        Object.assign(params, excludeParams);
    }

    const condition = conditions.join(` AND `);
    return { condition, params };
};