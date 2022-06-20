"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const admin = require('firebase-admin');
const connect = (credential, databaseURI) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(credential),
            databaseURL: databaseURI
        });
        return;
    }
    catch (e) {
        throw e;
    }
});
exports.connect = connect;
