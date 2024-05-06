/*
*  {field: 1, operator: $lk, value: 1, value: 2}
* */

/* recibe un arreglo de objetos y lo transforma en una condicion */
function getConditionalFormat(options) {
    if (options && options.length > 0) {
        let hasOr = false;
        let conditions = options.map(item => {
            if(item != "$or") {
                if (!item.moreValues) {
                    return (item.field + item.operator + item.value)
                } else {
                    if(item.moreValues && Array.isArray(item.moreValues)) {
                        item.moreValues = item.moreValues.join("::");
                    } else {
                        item.moreValues = item.moreValues;
                    }
                    return (item.field + item.operator + item.value + "::" + item.moreValues)
                }
            } else {
                hasOr = true;
            }
        }).filter(item => item !== undefined);
        if(hasOr){
            conditions = conditions.join("$or");
        }else {
            conditions = conditions.join("|");
        }
        return conditions;
    }
    return null;
}

/* Construye un formato valido para las peticiones GET (URL) */
function buildHttpGetQuery(cond = null, limit = null, offset = null, order = false) {
    const data = {};
    if (cond) {
        data.conditional = cond;
    }
    if (limit) {
        data.limit = limit;
    }
    if (offset || offset === 0) {
        data.offset = offset;
    }
    if (order) {
        data.order = order.field;
        data.orderType = order.type;
    }

    return urlSearchParams(data);
}
function urlSearchParams(data) {
    return new URLSearchParams(data);
}

function buildCondition(field, value, operator = null, moreValues = []) {
    let condition;
    if (operator === null) {
        condition = {field, value, operator: "::"};
    } else if (moreValues.length > 0) {
        condition = {field, value, operator, moreValues};
    } else {
        if ([OPERATORS.NULL, OPERATORS.NOT_NULL].includes(operator) || [OPERATORS.TRUE, OPERATORS.FALSE].includes(operator)) {
            condition = {field, value: "", operator};
        } else {
            condition = {field, value, operator};
        }
    }
    return condition;
}

/* recibe field, value, operador y en caso de tener 2 o mas valores moreValues (Array) */
class Condition {
    condition = [];
    addOr() {
        this.condition.push("$or");
    }
    add(field, value, operator = null, moreValues = []) {
        this.condition.push(buildCondition(field, value, operator, moreValues))
    }
    all() {
        return this.condition;
    }
}

const OPERATORS = {
    EQUAL: '::',
    NOT_EQUAL: '$ne',
    NULL: '$null',
    NOT_NULL: '$nnull',
    TRUE: '$true',
    FALSE: '$false',
    NOT_EMPTY: '$nempty',
    EMPTY: '$empty',
    NOT_LIKE: '$nlk',
    LIKE: '$lk',
    NOT_BETWEEN: '$nbt',
    BETWEEN: '$bt',
    LESS_THAN_OR_EQUAL: '$lte',
    LESS_THAN: '$lt',
    GREATER_THAN_OR_EQUAL: '$gte',
    GREATER_THAN: '$gt',
    NOT_IN: '$nin',
    IN: '$in',
    COUNT: 'count',
};

const Conditionals = {
    Condition,
    urlSearchParams,
    buildHttpGetQuery,
    getConditionalFormat,
    OPERATORS,
    buildCondition
};

export default Conditionals;
