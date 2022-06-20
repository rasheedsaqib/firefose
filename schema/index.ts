const Types = require('../types');

export interface SchemaType {
    [key: string]: {
        type: string;
        required?: boolean;
        default?: any;
        message?: string;
        ref?: string;
    };
}

interface OptionType {
    timestamp?: boolean;
}

export class Schema {
    private readonly schema;
    private readonly timestamp: boolean = false;

    constructor(schema: SchemaType, options?: OptionType) {
        this.schema = schema;
        if (options && options.timestamp) {
            this.timestamp = options.timestamp;
        }
    }

    validate(data: any): object {
        Object.keys(data).concat(Object.keys(this.schema)).forEach(key => {

            if (!this.schema[key]) {
                delete data[key];
                return;
            }

            if (!this.schema[key].type || !Object.keys(Types).map(type => Types[type]).includes(this.schema[key].type)) {
                throw new Error(`Invalid type for ${key} in schema`);
            }

            if (this.schema[key].type === Types.ObjectId && !this.schema[key].ref) {
                throw new Error(`Missing ref for ${key} in schema`);
            }

            if (this.schema[key].required && (!data || !data[key])) {
                throw new Error(`${key} is required`);
            }

            if (this.schema[key].default && !data[key]) {
                data[key] = this.schema[key].default;
            }

            if (this.schema[key].type === 'string' && data && data[key] && typeof data[key] !== 'string') {
                throw new Error(`${key} must be a string`);
            }

            if (this.schema[key].type === 'number' && data && data[key] && typeof data[key] !== 'number') {
                throw new Error(`${key} must be a number`);
            }

            if (this.schema[key].type === 'boolean' && data && data[key] && typeof data[key] !== 'boolean') {
                throw new Error(`${key} must be a boolean`);
            }

            if (this.schema[key].type === 'object' && data && data[key] && typeof data[key] !== 'object') {
                throw new Error(`${key} must be an object`);
            }

            if (this.schema[key].type === 'array' && data && data[key] && !Array.isArray(data[key])) {
                throw new Error(`${key} must be an array`);
            }

        })

        if(this.timestamp) {
            data.createdAt = new Date();
            data.updatedAt = new Date();
        }

        return data;
    }

    validateUpdate(data: any): object {
        Object.keys(data).forEach(key => {
            if (!this.schema[key]) {
                delete data[key];
                return;
            }

            if (this.schema[key].type === 'number' && data && data[key] && typeof data[key] !== 'number') {
                throw new Error(`${key} must be a number`);
            }

            if (this.schema[key].type === 'array' && data && data[key] && !Array.isArray(data[key])) {
                throw new Error(`${key} must be an array`);
            }

            if (this.schema[key].type === 'boolean' && data && data[key] && typeof data[key] !== 'boolean') {
                throw new Error(`${key} must be a boolean`);
            }

            if (this.schema[key].type === 'string' && data && data[key] && typeof data[key] !== 'string') {
                throw new Error(`${key} must be a string`);
            }

            if (this.schema[key].type === 'object' && data && data[key] && typeof data[key] !== 'object') {
                throw new Error(`${key} must be an object`);
            }

        })
        return data;
    }
}