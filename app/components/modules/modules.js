import React from 'react';
import { Attributes, reduce as attributesReduce, MODULE_TYPE as ATTRIBUTES_MODULE } from './attributes/attributes';

export const MODULES = {
    [ATTRIBUTES_MODULE]: { component: Attributes, reduce: attributesReduce }
};